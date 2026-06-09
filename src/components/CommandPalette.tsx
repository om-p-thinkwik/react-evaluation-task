/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useRef, useState } from "react";
import { searchCommands, type Command } from "./command";

const CommandPalette = () => {
  const [search, setSearch] = useState<string>("");
  const [searchItems, setSearchItems] = useState<Command[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [cursor, setCursor] = useState<number>(0);
  const cursorRef = useRef(cursor);

  const getSearchResults = async (search: string) => {
    const response = await searchCommands(search);
    setSearchItems(response);
    return response;
  };

  useEffect(() => {
    cursorRef.current = cursor;
  }, [cursor]);

  const keyDownHandler = (event: KeyboardEvent) => {
    if (event.key === "ArrowDown") {
      setCursor((prev) => prev + 1);
    } else if (event.key === "ArrowUp") {
      setCursor((prev) => prev - 1);
    } else if (event.key === "Enter") {
      searchItems[cursorRef.current].action();
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", keyDownHandler);
  }, []);

  useEffect(() => {
    if (!search || search === "") return;
    setCursor(0);
    try {
      setIsLoading(true);
      const apiResponse = getSearchResults(search);
      apiResponse.finally(() => setIsLoading(false));
    } catch (error) {
      console.error(error);
    } finally {
      setSearch("");
    }
  }, [search]);

  return (
    <div className="flex flex-col gap-2 justify-center border border-black p-2 mx-6 rounded-[15px]">
      <div className="flex gap-2">
        <label htmlFor="search">Search Input</label>
        <input
          placeholder="Search"
          onChange={(e) => {
            setSearch(e.target.value);
            if (e.target.value === "") setSearchItems([]);
          }}
        />
      </div>
      <div className="flex flex-col justify-center border rounded-[15px]">
        {isLoading ? (
          <div className="p-4">Loading...</div>
        ) : searchItems && searchItems.length !== 0 ? (
          searchItems.map((item: Command, index: number) => {
            return (
              <div
                className={`flex gap-2 p-2 rounded-[15px] ${index === cursor ? "border-amber-500 bg-amber-200" : ""}`}
              >
                <span>Label: {item.label}</span>
                <span>
                  Following tasks can be performed: {item.keywords?.join(", ")}
                </span>
              </div>
            );
          })
        ) : (
          <div className="p-4">No results found</div>
        )}
      </div>
    </div>
  );
};

export default CommandPalette;
