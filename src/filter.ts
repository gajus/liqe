import {
  internalFilter,
} from './internalFilter';
import type {
  HydratedAst,
} from './types';

export const filter = <T extends Object>(
  ast: HydratedAst,
  data: readonly T[],
): readonly T[] => {
  return internalFilter(
    ast,
    data,
  );
};
