import { useMemo, useState } from "react";
import data from "./data.json";

// 1. Mock Data with an HTML field ('info')
// const data = [
//   {
//     roll: 101,
//     name: "Alice",
//     marks: { maths: 90, science: 85, english: 88, history: 92, computer: 95 },
//     info: '<span style="color: green; font-weight: bold;">Pass</span> <br/> <i>Honor Roll</i>',
//   },
//   {
//     roll: 102,
//     name: "Bob",
//     marks: { maths: 45, science: 50, english: 48, history: 55, computer: 60 },
//     info: '<span style="color: orange;">Average</span>',
//   },
//   {
//     roll: 103,
//     name: "Charlie",
//     marks: { maths: 30, science: 35, english: 40, history: 33, computer: 25 },
//     info: '<span style="color: red; font-weight: bold;">Fail</span> <a href="#" style="text-decoration: underline;">Retake</a>',
//   },
// ];

// 2. Add the new column with an `isHtml` flag
const COLUMNS = [
  { key: "roll", label: "Roll" },
  { key: "name", label: "Name" },
  {
    key: "marks",
    label: "Marks",
    children: [
      { key: "maths", label: "Maths" },
      { key: "science", label: "Science" },
      { key: "english", label: "English" },
      { key: "history", label: "History" },
      { key: "computer", label: "Computer" },
    ],
  },
  { key: "info", label: "Student Info", isHtml: true }, // <--- New Column
];

function getNestedValue(obj, path) {
  return path
    .split("•")
    .reduce((acc, key) => (acc ? acc[key] : undefined), obj);
}

export function NestedDataTable() {
  const [filters, setFilters] = useState({});
  const [sortConfig, setSortConfig] = useState({ key: null, dir: null });

  function handleFilters(e, parentKey, childKey) {
    const finalKey = childKey ? `${parentKey}•${childKey}` : parentKey;
    const value = e.target.value;
    setFilters((prev) => ({ ...prev, [finalKey]: value }));
  }

  function onSort(parentKey, childKey = "") {
    const finalKey = childKey ? `${parentKey}•${childKey}` : parentKey;

    setSortConfig((prev) => {
      if (prev.key === finalKey) {
        if (prev.dir === "asc") return { key: finalKey, dir: "desc" };
        if (prev.dir === "desc") return { key: null, dir: null };
      }
      return { key: finalKey, dir: "asc" };
    });
  }

  const processedData = useMemo(() => {
    let result = [...data];

    // Filter Logic
    result = result.filter((row) => {
      return Object.entries(filters).every(([path, value]) => {
        if (!value) return true;
        const rowValue = getNestedValue(row, path);
        // Note: This will filter based on the raw HTML string (e.g. searching "span" will work)
        return String(rowValue).toLowerCase().includes(value.toLowerCase());
      });
    });

    // Sort Logic
    if (sortConfig.key && sortConfig.dir) {
      result.sort((a, b) => {
        const valA = getNestedValue(a, sortConfig.key);
        const valB = getNestedValue(b, sortConfig.key);

        if (valA < valB) return sortConfig.dir === "asc" ? -1 : 1;
        if (valA > valB) return sortConfig.dir === "asc" ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [filters, sortConfig]);

  const renderSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) {
      return <span className="text-gray-300 text-xs">⇅</span>;
    }
    if (sortConfig.dir === "asc") return <span>↑</span>;
    if (sortConfig.dir === "desc") return <span>↓</span>;
    return <span className="text-gray-300 text-xs">⇅</span>;
  };

  return (
    <div className="p-5 font-sans">
      <table className="border-collapse table-auto w-full">
        <thead className="bg-[#eee]">
          <tr>
            {COLUMNS.map((c) =>
              c.children ? (
                <th
                  key={c.key}
                  colSpan={c.children.length}
                  className="px-4 py-2 border border-[#ddd]"
                >
                  {c.label}
                </th>
              ) : (
                <th
                  key={c.key}
                  rowSpan={2}
                  className="px-4 py-2 border border-[#ddd] text-left align-top"
                >
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center font-bold">
                      {c.label}
                      <button
                        onClick={() => onSort(c.key)}
                        className="p-1 px-2 hover:bg-gray-800 cursor-pointer rounded ml-2"
                      >
                        {renderSortIcon(c.key)}
                      </button>
                    </div>
                    <input
                      onChange={(e) => handleFilters(e, c.key)}
                      className="border border-gray-300 p-1 outline-none rounded-md w-full text-sm font-normal"
                      placeholder={`Filter...`}
                    />
                  </div>
                </th>
              )
            )}
          </tr>
          {/* Sub-header row for grouped columns */}
          <tr>
            {COLUMNS.flatMap((col) =>
              col.children
                ? col.children.map((child) => {
                    const fullKey = `${col.key}•${child.key}`;
                    return (
                      <th
                        className="px-4 py-2 border border-[#ddd] text-left"
                        key={child.key}
                      >
                        <div className="flex flex-col gap-2">
                          <div className="flex justify-between items-center font-bold">
                            {child.label}
                            <button
                              onClick={() => onSort(col.key, child.key)}
                              className="p-1 px-2 hover:bg-gray-800 cursor-pointer rounded ml-2"
                            >
                              {renderSortIcon(fullKey)}
                            </button>
                          </div>
                          <input
                            className="border border-gray-300 p-1 outline-none rounded-md w-full text-sm font-normal"
                            onChange={(e) =>
                              handleFilters(e, col.key, child.key)
                            }
                            placeholder="..."
                          />
                        </div>
                      </th>
                    );
                  })
                : []
            )}
          </tr>
        </thead>
        <tbody>
          {processedData.map((row, rowIdx) => (
            <tr key={rowIdx} className="hover:bg-gray-50">
              {COLUMNS.map((col) => {
                if (col.children) {
                  return col.children.map((child) => (
                    <td
                      key={`${col.key}.${child.key}`}
                      className="px-4 py-2 border border-[#ddd] text-center"
                    >
                      {row[col.key][child.key]}
                    </td>
                  ));
                }

                return (
                  <td
                    key={col.key}
                    className="px-4 py-2 border border-[#ddd] text-center"
                    {...(col.isHtml
                      ? { dangerouslySetInnerHTML: { __html: row[col.key] } }
                      : { children: row[col.key] })}
                  />
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
