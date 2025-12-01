import { useCallback, useState } from "react";

export type CONFIG_TYPE = {
  [key: number]: number;
};

const ROWS: number = 10;
const BOARD_SIZE: number = 100;

export const CONFIG: CONFIG_TYPE = {
  //Ladder(Up)
  2: 38,
  7: 14,
  8: 31,
  15: 26,
  21: 42,
  28: 84,
  36: 44,
  51: 67,
  71: 91,
  78: 98,

  //Snakes(Down)
  16: 6,
  46: 25,
  49: 11,
  62: 19,
  64: 60,
  74: 53,
  89: 68,
  92: 88,
  95: 75,
  99: 80,
};

function isLadder(from, to) {
  return from < to;
}

function isSnake(to, from) {
  return to < from;
}

function buildRows() {
  const resultRows = [];
  for (let r = ROWS - 1; r >= 0; r--) {
    const start = r * ROWS + 1;
    const nums = Array.from({ length: ROWS }, (_, i) => start + i);

    if (r % 2 === 1) nums.reverse();
    resultRows.push(nums);
  }
  return resultRows;
}

export function SnakesLadder() {
  const [playerPosition, setPlayerPosition] = useState<number>(1);
  const [dice, setDice] = useState<null | number>(null);
  const [message, setMessage] = useState("");
  const [isGameOver, setIsGameOver] = useState(false);

  const rollDiceValue = useCallback(() => {
    return Math.floor(Math.random() * 6) + 1;
  }, []);

  const handleRoll = useCallback(() => {
    if (isGameOver) return;
    const d = rollDiceValue();
    setDice(d);
    setMessage(`you rolled a ${d}`);

    setTimeout(() => {
      setPlayerPosition((prev) => {
        const tentative = prev + d;

        if (tentative > BOARD_SIZE) {
          setMessage(
            `Need an exact roll to reach ${BOARD_SIZE}. Stay on ${prev}.`
          );
          return prev;
        }

        const jumped = CONFIG[tentative] ?? tentative;

        if (jumped !== tentative) {
          if (isLadder(tentative, jumped)) {
            setMessage(`Ladder! ${tentative} → ${jumped}`);
          }
        } else if (isSnake(jumped, tentative)) {
          setMessage(`Snake! ${tentative} → ${jumped}`);
        } else {
          setMessage(`Moved to ${jumped}.`);
        }

        if (jumped === BOARD_SIZE) {
          setIsGameOver(true);
          setMessage(`You reached ${BOARD_SIZE} — you win!`);
        }

        return jumped;
      });
    }, 520);
  }, [isGameOver, rollDiceValue]);

  return (
    <div>
      <div>
        <button onClick={() => handleRoll()}>Roll</button>
        <div>{dice}</div>
      </div>
      <div className="p-4">
        {buildRows().map((rowNum, rowIdx) => {
          return (
            <div key={rowIdx} className="grid grid-cols-10 gap-2 mb-2">
              {rowNum.map((num) => {
                const mapping = CONFIG[num];
                const isLadderDiv = isLadder(num, mapping);
                const isSnakeDiv = isLadder(mapping, num);
                return (
                  <div
                    key={num}
                    className="h-[60px] border border-[#ddd] rounded-md flex justify-between"
                    style={{
                      background: isLadderDiv
                        ? "linear-gradient(180deg, #f0fbf0 0%, #e8f9e8 100%)"
                        : isSnakeDiv
                        ? "linear-gradient(180deg, #fff5f5 0%, #fdecec 100%)"
                        : "",
                    }}
                  >
                    <div>{num}</div>
                    <div>
                      {isLadder(num, mapping)
                        ? "↗"
                        : isSnake(mapping, num)
                        ? "↘"
                        : ""}
                      {mapping}
                    </div>
                    {playerPosition === num ? (
                      <div className="flex h-[40px] w-[40px] relative z-2 bg-blue-700 rounded-full top-1/4 right-1/2"></div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
