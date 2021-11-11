export const isOptionalChainingSupported = () => {
  try {
    // eslint-disable-next-line no-eval
    eval('const foo = {}; foo?.bar');
  } catch {
    return false;
  }

  return true;
};
