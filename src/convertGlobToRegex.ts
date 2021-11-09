export const convertGlobToRegex = (glob: string): RegExp => {
  return new RegExp(
    glob
      .replace(/\*+/g, '*')
      .replace(/\*/g, '(.+?)'),
  );
};
