export type ItemType = 'root' | 'folder' | 'file';

export interface Tree {
  id: number;
  type: ItemType;
  collapsed?: boolean;
  label?: string;
  children?: Tree[];
  new?: boolean;
}
