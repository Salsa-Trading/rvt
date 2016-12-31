import Column from './Column';
export type SortDirections = 'ASCENDING'|'DESCENDING'|'NONE';

const SortDirection = {
  ASCENDING: 'ASCENDING' as SortDirections,
  DESCENDING: 'DESCENDING' as SortDirections,
  NONE: 'NONE' as SortDirections
};

export type SortDirectionCallback = (sortDirection: SortDirections, column: Column) => void;
export default SortDirection;

