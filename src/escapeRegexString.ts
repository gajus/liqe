export const escapeRegexString = (subject: string): string => {
  return subject
    .replace(/[$()*+.?[\\\]^{|}]/g, '\\$&')
    .replace(/-/g, '\\x2d');
};
