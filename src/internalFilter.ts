import {
  createStringTest,
} from './createStringTest';
import {
  isOptionalChainingSupported,
} from './isOptionalChainingSupported';
import {
  testRange,
} from './testRange';
import {
  testRelationalRange,
} from './testRelationalRange';
import type {
  HydratedAst,
  InternalHighlight,
  InternalTest,
} from './types';

const optionalChainingIsSupported = isOptionalChainingSupported();

const createValueTest = (ast: HydratedAst): InternalTest => {
  if (ast.type !== 'Condition') {
    throw new Error('Expected a condition.');
  }

  const {
    expression,
  } = ast;

  if (expression.type === 'RangeExpression') {
    return (value) => {
      return testRange(value, expression.range);
    };
  }

  const expressionValue = expression.value;

  if (ast.relationalOperator) {
    const relationalOperator = ast.relationalOperator;

    if (typeof expressionValue !== 'number') {
      throw new TypeError('Expected a number.');
    }

    return (value) => {
      if (typeof value !== 'number') {
        return false;
      }

      return testRelationalRange(expressionValue, value, relationalOperator);
    };
  } else if (typeof expressionValue === 'boolean') {
    return (value) => {
      return value === expressionValue;
    };
  } else if (expressionValue === null) {
    return (value) => {
      return value === null;
    };
  } else {
    const testString = createStringTest({}, ast);

    return (value) => {
      return testString(String(value));
    };
  }
};

const testValue = (
  ast: HydratedAst,
  value: unknown,
  resultFast: boolean,
  path: readonly string[],
  highlights: InternalHighlight[],
) => {
  if (Array.isArray(value)) {
    let foundMatch = false;
    let index = 0;

    for (const item of value) {
      if (testValue(ast, item, resultFast, [...path, String(index++)], highlights)) {
        if (resultFast) {
          return true;
        }

        foundMatch = true;
      }
    }

    return foundMatch;
  } else if (typeof value === 'object' && value !== null) {
    let foundMatch = false;

    for (const key in value) {
      if (testValue(ast, value[key], resultFast, [...path, key], highlights)) {
        if (resultFast) {
          return true;
        }

        foundMatch = true;
      }
    }

    return foundMatch;
  }

  if (ast.type !== 'Condition') {
    throw new Error('Expected a condition.');
  }

  if (!ast.test) {
    throw new Error('Expected test to be defined.');
  }

  const result = ast.test(
    value,
  );

  if (result) {
    highlights.push({
      ...typeof result === 'string' && {keyword: result},
      path: path.join('.'),
    });

    return true;
  }

  return Boolean(
    result,
  );
};

const testField = <T extends Object>(
  row: T,
  ast: HydratedAst,
  resultFast: boolean,
  path: readonly string[],
  highlights: InternalHighlight[],
): boolean => {
  if (ast.type !== 'Condition') {
    throw new Error('Expected a condition.');
  }

  if (!ast.test) {
    ast.test = createValueTest(ast);
  }

  if (ast.field.name in row) {
    return testValue(
      ast,
      row[ast.field.name],
      resultFast,
      path,
      highlights,
    );
  } else if (optionalChainingIsSupported && ast.getValue && ast.field.path) {
    return testValue(
      ast,
      ast.getValue(row),
      resultFast,
      ast.field.path,
      highlights,
    );
  } else if (ast.field.path) {
    let value = row;

    for (const key of ast.field.path) {
      if (typeof value !== 'object' || value === null) {
        return false;
      } else if (key in value) {
        value = value[key];
      } else {
        return false;
      }
    }

    return testValue(
      ast,
      value,
      resultFast,
      ast.field.path,
      highlights,
    );
  } else if (ast.field.name === '<implicit>') {
    let foundMatch = false;

    for (const fieldName in row) {
      if (testValue(
        {
          ...ast,
          field: {
            ...ast.field,
            name: fieldName,
          },
        },
        row[fieldName],
        resultFast,
        [
          ...path,
          fieldName,
        ],
        highlights,
      )) {
        if (resultFast) {
          return true;
        }

        foundMatch = true;
      }
    }

    return foundMatch;
  } else {
    return false;
  }
};

export const internalFilter = <T extends Object>(
  ast: HydratedAst,
  rows: readonly T[],
  resultFast: boolean = true,
  path: readonly string[] = [],
  highlights: InternalHighlight[] = [],
): readonly T[] => {
  if (ast.type === 'Condition') {
    return rows.filter((row) => {
      return testField(
        row,
        ast,
        resultFast,
        ast.field.name === '<implicit>' ? path : [...path, ast.field.name],
        highlights,
      );
    });
  }

  if (ast.type === 'Operand' && ast.operator === 'NOT' && ast.operand) {
    const removeRows = internalFilter(
      ast.operand,
      rows,
      resultFast,
      path,
      [],
    );

    return rows.filter((row) => {
      return !removeRows.includes(row);
    });
  }

  if (!ast.left) {
    throw new Error('Expected left to be defined.');
  }

  const leftRows = internalFilter(
    ast.left,
    rows,
    resultFast,
    path,
    highlights,
  );

  if (!ast.right) {
    throw new Error('Expected right to be defined.');
  }

  if (ast.type !== 'ConditionGroup') {
    throw new Error('Expected a condition group.');
  }

  if (ast.operator.type === 'OR') {
    const rightRows = internalFilter(
      ast.right,
      rows,
      resultFast,
      path,
      highlights,
    );

    return Array.from(
      new Set([
        ...leftRows,
        ...rightRows,
      ]),
    );
  } else if (ast.operator.type === 'AND') {
    return internalFilter(
      ast.right,
      leftRows,
      resultFast,
      path,
      highlights,
    );
  }

  throw new Error('Unexpected state.');
};
