import { useEffect, useRef, useState } from "react";
import { searchCommands, type Command } from "./command";
import { useDebounce } from "../hooks/useDebounce";

const CommandPalette = () => {
  const [search, setSearch] = useState<string>("");
  const [searchItems, setSearchItems] = useState<Command[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [cursor, setCursor] = useState<number>(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const requestIdRef = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const debouncedSearch = useDebounce(search, 300);
  let currentIndex = -1;

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleKeyDown = async (event: KeyboardEvent) => {
      if (event.key === "ArrowDown") {
        setCursor((prev) => Math.min(prev + 1, searchItems.length - 1));
      } else if (event.key === "ArrowUp") {
        setCursor((prev) => Math.max(prev - 1, 0));
      } else if (event.key === "Enter") {
        setSelectedIndex(cursor);
        await searchItems[cursor]?.action();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [cursor, searchItems]);

  useEffect(() => {
    if (!debouncedSearch.trim()) return;

    const fetchResults = async () => {
      const requestId = ++requestIdRef.current;
      try {
        setIsLoading(true);
        const results = await searchCommands(debouncedSearch);

        if (requestId === requestIdRef.current) {
          setSearchItems(results);
          setIsLoading(false);
        }
      } catch (error) {
        if (requestId === requestIdRef.current) {
          setIsLoading(false);
        }
        console.error(error);
      }
    };

    fetchResults();
  }, [debouncedSearch]);

  useEffect(() => {
    itemRefs.current[cursor]?.scrollIntoView({
      block: "nearest",
    });
  }, [cursor]);

  const groupedItems = searchItems.reduce(
    (acc, item) => {
      if (!acc[item.group]) {
        acc[item.group] = [];
      }

      acc[item.group].push(item);

      return acc;
    },
    {} as Record<Command["group"], Command[]>,
  );

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    setSearch(value);
    setCursor(0);
    setSelectedIndex(null);

    if (!value.trim()) {
      requestIdRef.current++;
      setSearchItems([]);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 justify-center border border-black p-2 mx-6 rounded-[15px]">
      <div className="flex items-center gap-2">
        <label htmlFor="search" className="min-w-25">
          Search Input:{" "}
        </label>
        <input
          placeholder="Search commands..."
          className="w-full min-h-10 px-3 text-sm outline-none border border-gray-200 rounded-[15px]"
          ref={inputRef}
          onChange={handleSearchChange}
        />
      </div>
      <div className="flex flex-col border rounded-[15px] overflow-hidden">
        <div className="max-h-120 overflow-y-auto">
          {isLoading ? (
            <div className="p-6 text-center text-gray-500">Loading...</div>
          ) : !search ? (
            <div className="p-6 text-center text-gray-500">
              Start typing to search commands...
            </div>
          ) : searchItems && searchItems.length !== 0 ? (
            Object.entries(groupedItems).map(([group, items]) => (
              <div key={group}>
                <div className="px-4 py-2 text-xs uppercase font-semibold text-gray-500">
                  {group}
                </div>

                {items.map((item) => {
                  currentIndex++;
                  const itemIndex = currentIndex;

                  return (
                    <div
                      key={item.id}
                      className={`px-4 py-3 cursor-pointer transition-colors ${
                        currentIndex === selectedIndex
                          ? "bg-blue-50 border-l-4 border-blue-600"
                          : currentIndex === cursor
                            ? "bg-slate-100 border-l-4 border-slate-500"
                            : ""
                      }`}
                      ref={(el) => {
                        itemRefs.current[itemIndex] = el;
                      }}
                    >
                      {item.label}
                    </div>
                  );
                })}
              </div>
            ))
          ) : (
            <div className="p-6 text-center text-gray-500">
              No commands found
            </div>
          )}
        </div>
        <div className="border-t px-4 py-3 text-xs text-gray-500">
          ↑ ↓ Navigate • Enter Select • Esc Close
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
