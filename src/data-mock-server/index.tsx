import { useEffect, useState, useMemo } from "react";
import type {
  CommentType,
  PaginationPropsTypes,
  TableViewPropsTypes,
  COLUMN_TYPE,
  SortConfig,
  SortDir,
} from "./types";
import { COLUMNS, LIMIT } from "./types";

function getPaginationRange(
  currentPage: number,
  totalPages: number,
  delta = 2
) {
  const range: (number | string)[] = [];
  const left = Math.max(2, currentPage - delta);
  const right = Math.min(totalPages - 1, currentPage + delta);

  range.push(1);

  if (left > 2) range.push("...");

  for (let i = left; i <= right; i++) {
    range.push(i);
  }

  if (right < totalPages - 1) range.push("...");

  if (totalPages > 1) range.push(totalPages);

  return range;
}

function MockDataTable() {
  const [comments, setComments] = useState<CommentType[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [query, setQuery] = useState<string>("");
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: null,
    dir: null,
  });

  useEffect(() => {
    async function fetchComments() {
      const res = await fetch("https://jsonplaceholder.typicode.com/comments");
      const data = await res.json();
      setComments(data);
    }
    fetchComments();
  }, []);

  function onSort(key: string) {
    setSortConfig((prev) => {
      if (prev.key !== key) {
        return { key, dir: "asc" as SortDir };
      }
      if (prev.dir === "asc") return { key, dir: "desc" as SortDir };
      if (prev.dir === "desc") return { key: null, dir: null };
      return { key, dir: "desc" as SortDir };
    });
  }

  const filterItems = useMemo(() => {
    let items = [...comments];

    if (query) {
      items = comments.filter((comment: CommentType) =>
        comment.name.toLowerCase().includes(query.toLowerCase())
      );
    }

    if (sortConfig.key && sortConfig.dir) {
      items.sort((a, b) => {
        const aVal = a[sortConfig.key as keyof DataTypes];
        const bVal = b[sortConfig.key as keyof DataTypes];
        const compare =
          typeof aVal === "string" && typeof bVal === "string"
            ? aVal.localeCompare(bVal)
            : Number(aVal) - Number(bVal);
        return sortConfig.dir === "asc" ? compare : -compare;
      });

      return items;
    }

    return items;
  }, [query, comments, sortConfig]);

  const totalPages = Math.ceil(filterItems.length / LIMIT);
  const start = (currentPage - 1) * LIMIT;
  const end = start + LIMIT;
  const currentData = filterItems.slice(start, end);

  useEffect(() => {
    setCurrentPage(1);
  }, [query]);

  const paginationRange = getPaginationRange(currentPage, totalPages);

  return (
    <div className="p-4">
      <div className="flex justify-center relative">
        <div className="relative">
          <input
            placeholder="Search by name..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex w-[400px] p-3 border my-4 border-[#424242] outline-none rounded-md"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute cursor-pointer right-1 top-[28px]"
            >
              ✖️
            </button>
          )}
        </div>
      </div>

      <TableView
        comments={currentData}
        query={query}
        onSort={onSort}
        sortConfig={sortConfig}
      />

      <Pagination
        paginationRange={paginationRange}
        totalPages={totalPages}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
}

function TableView({
  comments,
  query,
  onSort,
  sortConfig,
}: TableViewPropsTypes) {
  function formatName(name: string) {
    if (!query) return <td>{name}</td>;

    const index = name.toLowerCase().indexOf(query.toLowerCase());
    if (index === -1) return <td>{name}</td>;

    const before = name.slice(0, index);
    const match = name.slice(index, index + query.length);
    const after = name.slice(index + query.length);

    return (
      <td className="px-2 py-4">
        {before}
        <strong>{match}</strong>
        {after}
      </td>
    );
  }

  return (
    <table className="table-auto border-collapse w-full">
      <thead>
        <tr className="bg-[#ddd]">
          {COLUMNS.map((col: COLUMN_TYPE) => (
            <th className="px-2 py-4" key={col.key}>
              <button
                className="flex items-center"
                onClick={() => onSort(col.key)}
              >
                {col.value}
                {sortConfig.key === col.key && sortConfig.dir === "asc" && "↑"}
                {sortConfig.key === col.key && sortConfig.dir === "desc" && "↓"}
              </button>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {comments.map((col: CommentType) => (
          <tr key={col.id}>
            <td className="px-2 py-4">{col.id}</td>
            <td className="px-2 py-4">{col.postId}</td>
            {formatName(col.name)}
            <td className="px-2 py-4">{col.email}</td>
            <td className="px-2 py-4">{col.body}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// --- Pagination Component ---
function Pagination({
  paginationRange,
  totalPages,
  currentPage,
  setCurrentPage,
}: PaginationPropsTypes) {
  if (totalPages === 0) return null;

  return (
    <div className="flex justify-center items-center gap-2 mt-4">
      {/* Previous */}
      <button
        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        className="flex h-[40px] w-[40px] justify-center items-center cursor-pointer border border-[#eee] rounded-md"
      >
        {"<"}
      </button>

      {/* Page Numbers */}
      {paginationRange.map((item, idx) => (
        <button
          key={idx}
          onClick={() => typeof item === "number" && setCurrentPage(item)}
          disabled={item === "..."}
          style={{
            background: currentPage === item ? "#ddd" : "",
          }}
          className="flex h-[40px] w-[40px] justify-center items-center cursor-pointer border border-[#eee] rounded-md"
        >
          {item}
        </button>
      ))}

      {/* Next */}
      <button
        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
        className="flex h-[40px] w-[40px] justify-center items-center cursor-pointer border border-[#eee] rounded-md"
      >
        {">"}
      </button>
    </div>
  );
}

export default MockDataTable;
