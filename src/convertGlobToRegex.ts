const WILDCARD_RULE = /\*+/g;

export const convertGlobToRegex = (glob: string): RegExp => {
  return new RegExp(
    glob
      .replace(WILDCARD_RULE, '(.+?)'),
  );
};
