import { useEffect, useRef } from "react";

export type JsonTypes = {
  id: number;
  name: string;
  children: JsonTypes[];
  isFolder?: boolean; // optional, kept for compatibility if present
  checked?: boolean;
};

interface ViewProps {
  data: JsonTypes[]; // the array this View renders
  setData: (d: JsonTypes[]) => void; // setter for this array
}

/** Set checked for entire subtree array (immutable) */
function setCheckedAll(nodes: JsonTypes[], checked: boolean): JsonTypes[] {
  return nodes.map((n) => ({
    ...n,
    checked,
    children: setCheckedAll(n.children || [], checked),
  }));
}

/** Toggle inside this subtree array only: find targetId and cascade to descendants. */
function toggleInArray(
  nodes: JsonTypes[],
  targetId: number,
  checked: boolean
): JsonTypes[] {
  return nodes.map((n) => {
    if (n.id === targetId) {
      return {
        ...n,
        checked,
        children: setCheckedAll(n.children || [], checked),
      };
    }
    return {
      ...n,
      children: toggleInArray(n.children || [], targetId, checked),
    };
  });
}

/** View: renders an array of nodes and patches children arrays immutably when nested Views call setData */
export function View({ data, setData }: ViewProps) {
  const onToggle = (id: number, checked: boolean) => {
    setData(toggleInArray(data, id, checked));
  };

  return (
    <div>
      {data.map((node, idx) => {
        // immediate-children aggregate for visual checked/indeterminate:
        const children = node.children || [];

        const all = children.length
          ? children.every((c) => !!c.checked)
          : !!node.checked;

        const some = children.length
          ? children.some((c) => !!c.checked)
          : !!node.checked;

        const indeterminate = children.length > 0 && some && !all;

        return (
          <div key={node.id} style={{ marginLeft: 12 }} className="py-1">
            <label className="inline-flex items-center gap-2 select-none">
              <Checkbox
                checked={all}
                indeterminate={indeterminate}
                onChange={(v) => onToggle(node.id, v)}
              />
              <span>{node.name}</span>
            </label>

            {/* nested subtree: pass setData that patches only this node's children */}
            {children.length > 0 && (
              <div className="ml-4">
                <View
                  data={children}
                  setData={(updatedChildren) => {
                    const newData = [...data];
                    newData[idx] = {
                      ...newData[idx],
                      children: updatedChildren,
                    };
                    setData(newData);
                  }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* Simple checkbox component that supports indeterminate via ref */
function Checkbox({
  checked,
  indeterminate,
  onChange,
}: {
  checked: boolean;
  indeterminate?: boolean;
  onChange: (v: boolean) => void;
}) {
  const ref = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    if (ref.current) ref.current.indeterminate = !!indeterminate;
  }, [indeterminate]);

  return (
    <input
      ref={ref}
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className="mr-2"
    />
  );
}
