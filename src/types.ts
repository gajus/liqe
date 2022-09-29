export type Range = {
  max: number,
  maxInclusive: boolean,
  min: number,
  minInclusive: boolean,
};

export type RelationalOperator = '<' | '<=' | '=' | '>' | '>=';

export type ImplicitFieldToken = {
  type: 'ImplicitField',
};

export type FieldToken = {
  location: number,
  name: string,
  path?: readonly string[],
  quoted: boolean,
  quotes?: 'double' | 'single',
  type: 'Field',
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

export type ExpressionToken = LiteralExpressionToken | RangeExpressionToken | RegexExpressionToken;

export type OperatorToken = {
  location: number,
  operator: 'AND' | 'OR',
  type: 'Operator',
};

// Implicit operators do not have a location.
export type ImplicitOperatorToken = {
  operator: 'AND',
  type: 'ImplicitOperator',
};

export type LogicalExpressionToken = {
  expression: ExpressionToken,
  field: FieldToken | ImplicitFieldToken,
  relationalOperator?: RelationalOperator,
  test?: InternalTest,
  type: 'LogicalExpression',
};

export type LogicalExpressionGroupToken = {
  left: ParserAst,
  operator: ImplicitOperatorToken | OperatorToken,
  right: ParserAst,
  type: 'LogicalExpressionGroup',
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

export type ParserAst = LogicalExpressionGroupToken | LogicalExpressionToken | OperandToken | ParenthesizedExpressionToken;

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
