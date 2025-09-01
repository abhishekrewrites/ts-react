import { useState, type ReactNode } from "react";
import type { JsonTypes } from "./";

interface ViewProps {
  data: JsonTypes[];
  setData: (prev: JsonTypes[]) => JsonTypes[];
}

export function View({ data, setData }: ViewProps) {
  const [type, setType] = useState<string | null>(null);
  const [query, setQuery] = useState<string>("");

  const handleSubmit = () => {
    const newItem = {
      id: Date.now(),
      isFolder: type === "folder" ? true : false,
      name: query,
      ...(type === "folder" && { children: [] }),
    };
    const updatedData = [...data, newItem];
    setData(updatedData);
    setType(null);
    setQuery("");
  };

  return (
    <div className="flex flex-col w-[400px]">
      <div className="flex my-3 ml-3">
        <button
          className="border border-gray-500 rounded-md p-2 cursor-pointer"
          onClick={() => setType("folder")}
        >
          + 🟨
        </button>
        <button
          className="border border-gray-500 rounded-md p-2 cursor-pointer ml-4"
          onClick={() => setType("file")}
        >
          + 📄
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
            <button
              onClick={() => handleSubmit()}
              className="flex ml-2 items-center rounded-md border border-gray-700 p-2 cursor-pointer"
            >
              Add
            </button>
          </div>
        )}
      </div>
      <div className="flex flex-col ">
        {data.map((leaf: JsonTypes, idx: number) => {
          if (!leaf.isFolder) {
            return <File key={leaf.id} label={leaf.name} />;
          } else {
            return (
              <Folder key={leaf.id} label={leaf.name}>
                <View
                  data={leaf.children}
                  setData={(updatedData) => {
                    const newData = [...data];
                    newData[idx] = {
                      ...newData[idx],
                      children: updatedData,
                    };
                    setData(newData);
                  }}
                />
              </Folder>
            );
          }
        })}
      </div>
    </div>
  );
}

interface FileProps {
  label: string;
}

function File({ label }: FileProps) {
  return (
    <div className="ml-4">
      📄
      <span className="ml-2">{label}</span>
    </div>
  );
}

interface FolderProps {
  label: string;
  children: ReactNode;
}

function Folder({ label, children }: FolderProps) {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div className="ml-4">
      🟨
      <span className="ml-2" onClick={() => setOpen((prev) => !prev)}>
        {label}
      </span>
      <div>{open && children}</div>
    </div>
  );
}
