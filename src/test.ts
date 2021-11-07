import type {
  Ast,
} from '../types';
import {
  filter,
} from './filter';

export const test = <T extends Object>(ast: Ast, subject: T) => {
  return filter(ast, [subject]).length === 1;
};
