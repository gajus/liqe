import {
  filter,
} from './filter';
import type {
  Ast,
} from './types';

export const test = <T extends Object>(ast: Ast, subject: T) => {
  return filter(ast, [subject]).length === 1;
};
