import { useState, useEffect } from "react";

const LIMIT = 6;

export default function JobBoard() {
  const [news, setNews] = useState<any[]>([]);
  const [current, setCurrent] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  async function fetchIds() {
    try {
      const re = await fetch(
        "https://hacker-news.firebaseio.com/v0/jobstories.json"
      );
      const res = await re.json();
      let results = [];
      for (const id of res) {
        const s = await fetch(
          `https://hacker-news.firebaseio.com/v0/item/${id}.json`
        );

        const uu = await s.json();
        results.push(uu);
      }
      setNews(results);
    } catch (e) {
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setLoading(true);
    fetchIds();
  }, []);

  const start = 0;
  const end = (current + 1) * LIMIT;
  const hasMore = end < news.length;

  function formatDateTime(timestamp: number) {
    const date = new Date(timestamp * 1000); // Convert seconds → ms

    const day = date.getUTCDate().toString().padStart(2, "0");
    const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
    const year = date.getUTCFullYear();

    let hours = date.getUTCHours();
    const minutes = date.getUTCMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12; // Convert 0 → 12-hour format

    const hh = hours.toString().padStart(2, "0");

    return `${day}/${month}/${year}, ${hh}:${minutes} ${ampm}`;
  }

  if (loading) return <div>Loading...</div>;
  if (!news.length) return <div>No Data Found</div>;

  return (
    <div>
      {news.slice(start, end).map((news) => {
        return (
          <a
            href={news.url}
            key={news.id}
            className="flex border border-[#ddd] p-2 rounded-md my-2"
          >
            <div>
              <h4>{news.title}</h4>
              <div>
                <span>By {news.by}</span>
                <span className="ml-2">{formatDateTime(news.time)}</span>
                <span></span>
              </div>
            </div>
          </a>
        );
      })}
      {hasMore && (
        <button
          onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
            setCurrent((prev) => prev + 1)
          }
          className="p-2 cursor-pointer rounded-md bg-orange-500 text-white font-bold"
        >
          Load More
        </button>
      )}
    </div>
  );
}
