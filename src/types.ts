export type BooleanOperatorToken = {
  location: TokenLocation;
  operator: 'AND' | 'OR';
  type: 'BooleanOperator';
};

export type ComparisonOperator = ':' | ':<' | ':<=' | ':=' | ':>' | ':>=';

export type ComparisonOperatorToken = {
  location: TokenLocation;
  operator: ComparisonOperator;
  type: 'ComparisonOperator';
};

export type EmptyExpression = {
  location: TokenLocation;
  type: 'EmptyExpression';
};

export type ExpressionToken =
  | EmptyExpression
  | LiteralExpressionToken
  | RangeExpressionToken
  | RegexExpressionToken;

export type FieldToken = {
  location: TokenLocation;
  name: string;
  path?: readonly string[];
  type: 'Field';
} & (
  | {
      quoted: false;
    }
  | {
      quoted: true;
      quotes: 'double' | 'single';
    }
);

export type Highlight = {
  path: string;
  query?: RegExp;
};

// Implicit boolean operators do not have a location, e.g., "foo bar".
// In this example, the implicit AND operator is the space between "foo" and "bar".
export type ImplicitBooleanOperatorToken = {
  operator: 'AND';
  type: 'ImplicitBooleanOperator';
};

export type ImplicitFieldToken = {
  type: 'ImplicitField';
};

export type InternalHighlight = {
  keyword?: string;
  path: string;
};

export type InternalTest = (value: unknown) => boolean | string;

export type LiqeQuery = ParserAst & {
  getValue?: (subject: unknown) => unknown;
  left?: LiqeQuery;
  operand?: LiqeQuery;
  right?: LiqeQuery;
};

export type LiteralExpressionToken = {
  location: TokenLocation;
  type: 'LiteralExpression';
} & (
  | {
      quoted: false;
      value: boolean | null | string;
    }
  | {
      quoted: true;
      quotes: 'double' | 'single';
      value: string;
    }
);

export type LogicalExpressionToken = {
  left: ParserAst;
  location: TokenLocation;
  operator: BooleanOperatorToken | ImplicitBooleanOperatorToken;
  right: ParserAst;
  type: 'LogicalExpression';
};

export type ParenthesizedExpressionToken = {
  expression: ParserAst;
  location: TokenLocation;
  type: 'ParenthesizedExpression';
};

export type ParserAst =
  | EmptyExpression
  | LogicalExpressionToken
  | ParenthesizedExpressionToken
  | TagToken
  | UnaryOperatorToken;

export type Range = {
  max: number;
  maxInclusive: boolean;
  min: number;
  minInclusive: boolean;
};

export type RangeExpressionToken = {
  location: TokenLocation;
  range: Range;
  type: 'RangeExpression';
};

export type RegexExpressionToken = {
  location: TokenLocation;
  type: 'RegexExpression';
  value: string;
};

export type TagToken = {
  expression: ExpressionToken;
  field: FieldToken | ImplicitFieldToken;
  location: TokenLocation;
  operator: ComparisonOperatorToken;
  test?: InternalTest;
  type: 'Tag';
};

export type TokenLocation = {
  end: number;
  start: number;
};

export type UnaryOperatorToken = {
  location: TokenLocation;
  operand: ParserAst;
  operator: '-' | 'NOT';
  type: 'UnaryOperator';
};
