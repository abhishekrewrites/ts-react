import { useState, useEffect } from "react";

function Grid() {
  const [grid, setGrid] = useState<boolean[]>(Array(9).fill(false));
  const [order, setOrder] = useState<number[]>([]);

  function handleClick(idx: number) {
    setGrid((prev) => {
      const copy = [...prev];
      copy[idx] = true;
      return copy;
    });
    setOrder((prev) => [...prev, idx]);
  }

  useEffect(() => {
    const each = grid.every((item: boolean) => item);
    if (each) {
      setTimeout(() => {
        const rev: number[] = order.reverse();
        for (let i = 0; i < rev.length; i++) {
          const item = rev[i];
          setTimeout(() => {
            setGrid((prev) => {
              const copy = [...prev];
              copy[item] = false;
              return copy;
            });
          }, i * 300);
        }
      }, 1000);
    }
  }, [grid]);

  return (
    <div className="grid grid-cols-3 gap-1 w-[400px]">
      {grid.map((_, idx: number) => (
        <div
          key={idx}
          className="h-[100px] flex justify-center border border-[#ddd] items-center cursor-pointer"
          onClick={() => handleClick(idx)}
          style={{ background: grid[idx] ? "green" : "" }}
        >
          {idx}
        </div>
      ))}
    </div>
  );
}

export default Grid;
