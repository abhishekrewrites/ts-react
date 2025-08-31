import { useState, lazy, Suspense, useEffect } from "react";
import { getData } from "./unitlity";
import type { TabType } from "./unitlity";

const LazyContent = lazy(() => import("./content"));

type TabContent = {
  label: string;
  value: TabType;
};

const TABS = [
  { label: "Primary", value: "primary" },
  { label: "Secondary", value: "secondary" },
  { label: "Tertiary", value: "tertiary" },
] as TabContent[];

function TabPanel() {
  const [defaultTab, setDefaultTab] = useState<TabType>("primary");
  const [data, setData] = useState<number[]>([]);

  useEffect(() => {
    async function fetchData() {
      const resp = await getData(defaultTab);
      setData(resp);
    }

    fetchData();
  }, [defaultTab]);

  function handleClick(e: React.MouseEvent<HTMLButtonElement>, tab: TabType) {
    setDefaultTab(tab);
  }

  return (
    <div>
      <div className="flex">
        {TABS.map((tab: TabContent, idx: number) => (
          <button
            onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
              handleClick(e, tab.value)
            }
            key={idx}
            className={`p-2 rounded-sm border-indigo-900 border font-semibold cursor-pointer ${
              defaultTab === tab.value ? "bg-indigo-500" : ""
            } ${defaultTab === tab.value ? "text-white" : "text-[#424242]"}`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <LazyContent defaultTab={defaultTab} data={data} />
      </Suspense>
    </div>
  );
}

export default TabPanel;
