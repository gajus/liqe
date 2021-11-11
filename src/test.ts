import {
  filter,
} from './filter';
import type {
  HydratedAst,
} from './types';

export const test = <T extends Object>(ast: HydratedAst, subject: T) => {
  return filter(ast, [subject]).length === 1;
};
