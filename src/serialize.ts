import type {
  Expression,
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

const serializeExpression = (expression: Expression) => {
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

const serializeCondition = (ast: HydratedAst) => {
  if (ast.type !== 'Condition') {
    throw new Error('Expected a condition.');
  }

  const {
    field,
    expression,
  } = ast;

  if (field.type === 'ImplicitField') {
    return serializeExpression(expression);
  }

  const left = field.quotes ? quote(field.name, field.quotes) : field.name;
  const operator = ast.relationalOperator ? ':' + ast.relationalOperator : ':';
  const right = serializeExpression(expression);

  return left + operator + right;
};

export const serialize = (ast: HydratedAst): string => {
  if (ast.type === 'ParenthesizedExpression') {
    return `(${serialize(ast.expression)})`;
  }

  if (ast.type === 'Condition') {
    return serializeCondition(ast);
  }

  if (ast.type === 'LogicalExpressionGroup') {
    const left = serialize(ast.left);
    const operator = ast.operator.type === 'Operator' ? ` ${ast.operator.operator} ` : ' ';
    const right = serialize(ast.right);

    return `${left}${operator}${right}`;
  }

  if (ast.type === 'Operand') {
    return ast.operator + ' ' + serialize(ast.operand);
  }

  throw new Error('Unexpected AST type.');
};
