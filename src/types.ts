export type Range = {
  max: number,
  maxInclusive: boolean,
  min: number,
  minInclusive: boolean,
};

export type RelationalOperator = '<' | '<=' | '=' | '>' | '>=';

export type Field = {
  location: number,
  name: string,
  path?: readonly string[],
  quoted: 'boolean',
  quotes?: 'double' | 'single',
};

export type RegexExpression = {
  location: number,
  type: 'RegexExpression',
  value: string,
};

export type RangeExpression = {
  location: number,
  range: Range,
  type: 'RangeExpression',
};

export type LiteralExpression = {
  location: number,
  quoted?: boolean,
  quotes?: 'double' | 'single',
  type: 'LiteralExpression',
  value: boolean | string | null,
};

export type Expression = LiteralExpression | RangeExpression | RegexExpression;

export type Operator = {
  type: 'AND' | 'OR',
};

export type Condition = {
  expression: Expression,
  field: Field,
  relationalOperator?: RelationalOperator,
  test?: InternalTest,
  type: 'Condition',
};

export type ConditionGroup = {
  left: ParserAst,
  operator: Operator,
  right: ParserAst,
  type: 'ConditionGroup',
};

export type Operand = {
  operand: ParserAst,
  operator: 'NOT',
  type: 'Operand',
};

export type ParserAst = Condition | ConditionGroup | Operand;

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
