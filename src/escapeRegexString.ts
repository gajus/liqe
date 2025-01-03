const ESCAPE_RULE = /[$()*+.?[\\\]^{|}]/g;
const DASH_RULE = /-/g;

export const escapeRegexString = (subject: string): string => {
  return subject.replaceAll(ESCAPE_RULE, '\\$&').replaceAll(DASH_RULE, '\\x2d');
};
