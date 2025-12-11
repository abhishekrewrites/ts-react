import { useState } from "react";
import json from "./data.json";
import { View } from "./view";

export type JsonTypes = {
  id: number;
  name: string;
  children: JsonTypes[];
  isFolder: boolean;
};

function FileExplorer() {
  const [data, setData] = useState<JsonTypes[]>(json);

  return (
    <div className="p-10">
      <h1 className="text-xl font-bold mb-4">File Explorer</h1>
      <View data={data} setData={setData} />
    </div>
  );
}

export default FileExplorer;
