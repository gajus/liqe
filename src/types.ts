export type Range = {
  max: number,
  maxInclusive: boolean,
  min: number,
  minInclusive: boolean,
};

export type RelationalOperator = '<' | '<=' | '=' | '>' | '>=';

export type ParserAst = {
  field: {
    name: string,
    path?: readonly string[],
  },
  left?: ParserAst,
  operand?: ParserAst,
  operator?: 'AND' | 'NOT' | 'OR',
  query?: string,
  quoted?: boolean,
  range?: Range,
  regex?: boolean,
  relationalOperator?: RelationalOperator,
  right?: ParserAst,
  test?: InternalTest,
};

export type HydratedAst = ParserAst & {
  getValue?: (subject: unknown) => unknown,
  left?: HydratedAst,
  operand?: HydratedAst,
  right?: HydratedAst,
};

export type InternalHighlight = {
  keyword?: string,
  path: string,
};

export type Highlight = {
  path: string,
  query?: RegExp,
};

export type InternalTest = (value: unknown) => boolean | string;
