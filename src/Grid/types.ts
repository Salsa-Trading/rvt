import { Field } from '../List/Field';

export type VirtualGridMouseEventHandler = (e: React.MouseEvent<any>, data: any, fieldName: string) => void;

export interface GridRowProps<TData> extends DynamicRowComponentProps<TData> {
  key?: string;
}

export type GridRowHeaderProps<TData> = {
  data: TData;
};

export interface GridRowComponentProps<TData> extends DynamicRowComponentProps<TData>, InjectedRowComponentProps<TData> {}

export interface DynamicRowComponentProps<TData> {
  data: TData;
  rowProps?: React.HTMLProps<HTMLTableRowElement>;
}

export interface InjectedRowComponentProps<TData> {
  fields: Field[];
  onMouseDown?: VirtualGridMouseEventHandler;
  onClick?: VirtualGridMouseEventHandler;
  onDoubleClick?: VirtualGridMouseEventHandler;
  rowHeaderComponent?: React.ComponentType<GridRowHeaderProps<TData>>
  fixedColumnWidth?: boolean;
}

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
  hideHeader?: boolean;
  hideFilters?: boolean;
  chooserMountPoint?: HTMLElement;
  hideDefaultChooser?: boolean;
  fixedColumnWidth?: boolean;
  tableStyle?: React.CSSProperties;
  tbodyStyle?: React.CSSProperties;
};


