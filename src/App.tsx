import { useEffect, useState } from "react";
import "./App.css";
import CommandPalette from "./components/CommandPalette";

function App() {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const keyDownHandler = (event: KeyboardEvent) => {
    if ((event.metaKey || event.ctrlKey) && event.key === "k") {
      event.preventDefault();
      setIsOpen(true);
    } else if (event.key === "Escape") setIsOpen(false);
  };

  useEffect(() => {
    window.addEventListener("keydown", keyDownHandler);
  }, []);

  return (
    <>
      <div className="flex justify-center items-center p-4">
        <label>Type Cmd + k to open & Esc to close</label>
      </div>

      {isOpen && <CommandPalette />}
    </>
  );
}

export default App;
