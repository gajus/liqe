export type Range = {
  max: number,
  maxInclusive: boolean,
  min: number,
  minInclusive: boolean,
};

export type RelationalOperator = '<' | '<=' | '=' | '>' | '>=';

export type Ast = {
  field: string,
  left?: Ast,
  operand?: Ast,
  operator?: '&&' | '||' | 'AND' | 'NOT' | 'OR',
  query: string,
  quoted?: boolean,
  range?: Range,
  regex?: boolean,
  relationalOperator?: RelationalOperator,
  right: Ast,
  test?: (subject: string) => boolean,
};
