import {
  type ExpressionToken,
  type LiqeQuery,
  type ParenthesizedExpressionToken,
} from './types';

const quote = (value: string, quotes: 'double' | 'single') => {
  // The parser reads \\ as a backslash, \n as a line feed and \" or \' as the quote (a raw line feed ends the string)
  const escaped = value.replaceAll('\\', '\\\\').replaceAll('\n', '\\n');

  if (quotes === 'double') {
    return `"${escaped.replaceAll('"', '\\"')}"`;
  }

  if (quotes === 'single') {
    return `'${escaped.replaceAll("'", "\\'")}'`;
  }

  return value;
};

const serializeParenthesizedExpression = (
  ast: ParenthesizedExpressionToken,
  serializeAst: (node: LiqeQuery) => string,
): string => {
  if (!('location' in ast.expression)) {
    throw new Error('Expected location in expression.');
  }

  if (!ast.location.end) {
    throw new Error('Expected location end.');
  }

  const patStart = ' '.repeat(
    ast.expression.location.start - (ast.location.start + 1),
  );
  const patEnd = ' '.repeat(ast.location.end - ast.expression.location.end - 1);

  return `(${patStart}${serializeAst(ast.expression)}${patEnd})`;
};

const serializeExpression = (
  expression: ExpressionToken,
  serializeAst: (node: LiqeQuery) => string,
) => {
  if (expression.type === 'LiteralExpression') {
    if (expression.quoted && typeof expression.value === 'string') {
      return quote(expression.value, expression.quotes);
    }

    return String(expression.value);
  }

  if (expression.type === 'RegexExpression') {
    return String(expression.value);
  }

  if (expression.type === 'RangeExpression') {
    const { max, maxInclusive, min, minInclusive } = expression.range;

    return `${minInclusive ? '[' : '{'}${min} TO ${max}${maxInclusive ? ']' : '}'}`;
  }

  if (expression.type === 'EmptyExpression') {
    return '';
  }

  if (expression.type === 'ParenthesizedExpression') {
    return serializeParenthesizedExpression(expression, serializeAst);
  }

  throw new Error('Unexpected AST type.');
};

const serializeTag = (
  ast: LiqeQuery,
  serializeAst: (node: LiqeQuery) => string,
) => {
  if (ast.type !== 'Tag') {
    throw new Error('Expected a tag expression.');
  }

  const { expression, field, operator } = ast;

  if (field.type === 'ImplicitField') {
    return serializeExpression(expression, serializeAst);
  }

  const left = field.quoted ? quote(field.name, field.quotes) : field.name;

  const patEnd = ' '.repeat(expression.location.start - operator.location.end);

  return (
    left +
    operator.operator +
    patEnd +
    serializeExpression(expression, serializeAst)
  );
};

export const serialize = (ast: LiqeQuery): string => {
  if (ast.type === 'ParenthesizedExpression') {
    return serializeParenthesizedExpression(ast, serialize);
  }

  if (ast.type === 'Tag') {
    return serializeTag(ast, serialize);
  }

  if (ast.type === 'LogicalExpression') {
    let operator = '';

    if (ast.operator.type === 'BooleanOperator') {
      operator += ' '.repeat(
        ast.operator.location.start - ast.left.location.end,
      );
      operator += ast.operator.operator;
      operator += ' '.repeat(
        ast.right.location.start - ast.operator.location.end,
      );
    } else {
      operator = ' '.repeat(ast.right.location.start - ast.left.location.end);
    }

    return `${serialize(ast.left)}${operator}${serialize(ast.right)}`;
  }

  if (ast.type === 'UnaryOperator') {
    return (
      (ast.operator === 'NOT' ? 'NOT ' : ast.operator) + serialize(ast.operand)
    );
  }

  if (ast.type === 'EmptyExpression') {
    return '';
  }

  throw new Error('Unexpected AST type.');
};
