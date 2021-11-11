export const isOptionalChainingSupported = () => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const foo = {};

    // eslint-disable-next-line no-eval
    eval('foo?.bar');
  } catch {
    return false;
  }

  return true;
};
