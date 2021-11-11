export type Range = {
  max: number,
  maxInclusive: boolean,
  min: number,
  minInclusive: boolean,
};

export type RelationalOperator = '<' | '<=' | '=' | '>' | '>=';

export type Ast = {
  field: string,
  fieldPath: readonly string[],
  left?: Ast,
  operand?: Ast,
  operator?: 'AND' | 'NOT' | 'OR',
  query: string,
  quoted?: boolean,
  range?: Range,
  regex?: boolean,
  relationalOperator?: RelationalOperator,
  right: Ast,
  test?: InternalTest,
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
