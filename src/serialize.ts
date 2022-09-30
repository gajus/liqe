import type {
  ExpressionToken,
  HydratedAst,
} from './types';

const quote = (value: string, quotes: 'double' | 'single') => {
  if (quotes === 'double') {
    return `"${value}"`;
  }

  if (quotes === 'single') {
    return `'${value}'`;
  }

  return value;
};

const serializeExpression = (expression: ExpressionToken) => {
  if (expression.type === 'LiteralExpression') {
    if (expression.quotes && typeof expression.value === 'string') {
      return quote(expression.value, expression.quotes);
    }

    return String(expression.value);
  }

  if (expression.type === 'RegexExpression') {
    return String(expression.value);
  }

  if (expression.type === 'RangeExpression') {
    const {
      min,
      max,
      minInclusive,
      maxInclusive,
    } = expression.range;

    return `${minInclusive ? '[' : '{'}${min} TO ${max}${maxInclusive ? ']' : '}'}`;
  }

  throw new Error('Unexpected AST type.');
};

const serializeTagExpression = (ast: HydratedAst) => {
  if (ast.type !== 'TagExpression') {
    throw new Error('Expected a tag expression.');
  }

  const {
    field,
    expression,
    relationalOperator,
  } = ast;

  if (field.type === 'ImplicitField') {
    return serializeExpression(expression);
  }

  const left = field.quotes ? quote(field.name, field.quotes) : field.name;
  const operator = relationalOperator.operator;
  const right = serializeExpression(expression);

  const padRight = expression.location.start - (relationalOperator.location.start + relationalOperator.operator.length);

  return left + operator + ' '.repeat(padRight) + right;
};

export const serialize = (ast: HydratedAst): string => {
  if (ast.type === 'ParenthesizedExpression') {
    return `(${serialize(ast.expression)})`;
  }

  if (ast.type === 'TagExpression') {
    return serializeTagExpression(ast);
  }

  if (ast.type === 'LogicalExpression') {
    const left = serialize(ast.left);
    const operator = ast.operator.type === 'BooleanOperator' ? ` ${ast.operator.operator} ` : ' ';
    const right = serialize(ast.right);

    return `${left}${operator}${right}`;
  }

  if (ast.type === 'Operand') {
    return ast.operator + ' ' + serialize(ast.operand);
  }

  throw new Error('Unexpected AST type.');
};
