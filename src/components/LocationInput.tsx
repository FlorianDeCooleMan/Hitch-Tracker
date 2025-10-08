import { useState, useEffect } from "react";

interface LocationInputProps {
  label: string;
  value: string;
  apiKey: string;
  onSelect: (place: { name: string; coords: [number, number] }) => void;
}

/**
 * LocationInput component
 * - Displays a text input with autocomplete powered by OpenRouteService's geocoding API.
 * - Shows up to 5 suggestions as the user types.
 * - Allows clicking a suggestion to fill in the input and send the selected coordinates upward.
 */
export default function LocationInput({
  label,
  value,
  apiKey,
  onSelect,
}: LocationInputProps) {
  const [inputValue, setInputValue] = useState(value);
  const [suggestions, setSuggestions] = useState<
    { name: string; coords: [number, number] }[]
  >([]);
  const [isFocused, setIsFocused] = useState(false);
  const [loading, setLoading] = useState(false);

  /**
   * Fetch autocomplete results when input changes.
   * - Debounced by 300ms to prevent API spamming.
   * - Cancels previous request if the user keeps typing.
   */
  useEffect(() => {
    if (inputValue.length < 2) {
      setSuggestions([]);
      return;
    }

    const controller = new AbortController();
    const fetchSuggestions = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://api.openrouteservice.org/geocode/autocomplete?api_key=${apiKey}&text=${encodeURIComponent(
            inputValue
          )}&size=5`,
          { signal: controller.signal }
        );
        const data = await res.json();
        if (data.features) {
          setSuggestions(
            data.features.map((f: any) => ({
              name: f.properties.label,
              coords: [
                f.geometry.coordinates[0],
                f.geometry.coordinates[1],
              ] as [number, number],
            }))
          );
        }
      } catch {
        // Ignore errors (like aborted fetch)
      } finally {
        setLoading(false);
      }
    };

    const timeout = setTimeout(fetchSuggestions, 300);
    return () => {
      controller.abort();
      clearTimeout(timeout);
    };
  }, [inputValue, apiKey]);

  /** Handles when the user clicks a suggestion */
  const handleSelect = (place: { name: string; coords: [number, number] }) => {
    setInputValue(place.name);
    setSuggestions([]);
    onSelect(place); // Pass data back up to parent component
  };

  return (
    <div className="relative">
      {/* Input label */}
      <label className="block text-sm font-medium mb-1">{label}</label>

      {/* Text input field */}
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setTimeout(() => setIsFocused(false), 200)} // delay for click registration
        placeholder="Typ een locatie..."
        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
      />

      {/* Suggestion dropdown */}
      {isFocused && suggestions.length > 0 && (
        <ul className="absolute z-10 bg-white border rounded-lg shadow-md mt-1 w-full overflow-hidden animate-fadeIn">
          {suggestions.map((s, i) => (
            <li
              key={i}
              onClick={() => handleSelect(s)}
              className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer transition-colors"
            >
              {s.name}
            </li>
          ))}
        </ul>
      )}

      {/* Small loading indicator (top-right corner) */}
      {loading && (
        <div className="absolute right-3 top-9 text-xs text-gray-400">⏳</div>
      )}
    </div>
  );
}
