import { useState, type ReactNode } from "react";
import type { JsonTypes } from "./";

interface ViewProps {
  data: JsonTypes[];
  setData: (prev: JsonTypes[]) => JsonTypes[];
}

export function View({ data, setData }: ViewProps) {
  const [type, setType] = useState<string | null>(null);
  const [query, setQuery] = useState<string>("");

  return (
    <div className="flex flex-col w-[400px]">
      <div className="flex">
        <button
          className="border border-gray-500 rounded-md p-2"
          onClick={() => setType("folder")}
        >
          +Folder
        </button>
        <button
          className="border border-gray-500 rounded-md p-2"
          onClick={() => setType("file")}
        >
          +File
        </button>
        {type && (
          <div className="flex">
            <input
              type="text"
              className="flex border border-gray-500 rounded-md"
              value={query}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setQuery(e.target.value)
              }
            />
            <button className="flex ml-2 items-center rounded-md border border-gray-700 p-2 cursor-pointer">
              Add
            </button>
          </div>
        )}
      </div>
      {data.map((leaf: JsonTypes) => {
        if (!leaf.isFolder) {
          return <File key={leaf.id} label={leaf.name} />;
        } else {
          return (
            <Folder key={leaf.id} label={leaf.name}>
              <View data={leaf.children} setData={setData} />
            </Folder>
          );
        }
      })}
    </div>
  );
}

interface FileProps {
  label: string;
}

function File({ label }: FileProps) {
  return (
    <li>
      <span>{label}</span>
    </li>
  );
}

interface FolderProps {
  label: string;
  children: ReactNode;
}

function Folder({ label, children }: FolderProps) {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div>
      <span onClick={() => setOpen((prev) => !prev)}>{label}</span>
      <div>{open && children}</div>
    </div>
  );
}
