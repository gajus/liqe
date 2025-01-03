const WILDCARD_RULE = /(\*+)|(\?)/g;

export const convertWildcardToRegex = (pattern: string): RegExp => {
  return new RegExp(
    pattern.replaceAll(WILDCARD_RULE, (_match, p1) => {
      return p1 ? '(.+?)' : '(.)';
    }),
  );
};
