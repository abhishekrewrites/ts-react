import { useState, useEffect, useMemo } from "react";
import { fetchApi } from "./api";
import type { ConfigurableMenuItem, MenuOption, MenuOptionGroup } from "./api";

export type ChoicesState = {
  [groupId: string]: string | string[];
};

export default function Menu() {
  const [data, setData] = useState<ConfigurableMenuItem | null>(null);
  const [error, setError] = useState<Error>();
  const [isLoading, setIsLoading] = useState<boolean>();
  const [choices, setChoices] = useState<ChoicesState>({
    bun: "",
    sauces: [],
  });

  async function fetchData() {
    try {
      const resp = await fetchApi();
      setData(resp);
    } catch (e) {
      if (e instanceof Error) {
        setError(e);
      } else {
        throw new Error("Unknown Error");
      }
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    setIsLoading(true);
    fetchData();
  }, []);

  const totalPrice = useMemo(() => {
    if (!data) return 0;
    let total = data.basePrice;

    for (const group of data.optionGroups) {
      const sel = choices[group.id];
      if (!sel) continue;

      if (group.selectionType === "single" && typeof sel === "string") {
        const opt = group.options.find((o) => o.id === sel);
        if (opt) total += opt.price;
      } else if (group.selectionType === "multi" && Array.isArray(sel)) {
        for (const id of sel) {
          const opt = group.options.find((o) => o.id === id);
          if (opt) total += opt.price;
        }
      }
    }

    return total;
  }, [data, choices]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;
  if (!data) return <div>No Data found</div>;

  console.log(totalPrice, "totalPrice");

  return (
    <div>
      <h1>{data.name}</h1>
      <span>₹ {data.basePrice}</span>
      <div>{data.description}</div>
      {data.optionGroups.map((group: MenuOptionGroup) => {
        return (
          <div key={group.id}>
            <h4 className="font-bold">{group.name}</h4>
            {group.options.map((option: MenuOption) => {
              if (group.selectionType === "single") {
                const isSelected = choices[group.id] === option.id;
                return (
                  <div key={option.id} className="ml-2">
                    <input
                      type="radio"
                      checked={isSelected}
                      id={option.id}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setChoices((prev) => ({
                          ...prev,
                          [group.id]: option.id,
                        }));
                      }}
                    />
                    <label className="ml-2" htmlFor={option.id}>
                      {option.name}
                    </label>
                    <span className="ml-2 font-bold">₹ {option.price}</span>
                  </div>
                );
              } else {
                return (
                  <div key={option.id} className="ml-2">
                    <input
                      type="checkbox"
                      id={option.id}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setChoices((prev) => {
                          const current = Array.isArray(prev[group.id])
                            ? (prev[group.id] as string[])
                            : [];
                          return {
                            ...prev,
                            [group.id]: e.target.checked
                              ? [...current, option.id]
                              : current.filter((id) => id !== option.id),
                          };
                        });
                      }}
                    />
                    <label className="ml-2" htmlFor={option.id}>
                      {option.name}
                    </label>
                    <span className="ml-2 font-bold">₹ {option.price}</span>
                  </div>
                );
              }
            })}
          </div>
        );
      })}
    </div>
  );
}
