import {
  internalFilter,
} from './internalFilter';
import type {
  Ast,
  Highlight,
} from './types';

export const highlight = <T extends Object>(
  ast: Ast,
  data: T,
): Highlight[] => {
  const highlights = [];

  internalFilter(
    ast,
    [data],
    false,
    [],
    highlights,
  );

  return highlights;
};
