interface ContentProps {
  data: number[];
  defaultTab?: string;
}

export default function Content({ data, defaultTab }: ContentProps) {
  return (
    <div>
      {data.map((it, idx) => (
        <div key={idx}>{it}</div>
      ))}
    </div>
  );
}
