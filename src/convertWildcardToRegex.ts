import { escapeRegexString } from './escapeRegexString';

// The capturing group makes `split` keep the wildcards between the text.
const WILDCARD_RULE = /(\*+|\?)/;

export const convertWildcardToRegex = (pattern: string): RegExp => {
  return new RegExp(
    pattern
      .split(WILDCARD_RULE)
      .map((part, index) => {
        // Even indexes are the text between wildcards, matched as it is.
        if (index % 2 === 0) {
          return escapeRegexString(part);
        }

        return part === '?' ? '(.)' : '(.+?)';
      })
      .join(''),
  );
};
