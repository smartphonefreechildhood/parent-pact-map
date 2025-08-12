import type { Suggestion } from "../types/SearchTypes";

interface SearchDropdownProps {
  isLoading: boolean;
  suggestions: Suggestion[];
  onSuggestionClick: (s: Suggestion) => void;
}

function SearchDropdown({
  isLoading,
  suggestions,
  onSuggestionClick,
}: SearchDropdownProps) {
  if (isLoading) {
    return <div className="p-2.5 text-center text-gray-600">Loading...</div>;
  }

  if (suggestions.length === 0) {
    return <div className="p-2.5 text-center text-gray-600">No results</div>;
  }

  return (
    <>
      {suggestions.map((s) => {
        const key =
          s.placePrediction?.placeId ??
          s.placePrediction?.text.toString() ??
          "";
        const primary = s.placePrediction?.text.toString() ?? "";
        return (
          <div
            key={key}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => onSuggestionClick(s)}
            className="p-2.5 cursor-pointer border-b border-gray-600 text-sm hover:bg-background/60 transition-colors"
          >
            <div className="font-semibold">{primary}</div>
          </div>
        );
      })}
    </>
  );
}

export default SearchDropdown;
