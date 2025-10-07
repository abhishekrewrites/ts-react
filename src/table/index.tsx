import { useEffect, useState, useMemo, type ReactNode } from "react";

export type ColumnTypes = { id: string; value: string };

const LIMIT = 10;

const COLUMNS: ColumnTypes[] = [
  { id: "id", value: "Id" },
  { id: "userId", value: "userId" },
  { id: "title", value: "title" },
  { id: "body", value: "body" },
];

export type DataTypes = {
  id: string;
  userId: string;
  title: string;
  body: string;
};

type SortDir = "asc" | "desc" | null;

export default function Table() {
  const [query, setQuery] = useState<string>("");
  const [data, setData] = useState<DataTypes[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [current, setCurrent] = useState<number>(1);

  const [sortConfig, setSortConfig] = useState<{
    key: string | null;
    dir: SortDir;
  }>({
    key: null,
    dir: null,
  });

  async function fetchApi() {
    try {
      const resp = await fetch("https://jsonplaceholder.typicode.com/posts");
      const res = await resp.json();
      setData(res);
    } catch (e) {
      if (e instanceof Error) {
        setError(e);
      } else {
        throw new Error("unknown recieved");
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setLoading(true);
    fetchApi();
  }, []);

  const filterItems = useMemo(() => {
    let items = [...data];

    if (query) {
      items = items.filter((item) =>
        item.title.toLowerCase().includes(query.toLowerCase())
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
    }

    return items;
  }, [data, query, sortConfig]);

  function onSort(key: string) {
    setSortConfig((prev) => {
      if (prev.key !== key) {
        return { key, dir: "asc" as SortDir };
      }
      if (prev.dir === "asc") return { key, dir: "desc" as SortDir };
      if (prev.dir === "desc") return { key: null, dir: null };
      return { key, dir: "asc" as SortDir };
    });
  }

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;
  if (!data.length) return <div>No data found...</div>;

  const start = (current - 1) * LIMIT;
  const end = start + LIMIT;

  return (
    <div className="flex flex-col">
      <div className="flex my-2 justify-center">
        <input
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setQuery(e.target.value)
          }
          className="flex w-[300px] p-2 outline-0 border border-[#424242] rounded-md"
          value={query}
        />
        <select className="flex border border-gray-300 rounded-md ml-4">
          {COLUMNS.map((col: ColumnTypes) => {
            return <option key={col.id}>{col.value}</option>;
          })}
        </select>
      </div>

      <Itable
        data={filterItems}
        query={query}
        start={start}
        end={end}
        onSort={onSort}
        sortConfig={sortConfig}
      />
      <Pagination
        pages={Math.ceil(filterItems.length / LIMIT)}
        currentPage={current}
        setCurrent={setCurrent}
      />
    </div>
  );
}

function Itable({
  data,
  query,
  start,
  end,
  onSort,
  sortConfig,
}: {
  data: DataTypes[];
  query: string;
  start: number;
  end: number;
  onSort: (key: string) => void;
  sortConfig: any;
}) {
  function formatTitle(title: string, query: string): ReactNode {
    const idx = title.toLowerCase().indexOf(query.toLowerCase());
    if (idx === -1) return title;

    const before = title.slice(0, idx);
    const match = title.slice(idx, idx + query.length);
    const after = title.slice(idx + query.length);

    return (
      <>
        {before}
        <strong>{match}</strong>
        {after}
      </>
    );
  }

  return (
    <div>
      <table className="table-auto border-collapse w-full">
        <thead>
          <tr>
            {COLUMNS.map((col: ColumnTypes) => {
              return (
                <th className="bg-[#eee] px-4 py-2 " key={col.id}>
                  <button onClick={() => onSort(col.id)}>
                    {col.value}
                    {sortConfig.key === col.id &&
                      sortConfig.dir === "asc" &&
                      "↑"}
                    {sortConfig.key === col.id &&
                      sortConfig.dir === "desc" &&
                      "↓"}
                  </button>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {data.slice(start, end).map((row: DataTypes) => {
            return (
              <tr key={row.id} className="border border-b-[#ddd]">
                <td className="px-4 py-2">{row.id}</td>
                <td className="px-4 py-2">{row.userId}</td>
                {formatTitle(row.title, query)}
                <td className="px-4 py-2">{row.body}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function Pagination({
  pages,
  currentPage,
  setCurrent,
}: {
  pages: number;
  currentPage: number;
  setCurrent: () => void;
}) {
  return (
    <div className="flex justify-center my-4">
      <div
        className="h-[40px] w-[40px] border border-[#ddd] rounded-b-md flex justify-center items-center cursor-pointer"
        onClick={() =>
          setCurrent((prv) => {
            if (prv >= pages) {
              return pages;
            }
            return prv + 1;
          })
        }
      >
        {">"}
      </div>
      {Array(pages)
        .fill(null)
        .map((_, idx: number) => {
          return (
            <div
              className="h-[40px] w-[40px] border border-[#ddd] rounded-b-md flex justify-center items-center cursor-pointer"
              onClick={() => setCurrent(idx + 1)}
              style={{ background: currentPage === idx + 1 ? "#ddd" : "" }}
            >
              {idx + 1}
            </div>
          );
        })}
      <div
        className="h-[40px] w-[40px] border border-[#ddd] rounded-b-md flex justify-center items-center cursor-pointer"
        onClick={() =>
          setCurrent((prv) => {
            if (prv <= 1) {
              return 1;
            }
            return prv - 1;
          })
        }
      >
        {"<"}
      </div>
    </div>
  );
}
