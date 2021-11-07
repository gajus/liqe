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

export type Ast = {
  field: string,
  fieldLocation?: Location,
  left?: Ast,
  operand?: Ast,
  operator?: '&&' | '||' | 'AND' | 'NOT' | 'OR',
  quoted?: boolean,
  range?: {
    max: number,
    maxInclusive: boolean,
    min: number,
    minInclusive: boolean,
  },
  regex?: boolean,
  relationalOperator?: '<' | '<=' | '=' | '>' | '>=',
  right: Ast,
  term: string,
  termLocation?: Location,
  test?: (subject: string) => boolean,
};
