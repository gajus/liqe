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
  quoted?: boolean,
  range?: Range,
  regex?: boolean,
  relationalOperator?: RelationalOperator,
  right: Ast,
  term: string,
  test?: (subject: string) => boolean,
};
