import React, { useState, useMemo } from "react";

// 1. Helper function to access nested data safeley
// Example: getNestedValue(user, 'address.city') returns the city string
const getNestedValue = (object, path) => {
  return path
    .split(".")
    .reduce(
      (obj, key) => (obj && obj[key] !== "undefined" ? obj[key] : undefined),
      object
    );
};

const DataTable = ({ data, columns }) => {
  // --- State Management ---
  const [filters, setFilters] = useState({});
  const [sortKey, setSortKey] = useState(columns[0].accessor); // Default to first column
  const [sortOrder, setSortOrder] = useState("asc");

  // --- Handlers ---
  const handleFilterChange = (accessor, value) => {
    setFilters((prev) => ({
      ...prev,
      [accessor]: value,
    }));
  };

  console.log(filters);

  // --- Logic: Filtering & Sorting ---
  const processedData = useMemo(() => {
    let result = [...data];

    // 1. Apply Filters
    result = result.filter((row) => {
      // Check every active filter
      return Object.entries(filters).every(([accessor, filterValue]) => {
        if (!filterValue) return true; // Skip empty filters

        const cellValue = getNestedValue(row, accessor);
        const cellString = cellValue ? String(cellValue).toLowerCase() : "";
        const filterString = filterValue.toLowerCase();

        return cellString.includes(filterString);
      });
    });

    // 2. Apply Sorting
    if (sortKey) {
      result.sort((a, b) => {
        const valueA = getNestedValue(a, sortKey);
        const valueB = getNestedValue(b, sortKey);

        // Handle string vs number comparison
        if (valueA < valueB) return sortOrder === "asc" ? -1 : 1;
        if (valueA > valueB) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [data, filters, sortKey, sortOrder]);

  return (
    <div style={{ fontFamily: "sans-serif", padding: "20px" }}>
      {/* --- Controls: Sorting (Using only Select) --- */}
      <div
        style={{
          marginBottom: "15px",
          padding: "10px",
          background: "#f4f4f4",
          borderRadius: "8px",
        }}
      >
        <strong>Sort Control: </strong>
        <label>
          Column:
          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value)}
            style={{ marginLeft: "5px", marginRight: "15px", padding: "5px" }}
          >
            {columns.map((col) => (
              <option key={col.accessor} value={col.accessor}>
                {col.header}
              </option>
            ))}
          </select>
        </label>

        <label>
          Order:
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            style={{ marginLeft: "5px", padding: "5px" }}
          >
            <option value="asc">Ascending (A-Z)</option>
            <option value="desc">Descending (Z-A)</option>
          </select>
        </label>
      </div>

      {/* --- Table Component --- */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          border: "1px solid #ddd",
        }}
      >
        <thead>
          <tr style={{ background: "#f9f9f9" }}>
            {columns.map((col) => (
              <th
                key={col.accessor}
                style={{
                  padding: "10px",
                  border: "1px solid #ddd",
                  textAlign: "left",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "5px",
                  }}
                >
                  {/* Column Header Name */}
                  <span>{col.header}</span>

                  {/* --- Filter: Input inside Column --- */}
                  <input
                    type="text"
                    placeholder={`Filter ${col.header}...`}
                    value={filters[col.accessor] || ""}
                    onChange={(e) =>
                      handleFilterChange(col.accessor, e.target.value)
                    }
                    style={{ padding: "4px", fontSize: "12px" }}
                  />
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {processedData.length > 0 ? (
            processedData.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map((col) => (
                  <td
                    key={col.accessor}
                    style={{ padding: "10px", border: "1px solid #ddd" }}
                  >
                    {/* Render Nested Value */}
                    {getNestedValue(row, col.accessor)}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length}
                style={{ padding: "20px", textAlign: "center", color: "#888" }}
              >
                No data matches your filters.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

// --- Usage Example with Nested Data ---

export const SelectNested = () => {
  // Sample Data with Nested Objects
  const rawData = [
    {
      id: 1,
      name: "Alice Johnson",
      job: { title: "Engineer", dept: "Tech" },
      location: { city: "New York", country: "USA" },
    },
    {
      id: 2,
      name: "Bob Smith",
      job: { title: "Designer", dept: "Creative" },
      location: { city: "London", country: "UK" },
    },
    {
      id: 3,
      name: "Charlie Brown",
      job: { title: "Manager", dept: "Sales" },
      location: { city: "Paris", country: "France" },
    },
    {
      id: 4,
      name: "David Lee",
      job: { title: "Engineer", dept: "Tech" },
      location: { city: "Berlin", country: "Germany" },
    },
  ];

  // Column Configuration (using dot notation for nested access)
  const columns = [
    { header: "Name", accessor: "name" },
    { header: "Job Title", accessor: "job.title" }, // Nested
    { header: "Department", accessor: "job.dept" }, // Nested
    { header: "City", accessor: "location.city" }, // Nested
  ];

  return <DataTable data={rawData} columns={columns} />;
};
