import { useState } from "react";

const BETS_CONFIG = { 0: [], 1: [], 2: [], 3: [] };

const DRAGGABLE_CHIPS = [5, 6, 7, 8];

export function DraggableChips() {
  const [bets, setBets] = useState(BETS_CONFIG);

  function onDragStart(e, d) {
    e.dataTransfer.setData("text", d);
  }

  function onDrop(e) {
    e.preventDefault();
    const dropSlot = e.currentTarget;
    const v = e.dataTransfer.getData("text");
    const index = Array.from(dropSlot.parentNode.children).indexOf(dropSlot);
    setBets((prev) => {
      const copy = { ...prev };
      const slotArr = Array.isArray(prev[index]) ? [...prev[index]] : [];
      slotArr.push(v);
      copy[index] = slotArr;
      return copy;
    });
  }

  return (
    <div>
      <div className="flex">
        {Object.keys(bets).map((b, idx) => (
          <div
            key={b}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => onDrop(e)}
            className="h-[100px] w-[100px] rounded-md border border-[#ddd] justify-center flex items-center cursor-pointer mr-2 relative"
          >
            {parseInt(b) + 1}
            {bets[idx].map((g, idx) => (
              <div
                className="flex absolute top-1 h-[24px] w-[24px] justify-center items-center rounded-full border border-red-500"
                key={idx}
                style={{ left: `${idx * 26}px` }}
              >
                {g}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="flex mt-[20px]">
        {DRAGGABLE_CHIPS.map((d, idx) => (
          <div
            key={d}
            draggable
            onDragStart={(e) => onDragStart(e, d)}
            className="h-[40px] w-[40px] rounded-full border border-[#ddd] justify-center flex items-center cursor-pointer mr-2"
          >
            {d}
          </div>
        ))}
      </div>
    </div>
  );
}
