import { Field } from '../List/Field';

export type VirtualGridMouseEventHandler = (e: React.MouseEvent<any>, data: any, fieldName: string) => void;

export type GridRowProps<TData> = {
  data: TData;
  rowProps?: React.HTMLProps<HTMLTableRowElement>;
  key?: string;
};

export type GridRowHeaderProps<TData> = {
  data: TData;
};

export type GridRowComponentProps<TData> = {
  fields: Field[];
  data?: TData;
  rowProps?: React.HTMLProps<HTMLTableRowElement>;
  onMouseDown?: VirtualGridMouseEventHandler;
  onClick?: VirtualGridMouseEventHandler;
  onDoubleClick?: VirtualGridMouseEventHandler;
  rowHeaderComponent?: any; // React.ComponentType<GridRowHeaderProps<TData>>;
};

export type BaseGridProps<TData extends object> = {
  onMouseDown?: VirtualGridMouseEventHandler;
  onClick?: VirtualGridMouseEventHandler;
  onDoubleClick?: VirtualGridMouseEventHandler;
  pinnedRows?: GridRowProps<TData>[];
  rowComponent?: React.ComponentType<GridRowComponentProps<TData>>;
  rowHeaderComponent?: any; // React.ComponentType<GridRowHeaderProps<TData>>;
};
