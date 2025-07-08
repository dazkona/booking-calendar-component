import { Search } from "lucide-react";
import { useEffect, useState } from "react";

export type Value = {
  id: string;
  name: string;
};

interface AutocompleteProps {
  url: string;
  onSelectValue: (valueId: string) => void;
}

export const Autocomplete = ({ url, onSelectValue }: AutocompleteProps) => {
  const [values, setValues] = useState<Value[]>([]);
  const [filteredValues, setFilteredValues] = useState<Value[]>([]);
  const [showList, setShowList] = useState<boolean>(false);
  const [hideTimer, setHideTimer] = useState<ReturnType<typeof setTimeout> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const sort = (a: Value, b: Value) => a.name.localeCompare(b.name);

  //-------------------------------------------------------
  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        const mapped = Array.isArray(data) ? data.map((item) => ({ id: item.id, name: item.name })) : [];
        setValues(mapped);
        setFilteredValues([...mapped].sort(sort));
      })
      .catch((err) => {
        setError(err.message || "Error fetching values");
      })
      .finally(() => setLoading(false));
  }, [url]);

  //-------------------------------------------------------
  const onType = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchingFor = e.target.value.trim().toLowerCase();
    if (searchingFor.length >= 3)
      setFilteredValues(values.filter((s) => s.name.toLowerCase().includes(searchingFor)).sort(sort));
    else {
      setFilteredValues([...values].sort(sort));
      setShowList(true);
    }
  };

  //-------------------------------------------------------
  const handleMouseLeave = () => {
    if (hideTimer) clearTimeout(hideTimer);
    setHideTimer(setTimeout(() => setShowList(false), 5000));
  };
  const handleMouseEnter = () => {
    if (hideTimer) clearTimeout(hideTimer);
  };

  return (
    <>
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
      <input
        type="text"
        placeholder="Chose a value..."
        onChange={onType}
        onFocus={() => setShowList(true)}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={handleMouseEnter}
        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      {showList && (
        <div
          className="filtered-values absolute z-20 left-0 mt-2 border border-black bg-white p-3 w-full"
          onMouseLeave={handleMouseLeave}
          onMouseEnter={handleMouseEnter}
        >
          <div className="flex flex-col gap-2">
            {error ? (
              <div className="text-red-500">{error}</div>
            ) : loading ? (
              <div>Loading values...</div>
            ) : values.length ? (
              filteredValues.length ? (
                filteredValues.map((value) => (
                  <div
                    key={`${value.id}_${value.name}`}
                    className="w-full border border-gray-300 text-left p-1"
                    onClick={() => {
                      onSelectValue(value.id);
                      setShowList(false);
                    }}
                  >
                    {value.name}
                  </div>
                ))
              ) : (
                <div>No coincident values found</div>
              )
            ) : null}
          </div>
        </div>
      )}
    </>
  );
};
