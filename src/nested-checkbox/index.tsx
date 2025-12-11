// FileExplorer.tsx
import { useState } from "react";
import json from "./data.json";
import { View, type JsonTypes } from "./View";

function ensureChecked(nodes: JsonTypes[]): JsonTypes[] {
  return nodes.map((n) => ({
    ...n,
    checked: !!n.checked,
    children: ensureChecked(n.children || []),
  }));
}

export default function FileExplorer() {
  const [data, setData] = useState<JsonTypes[]>(() => ensureChecked(json));
  return (
    <div className="p-6">
      <View data={data} setData={setData} />
    </div>
  );
}
