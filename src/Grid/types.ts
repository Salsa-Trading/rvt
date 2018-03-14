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
  rowHeaderComponent?: React.ComponentType<GridRowHeaderProps<TData>>
};

export type GridSecondaryHeaderProps = {
  fields: Field[];
};

export type BaseGridProps<TData extends object> = {
  onMouseDown?: VirtualGridMouseEventHandler;
  onClick?: VirtualGridMouseEventHandler;
  onDoubleClick?: VirtualGridMouseEventHandler;
  secondaryHeaderComponent?: React.ComponentType<GridSecondaryHeaderProps>;
  pinnedRows?: GridRowProps<TData>[];
  rowComponent?: React.ComponentType<GridRowComponentProps<TData>>;
  rowHeaderComponent?: React.ComponentType<GridRowHeaderProps<TData>>;
};
