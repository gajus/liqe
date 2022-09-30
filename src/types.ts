export type Range = {
  max: number,
  maxInclusive: boolean,
  min: number,
  minInclusive: boolean,
};

export type ComparisonOperator = ':' | ':<' | ':<=' | ':=' | ':>' | ':>=';

export type ComparisonOperatorToken = {
  location: TokenLocation,
  operator: ComparisonOperator,
  type: 'ComparisonOperator',
};

export type ImplicitFieldToken = {
  type: 'ImplicitField',
};

export type FieldToken = {
  location: TokenLocation,
  name: string,
  path?: readonly string[],
  quoted: boolean,
  quotes?: 'double' | 'single',
  type: 'Field',
};

export type RegexExpressionToken = {
  location: TokenLocation,
  type: 'RegexExpression',
  value: string,
};

export type RangeExpressionToken = {
  location: TokenLocation,
  range: Range,
  type: 'RangeExpression',
};

export type LiteralExpressionToken = {
  location: TokenLocation,
  quoted?: boolean,
  quotes?: 'double' | 'single',
  type: 'LiteralExpression',
  value: boolean | string | null,
};

export type ExpressionToken = LiteralExpressionToken | RangeExpressionToken | RegexExpressionToken;

export type BooleanOperatorToken = {
  location: TokenLocation,
  operator: 'AND' | 'OR',
  type: 'BooleanOperator',
};

// Implicit boolean operators do not have a location, e.g., "foo bar".
// In this example, the implicit AND operator is the space between "foo" and "bar".
export type ImplicitBooleanOperatorToken = {
  operator: 'AND',
  type: 'ImplicitBooleanOperator',
};

export type TokenLocation = {
  end?: number,
  start: number,
};

export type TagExpressionToken = {
  expression: ExpressionToken,
  field: FieldToken | ImplicitFieldToken,
  location: TokenLocation,
  operator: ComparisonOperatorToken,
  test?: InternalTest,
  type: 'TagExpression',
};

export type LogicalExpressionToken = {
  left: ParserAst,
  location: TokenLocation,
  operator: BooleanOperatorToken | ImplicitBooleanOperatorToken,
  right: ParserAst,
  type: 'LogicalExpression',
};

export type OperandToken = {
  operand: ParserAst,
  operator: 'NOT',
  type: 'Operand',
};

export type ParenthesizedExpressionToken = {
  expression: ParserAst,
  location: TokenLocation,
  type: 'ParenthesizedExpression',
};

export type ParserAst = LogicalExpressionToken | OperandToken | ParenthesizedExpressionToken | TagExpressionToken;

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
