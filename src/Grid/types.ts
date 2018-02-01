import { Field } from '../List/Field';

export type VirtualGridMouseEventHandler = (e: React.MouseEvent<any>, data: any, fieldName: string) => void;

export type GridRowProps<TData> = {
  data: TData;
  rowProps?: React.HTMLProps<HTMLTableRowElement>;
};

export type GridRowComponentProps<TData> = {
  fields: Field[];
  data?: TData;
  rowProps?: React.HTMLProps<HTMLTableRowElement>;
  onMouseDown?: VirtualGridMouseEventHandler;
  onClick?: VirtualGridMouseEventHandler;
  onDoubleClick?: VirtualGridMouseEventHandler;
};

export type BaseGridProps<TData extends object> = {
  onMouseDown?: VirtualGridMouseEventHandler;
  onClick?: VirtualGridMouseEventHandler;
  onDoubleClick?: VirtualGridMouseEventHandler;
  pinnedRows?: GridRowProps<TData>[]
};
