export type Range = {
  max: number,
  maxInclusive: boolean,
  min: number,
  minInclusive: boolean,
};

export type RelationalOperator = '<' | '<=' | '=' | '>' | '>=';

export type FieldToken = {
  location: number,
  name: string,
  path?: readonly string[],
  quoted: 'boolean',
  quotes?: 'double' | 'single',
};

export type RegexExpressionToken = {
  location: number,
  type: 'RegexExpression',
  value: string,
};

export type RangeExpressionToken = {
  location: number,
  range: Range,
  type: 'RangeExpression',
};

export type LiteralExpressionToken = {
  location: number,
  quoted?: boolean,
  quotes?: 'double' | 'single',
  type: 'LiteralExpression',
  value: boolean | string | null,
};

export type Expression = LiteralExpressionToken | RangeExpressionToken | RegexExpressionToken;

export type OperatorToken = {
  type: 'AND' | 'OR',
};

export type ConditionToken = {
  expression: Expression,
  field: FieldToken,
  relationalOperator?: RelationalOperator,
  test?: InternalTest,
  type: 'Condition',
};

export type ConditionGroupToken = {
  left: ParserAst,
  operator: OperatorToken,
  right: ParserAst,
  type: 'ConditionGroup',
};

export type OperandToken = {
  operand: ParserAst,
  operator: 'NOT',
  type: 'Operand',
};

export type ParenthesizedExpressionToken = {
  expression: ParserAst,
  type: 'ParenthesizedExpression',
};

export type ParserAst = ConditionGroupToken | ConditionToken | OperandToken | ParenthesizedExpressionToken;

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
