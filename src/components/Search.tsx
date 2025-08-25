import { useEffect, useRef, useState } from "react";
import Button from "./Button";
import { useDebounce } from "../hooks/useDebounce";
import { useGoogleMapsInit } from "../hooks/useGoogleMapsInit";
import {
  resolveSuggestionToCoords,
  geocodeAddress,
  type LocationInfo,
} from "../util/searchUtils";
import { fetchSuggestions } from "../util/suggestionsFetcher";
import { MIN_QUERY_LENGTH, DEBOUNCE_DELAY } from "../config/searchConfig";
import type { Suggestion } from "../types/SearchTypes";
import SearchDropdown from "./SearchDropdown";

interface SearchProps {
  onSearch: (locationInfo: LocationInfo) => void;
  apiKey?: string;
}

function Search({ onSearch, apiKey }: SearchProps) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { geocoderRef, sessionTokenRef } = useGoogleMapsInit(apiKey);
  const debouncedQuery = useDebounce(query, DEBOUNCE_DELAY);

  const suggestionsCache = useRef(new Map<string, Suggestion[]>());

  const geocodeCache = useRef(new Map<string, LocationInfo>());

  const limitCacheSize = <K, V>(cache: Map<K, V>, maxSize: number) => {
    if (cache.size > maxSize) {
      const firstKey = cache.keys().next().value;
      if (firstKey) {
        cache.delete(firstKey);
      }
    }
  };

  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.trim().length < MIN_QUERY_LENGTH) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    setIsLoading(true);

    const getSuggestions = async () => {
      const municipalitySearch = debouncedQuery.toLowerCase().includes("kommun")
        ? debouncedQuery
        : `${debouncedQuery} kommun`;

      const cached = suggestionsCache.current.get(municipalitySearch);
      if (cached) {
        setSuggestions(cached);
        setShowDropdown(cached.length > 0 && isFocused);
        setIsLoading(false);
        return;
      }

      try {
        const newSuggestions = await fetchSuggestions(
          municipalitySearch,
          sessionTokenRef.current
        );

        const filteredSuggestions = newSuggestions.filter(
          (s) =>
            !s.placePrediction?.text
              .toString()
              .toLowerCase()
              .includes("kommune")
        );

        suggestionsCache.current.set(municipalitySearch, filteredSuggestions);

        limitCacheSize(suggestionsCache.current, 20);

        setSuggestions(filteredSuggestions);
        setShowDropdown(filteredSuggestions.length > 0 && isFocused);
      } catch (err) {
        console.error("AutocompleteSuggestion error", err);
        setSuggestions([]);
        setShowDropdown(false);
      } finally {
        setIsLoading(false);
      }
    };

    getSuggestions();
  }, [debouncedQuery, isFocused]);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const trimmedQuery = query.trim();

    const cachedLocation = geocodeCache.current.get(trimmedQuery);
    if (cachedLocation) {
      onSearch(cachedLocation);
      setShowDropdown(false);
      sessionTokenRef.current =
        new google.maps.places.AutocompleteSessionToken();
      return;
    }

    setIsLoading(true);
    const locationInfo = await geocodeAddress(
      trimmedQuery,
      geocoderRef.current
    );
    setIsLoading(false);

    if (locationInfo) {
      geocodeCache.current.set(trimmedQuery, locationInfo);

      limitCacheSize(geocodeCache.current, 10);

      onSearch(locationInfo);
      setShowDropdown(false);
      sessionTokenRef.current =
        new google.maps.places.AutocompleteSessionToken();
    } else {
      console.warn("Location not found in Sweden");
    }
  };

  const handleSuggestionClick = async (s: Suggestion) => {
    const label = s.placePrediction?.text.toString() ?? "";
    setQuery(label);
    setShowDropdown(false);
    setIsFocused(false);
    inputRef.current?.blur();
    setIsLoading(true);
    const locationInfo = await resolveSuggestionToCoords(s);
    setIsLoading(false);

    if (locationInfo) {
      onSearch(locationInfo);
      sessionTokenRef.current =
        new google.maps.places.AutocompleteSessionToken();
    } else {
      console.warn("Could not get coordinates for this location");
    }
  };

  return (
    <div ref={dropdownRef} className="relative z-50 w-full pointer-events-auto">
      <form onSubmit={handleSearch} className="flex flex-row gap-2">
        <div className="relative flex-1 w-80">
          <input
            ref={inputRef}
            type="text"
            placeholder="Sök efter kommun"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="w-full px-4 py-2 text-sm border border-primary focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/10 text-white rounded-lg"
          />

          {showDropdown && (
            <div className="absolute top-full left-0 right-0 bg-background border border-gray-600 rounded-md shadow-lg max-h-48 overflow-y-auto z-50">
              <SearchDropdown
                isLoading={isLoading}
                suggestions={suggestions}
                onSuggestionClick={handleSuggestionClick}
              />
            </div>
          )}
        </div>

        <Button type="submit" variant="primary" disabled={isLoading}>
          Sök
        </Button>
      </form>
    </div>
  );
}

export default Search;
