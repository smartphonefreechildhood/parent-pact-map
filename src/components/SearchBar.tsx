import React, { useState, useEffect, useRef } from "react";
import Button from "./Button";

interface SearchBarProps {
  onSearch: (coords: [number, number]) => void;
}

interface LocationResult {
  lat: string;
  lon: string;
  display_name: string;
  type: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<LocationResult[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Debounced search function
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.length > 2) {
        fetchSuggestions();
      } else {
        setSuggestions([]);
        setShowDropdown(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchSuggestions = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}&limit=5&countrycodes=se`
      );
      const data = await response.json();
      setSuggestions(data);
      setShowDropdown(data.length > 0);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setSuggestions([]);
      setShowDropdown(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;

    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        query
      )}&countrycodes=se`
    );
    const data = await response.json();

    if (data && data.length > 0) {
      const { lat, lon } = data[0];
      onSearch([parseFloat(lat), parseFloat(lon)]);
      setShowDropdown(false);
    } else {
      alert("Location not found in Sweden");
    }
  };

  const handleSuggestionClick = (suggestion: LocationResult) => {
    setQuery(suggestion.display_name);
    onSearch([parseFloat(suggestion.lat), parseFloat(suggestion.lon)]);
    setShowDropdown(false);
  };

  return (
    <div ref={dropdownRef} className="relative z-50 w-full pointer-events-auto">
      <form onSubmit={handleSearch} className="flex flex-row gap-2">
        <input
          type="text"
          placeholder="Sök på stad, skola eller kommun"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() =>
            query.length > 2 && suggestions.length > 0 && setShowDropdown(true)
          }
          className="flex-1 px-4 py-2 text-sm w-80 border border-primary focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/10 text-white rounded-lg"
        />
        <Button type="submit" variant="primary">
          Sök
        </Button>
      </form>

      {/* Dropdown */}
      {showDropdown && (
        <div className="absolute top-full left-0 right-0 bg-background border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto z-50">
          {isLoading ? (
            <div className="p-2.5 text-center text-gray-600">Loading...</div>
          ) : (
            suggestions.map((suggestion, index) => (
              <div
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="p-2.5 cursor-pointer border-b border-gray-100 text-sm hover:bg-gray-50 transition-colors"
              >
                <div className="font-semibold">
                  {suggestion.display_name.split(",")[0]}
                </div>
                <div className="text-xs text-gray-600">
                  {suggestion.display_name}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
