import {
  internalFilter,
} from './internalFilter';
import type {
  Ast,
} from './types';

export const filter = <T extends Object>(
  ast: Ast,
  data: readonly T[],
): readonly T[] => {
  return internalFilter(
    ast,
    data,
  );
};
