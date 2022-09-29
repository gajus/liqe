export type Range = {
  max: number,
  maxInclusive: boolean,
  min: number,
  minInclusive: boolean,
};

export type RelationalOperator = '<' | '<=' | '=' | '>' | '>=';

type Field = {
  name: string,
  path?: readonly string[],
  quoted: 'boolean',
  quotes?: 'double' | 'single',
};

type RegexExpression = {
  type: 'RegexExpression',
  value: string,
};

type RangeExpression = {
  range: Range,
  type: 'RangeExpression',
};

type LiteralExpression = {
  quoted?: boolean,
  quotes?: 'double' | 'single',
  type: 'LiteralExpression',
  value: string,
};

type Expression = LiteralExpression | RangeExpression | RegexExpression;

type Condition = {
  expression: Expression,
  field: Field,
  relationalOperator?: RelationalOperator,
  test?: InternalTest,
  type: 'Condition',
};

type ConditionGroup = {
  left: ParserAst,
  operator: 'AND' | 'NOT' | 'OR',
  right: ParserAst,
  type: 'ConditionGroup',
};

export type ParserAst = Condition | ConditionGroup;

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
