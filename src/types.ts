export type Range = {
  max: number,
  maxInclusive: boolean,
  min: number,
  minInclusive: boolean,
};

export type RelationalOperator = ':' | ':<' | ':<=' | ':=' | ':>' | ':>=';

export type RelationalOperatorToken = {
  location: TokenLocation,
  operator: RelationalOperator,
  type: 'RelationalOperator',
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

export type OperatorToken = {
  location: TokenLocation,
  operator: 'AND' | 'OR',
  type: 'Operator',
};

// Implicit operators do not have a location.
export type ImplicitOperatorToken = {
  operator: 'AND',
  type: 'ImplicitOperator',
};

export type TokenLocation = {
  end?: number,
  start: number,
};

export type TagExpressionToken = {
  expression: ExpressionToken,
  field: FieldToken | ImplicitFieldToken,
  location: TokenLocation,
  relationalOperator: RelationalOperatorToken,
  test?: InternalTest,
  type: 'TagExpression',
};

export type LogicalExpressionToken = {
  left: ParserAst,
  operator: ImplicitOperatorToken | OperatorToken,
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
