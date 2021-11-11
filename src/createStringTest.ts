import {
  convertWildcardToRegex,
} from './convertWildcardToRegex';
import {
  escapeRegexString,
} from './escapeRegexString';
import {
  parseRegex,
} from './parseRegex';
import type {
  HydratedAst,
} from './types';

type RegExpCache = Record<string, RegExp>;

const createRegexTest = (regexCache: RegExpCache, regex: string) => {
  let rule: RegExp;

  if (regexCache[regex]) {
    rule = regexCache[regex];
  } else {
    rule = regexCache[regex] = parseRegex(regex);
  }

  return (subject: string): string | false => {
    return subject.match(rule)?.[0] ?? false;
  };
};

export const createStringTest = (regexCache: RegExpCache, ast: HydratedAst) => {
  const query = ast.query;

  if (!query) {
    throw new Error('Unexpected state.');
  }

  if (ast.regex) {
    return createRegexTest(regexCache, query);
  } else if (query.includes('*') && ast.quoted === false) {
    return createRegexTest(regexCache, String(convertWildcardToRegex(query)) + (ast.quoted ? 'u' : 'ui'));
  } else {
    return createRegexTest(regexCache, '/(' + escapeRegexString(query) + ')/' + (ast.quoted ? 'u' : 'ui'));
  }
};
