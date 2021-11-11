import nearley from 'nearley';
import {
  SyntaxError,
} from './errors';
import grammar from './grammar';
import type {
  Ast,
} from './types';

const rules = nearley.Grammar.fromCompiled(grammar);

const MESSAGE_RULE = /Syntax error at line (?<line>\d+) col (?<column>\d+)/;

export const parse = (query: string): Ast => {
  const parser = new nearley.Parser(rules);

  let results;

  try {
    results = parser.feed(query).results;
  } catch (error: any) {
    if (typeof error?.message === 'string' && typeof error?.offset === 'number') {
      const match = error.message.match(MESSAGE_RULE);

      if (!match) {
        throw error;
      }

      throw new SyntaxError(
        `Syntax error at line ${match.groups.line} column ${match.groups.column}`,
        error.offset,
        Number(match.groups.line),
        Number(match.groups.column),
      );
    }

    throw error;
  }

  if (results.length === 0) {
    throw new Error('Found no parsings.');
  }

  if (results.length > 1) {
    throw new Error('Ambiguous results.');
  }

  return results[0];
};