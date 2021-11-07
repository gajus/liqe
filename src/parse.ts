import nearley from 'nearley';
import grammar from './grammar';
import type {
  Ast,
} from './types';

export const parse = (query: string): Ast => {
  const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));

  const results = parser.feed(query).results;

  if (results.length === 0) {
    throw new Error('Found no parsings.');
  }

  if (results.length > 1) {
    throw new Error('Ambiguous results.');
  }

  return results[0];
};
