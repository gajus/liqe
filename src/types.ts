type Location = {
  end: {
    column: number,
    line: number,
    offset: number,
  },
  start: {
    column: number,
    line: number,
    offset: number,
  },
};

export type Range = {
  max: number,
  maxInclusive: boolean,
  min: number,
  minInclusive: boolean,
};

export type RelationalOperator = '<' | '<=' | '=' | '>' | '>=';

export type Ast = {
  field: string,
  fieldLocation?: Location,
  left?: Ast,
  operand?: Ast,
  operator?: '&&' | '||' | 'AND' | 'NOT' | 'OR',
  quoted?: boolean,
  range?: Range,
  regex?: boolean,
  relationalOperator?: RelationalOperator,
  right: Ast,
  term: string,
  termLocation?: Location,
  test?: (subject: string) => boolean,
};
