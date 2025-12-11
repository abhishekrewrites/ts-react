import { useState, type ReactNode } from "react";

// --- Types ---
export type JsonTypes = {
  id: number;
  name: string;
  children: JsonTypes[];
  isFolder: boolean;
};

// --- Interfaces ---
interface ViewProps {
  data: JsonTypes[];
  setData: (data: JsonTypes[]) => void;
}

interface FileProps {
  label: string;
  onDelete: () => void;
  onRename: (newName: string) => void;
}

interface FolderProps {
  label: string;
  children: ReactNode;
  onDelete: () => void;
  onRename: (newName: string) => void;
}

// --- Main View Component ---
export function View({ data, setData }: ViewProps) {
  const [type, setType] = useState<string | null>(null);
  const [query, setQuery] = useState<string>("");

  // 1. Logic to Add Items
  const handleSubmit = () => {
    if (!query) return;

    const newItem: JsonTypes = {
      id: Date.now(),
      isFolder: type === "folder",
      name: query,
      children: [],
    };

    setData([...data, newItem]);
    setType(null);
    setQuery("");
  };

  // 2. Logic to Delete Items
  const handleDelete = (index: number) => {
    const updatedData = data.filter((_, i) => i !== index);
    setData(updatedData);
  };

  // 3. Logic to Rename Items
  const handleRename = (index: number, newName: string) => {
    const updatedData = [...data];
    updatedData[index] = { ...updatedData[index], name: newName };
    setData(updatedData);
  };

  return (
    <div className="flex flex-col w-[400px]">
      {/* Input Controls */}
      <div className="flex my-3 ml-3 items-center gap-2">
        <button
          className="border border-gray-500 hover:bg-gray-100 rounded-md p-2 cursor-pointer"
          onClick={() => setType("folder")}
          title="New Folder"
        >
          + 🟨
        </button>
        <button
          className="border border-gray-500 hover:bg-gray-100 rounded-md p-2 cursor-pointer"
          onClick={() => setType("file")}
          title="New File"
        >
          + 📄
        </button>

        {type && (
          <div className="flex gap-2 items-center">
            <input
              type="text"
              autoFocus
              className="border border-gray-500 rounded-md px-2 py-1 w-24"
              placeholder="Name..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
            <button
              onClick={handleSubmit}
              className="rounded-md bg-blue-500 text-white px-3 py-1 text-sm hover:bg-blue-600"
            >
              Add
            </button>
            <button
              onClick={() => {
                setType(null);
                setQuery("");
              }}
              className="text-gray-500 hover:text-red-500"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-col">
        {data.map((leaf: JsonTypes, idx: number) => {
          if (!leaf.isFolder) {
            return (
              <File
                key={leaf.id}
                label={leaf.name}
                onDelete={() => handleDelete(idx)}
                onRename={(newName) => handleRename(idx, newName)}
              />
            );
          } else {
            return (
              <Folder
                key={leaf.id}
                label={leaf.name}
                onDelete={() => handleDelete(idx)}
                onRename={(newName) => handleRename(idx, newName)}
              >
                <View
                  data={leaf.children}
                  setData={(updatedChildren) => {
                    const newData = [...data];
                    newData[idx] = {
                      ...newData[idx],
                      children: updatedChildren,
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

// --- Helper Components ---

function File({ label, onDelete, onRename }: FileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(label);

  const saveRename = () => {
    onRename(tempName);
    setIsEditing(false);
  };

  return (
    <div className="ml-4 flex items-center group py-1">
      <span className="mr-2">📄</span>

      {isEditing ? (
        <div className="flex items-center gap-1">
          <input
            className="border rounded px-1 text-sm w-32"
            value={tempName}
            onChange={(e) => setTempName(e.target.value)}
            autoFocus
          />
          <button onClick={saveRename} className="text-green-600 text-xs">
            ✅
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className="text-red-600 text-xs"
          >
            ❌
          </button>
        </div>
      ) : (
        <>
          <span className="mr-auto">{label}</span>
          {/* Action Buttons (visible on hover) */}
          <div className="hidden group-hover:flex gap-2 ml-4">
            <button onClick={() => setIsEditing(true)} title="Rename">
              ✏️
            </button>
            <button onClick={onDelete} title="Delete">
              🗑️
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function Folder({ label, children, onDelete, onRename }: FolderProps) {
  const [open, setOpen] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(label);

  const saveRename = () => {
    onRename(tempName);
    setIsEditing(false);
  };

  return (
    <div className="ml-4 py-1">
      <div className="flex items-center group">
        <span
          className="mr-2 cursor-pointer select-none"
          onClick={() => setOpen(!open)}
        >
          {open ? "📂" : "📁"}
        </span>

        {isEditing ? (
          <div className="flex items-center gap-1">
            <input
              className="border rounded px-1 text-sm w-32"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              autoFocus
            />
            <button onClick={saveRename} className="text-green-600 text-xs">
              ✅
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="text-red-600 text-xs"
            >
              ❌
            </button>
          </div>
        ) : (
          <>
            <span
              className="mr-auto cursor-pointer font-medium select-none"
              onClick={() => setOpen((prev) => !prev)}
            >
              {label}
            </span>
            <div className="hidden group-hover:flex gap-2 ml-4">
              <button onClick={() => setIsEditing(true)} title="Rename">
                ✏️
              </button>
              <button onClick={onDelete} title="Delete">
                🗑️
              </button>
            </div>
          </>
        )}
      </div>

      {open && (
        <div className="pl-2 border-l border-gray-300 ml-1">{children}</div>
      )}
    </div>
  );
}
