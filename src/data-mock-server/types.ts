export type CommentType = {
  postId: number;
  id: number;
  name: string;
  email: string;
  body: string;
};

export interface PaginationPropsTypes {
  totalPages: [];
  currentPage: number;
  setCurrentPage: (idx: number) => void;
}

export interface TableViewPropsTypes {
  comments: CommentType[];
  query: string;
  onSort: (key: string) => void;
  sortConfig: SortConfig;
}

export const LIMIT = 10;

export const COLUMNS: COLUMN_TYPE[] = [
  { key: "id", value: "ID" },
  { key: "postId", value: "PostId" },
  { key: "name", value: "Name" },
  { key: "email", value: "Email" },
  { key: "body", value: "Body" },
];

export type COLUMN_TYPE = {
  key: string;
  value: string;
};

export type SortDir = "asc" | "desc" | null;

export type SortConfig = {
  key: string | null;
  dir: SortDir;
};
