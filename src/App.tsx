import { useState, useCallback, useRef } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ColorPlate } from "./Components/ColorPlate";
import { generateRandomColor } from "./utils/colorUtils";
import { toPng } from "html-to-image";

function App() {
  const ref = useRef<HTMLDivElement>(null);
  const [lockStatusArray, setLockStatusArray] = useState<Array<boolean>>(
    Array.from({ length: 5 }, () => false) as boolean[],
  );
  const [colors, setColors] = useState(
    Array.from({ length: 5 }, generateRandomColor),
  );

  const handleDownload = useCallback(() => {
    if (ref.current === null) {
      return;
    }

    toPng(ref.current, { cacheBust: true })
      .then((dataUrl: string) => {
        const link = document.createElement("a");
        link.download = "color-palette.png";
        link.href = dataUrl;
        link.click();
      })
      .catch((err: Error) => {
        console.log(err);
      });
  }, [ref]);

  const generateNewColors = () => {
    const newColors = colors.map((color, index) => {
      if (lockStatusArray[index]) {
        return color;
      } else {
        return generateRandomColor();
      }
    }, lockStatusArray);
    setColors(newColors);
  };

  document.body.onkeyup = (e) => {
    if (e.key === " " || e.code === "Space") {
      generateNewColors();
    }
  };

  const handleLockUnlock = (index: number) => {
    setLockStatusArray((prevStatus) => {
      const newStatus = [...prevStatus];
      newStatus[index] = !newStatus[index];
      return newStatus;
    });
  };

  return (
    <div className="flex h-screen flex-col">
      <ToastContainer />
      <header className="flex h-24 items-center justify-between px-2 md:px-6 lg:px-12">
        <h1 className="text-4xl font-bold text-red-500">Colors</h1>
        <div className=" flex gap-2 ">
          <button
            onClick={generateNewColors}
            className="ml-2 rounded bg-red-500 px-3 py-2 font-bold hover:bg-amber-600 active:bg-amber-700"
          >
            Generate
          </button>
          <button
            onClick={handleDownload}
            className="rounded bg-red-500 px-3 py-2 font-bold hover:bg-amber-600 active:bg-amber-700"
          >
            Download
          </button>
        </div>
      </header>
      <main ref={ref} className="grid grow grid-cols-1 md:grid-cols-5">
        {colors.map((color: string, index: number) => (
          <ColorPlate
            key={index}
            color={color}
            index={index}
            onIconClick={handleLockUnlock}
            lockStatus={lockStatusArray[index]}
          />
        ))}
      </main>
    </div>
  );
}

export default App;
