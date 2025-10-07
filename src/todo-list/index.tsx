import { useState } from "react";

export type Entry = {
  name: string;
  isCompleted: boolean;
};

export type StoreTypes = {
  [id: string]: Entry;
};

function TodoList() {
  const [storeIds, setStoreIds] = useState<number[]>([]);
  const [store, setStore] = useState<StoreTypes>({});
  const [query, setQuery] = useState<string>("");

  function onkeydown(e: React.KeyboardEvent<HTMLInputElement>) {
    const now = Date.now();
    if (e.key === "Enter") {
      setStoreIds((prv) => [...prv, now]);
      setStore((prv) => ({
        ...prv,
        [now]: { name: query, isCompleted: false },
      }));
    }
  }

  function handleComplete(checked: boolean, id: number) {
    setStore((prv) => {
      const copy = { ...prv };
      copy[id].isCompleted = checked;
      return copy;
    });
  }

  return (
    <div>
      <div className="flex justify-center my-2">
        <input
          type="text"
          id="name"
          value={query}
          className="border border-[#424242] p-2 outline-none rounded-md w-[400px]"
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => onkeydown(e)}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setQuery(e.target.value)
          }
        />
      </div>
      <div>
        {storeIds &&
          storeIds.map((id: number) => {
            return (
              <ul key={id} className="flex items-center ml-4">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={store?.[id].isCompleted}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleComplete(e.target.checked, id)
                  }
                />
                <li
                  className="font-bold"
                  style={{
                    textDecoration: store?.[id].isCompleted
                      ? "line-through"
                      : "none",
                  }}
                >
                  {store?.[id].name}
                </li>
              </ul>
            );
          })}
      </div>
    </div>
  );
}

export default TodoList;
