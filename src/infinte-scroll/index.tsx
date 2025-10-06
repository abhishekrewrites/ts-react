import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import type { ApiResponseTypes, ProductTypes } from "./types";
import { LIMIT } from "./types";

function debounce<T extends (...args: any[]) => any>(fn: T, delay: number) {
  let timer: ReturnType<typeof setTimeout> | undefined;

  return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

function InfiniteScroll() {
  const [data, setData] = useState<ApiResponseTypes | null>(null);
  const [query, setQuery] = useState<string>("");
  const [skip, setSkip] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const observer = useRef<IntersectionObserver | null>(null);

  const lastItemRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && hasMore && !loading) {
          setSkip((prev) => prev + LIMIT);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  async function fetchProducts(q = "") {
    setLoading(true);
    try {
      const res = await fetch(
        `https://dummyjson.com/products/search?q=${q}&limit=${LIMIT}&skip=${skip}`
      );
      const resp = await res.json();

      setData((prev) =>
        skip === 0 || !prev
          ? resp
          : { ...resp, products: [...prev.products, ...resp.products] }
      );

      setHasMore(skip + LIMIT < resp.total);
    } catch (e) {
      setError(e instanceof Error ? e : new Error("Unknown Error"));
    } finally {
      setLoading(false);
    }
  }

  const debouncedFunc = useMemo(() => debounce(fetchProducts, 700), []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value);
    setSkip(0);
    debouncedFunc(e.target.value);
  }

  useEffect(() => {
    if (skip !== 0) fetchProducts(query);
  }, [skip]);

  if (error) return <div>{error.message}</div>;

  return (
    <div>
      <div className="flex justify-center my-2">
        <input
          onChange={handleChange}
          className="w-[300px] border border-[#ddd] rounded-md outline-none p-2"
          placeholder="Search products..."
        />
      </div>

      <div className="grid grid-cols-5 gap-4">
        {!data && !query ? (
          <div></div>
        ) : (
          data &&
          data.products.map((product: ProductTypes, idx: number) => (
            <div
              key={product.id}
              ref={idx === data.products.length - 1 ? lastItemRef : null}
            >
              <img src={product.thumbnail} className="h-[200px] w-full" />
              <h3>{product.title}</h3>
              <div>
                <span className="font-bold">
                  $
                  {(
                    product.price *
                    (1 - product.discountPercentage / 100)
                  ).toFixed(2)}
                </span>{" "}
                <span className="line-through text-[#424242]">
                  ${product.price}
                </span>{" "}
                <span>({product.discountPercentage}% off)</span>
              </div>
            </div>
          ))
        )}
      </div>

      {loading && <div className="text-center my-2">Loading...</div>}
    </div>
  );
}

export default InfiniteScroll;
