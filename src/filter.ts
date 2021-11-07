import parseRegex from 'regex-parser';
import type {
  Ast,
  Range,
  RelationalOperator,
} from './types';

const createRegexTest = (regex: string) => {
  const rule = parseRegex(regex);

  return (subject: string): boolean => {
    return rule.test(subject);
  };
};

const testRange = (value: number, range: Range): boolean => {
  if (value < range.min) {
    return false;
  }

  if (value === range.min && !range.minInclusive) {
    return false;
  }

  if (value > range.max) {
    return false;
  }

  if (value === range.max && !range.maxInclusive) {
    return false;
  }

  return true;
};

const testRelationalRange = (query: number, value: number, relationalOperator: RelationalOperator): boolean => {
  switch (relationalOperator) {
    case '=': return value === query;
    case '>': return value > query;
    case '<': return value < query;
    case '>=': return value >= query;
    case '<=': return value <= query;
    default: throw new Error(`Unimplemented relational operator: ${relationalOperator}`);
  }
};

const testString = (ast: Ast, query: string, value: string): boolean => {
  let normalizedValue = value;

  if (
    ast.regex !== true &&
    ast.quoted === false
  ) {
    normalizedValue = normalizedValue.toLowerCase();
  }

  if (!ast.test) {
    if (ast.regex) {
      ast.test = createRegexTest(ast.query);
    } else if (query.includes('*') && ast.quoted === false) {
      ast.test = createRegexTest(query.replace(/\*/g, '.*?'));
    }
  }

  if (ast.test) {
    return ast.test(normalizedValue);
  }

  return normalizedValue.includes(query);
};

const testValue = (query, value, ast: Ast) => {
  if (Array.isArray(value)) {
    for (const item of value) {
      if (testValue(query, item, ast)) {
        return true;
      }
    }

    return false;
  }

  if (ast.range) {
    return testRange(value, ast.range);
  }

  if (typeof query === 'boolean') {
    return query === value;
  } else if (query === null) {
    return query === null;
  } else if (typeof value === 'string') {
    return testString(ast, query, value);
  } else if (typeof query === 'number' && typeof value === 'number' && ast.relationalOperator) {
    return testRelationalRange(query, value, ast.relationalOperator);
  } else {
    return false;
  }
};

const testField = <T extends Object>(row: T, ast: Ast): boolean => {
  let query = ast.query;

  if (
    ast.quoted !== true &&
    ast.regex !== true &&
    typeof ast.query === 'string'
  ) {
    query = query.toLowerCase();
  }

  if (ast.field in row) {
    return testValue(
      query,
      row[ast.field],
      ast,
    );
  } else if (ast.field.includes('.')) {
    let value = row;

    for (const key of ast.field.split('.')) {
      if (typeof value !== 'object' || value === null) {
        return false;
      }
      if (key in value) {
        value = value[key];
      } else {
        return false;
      }
    }

    return testValue(
      query,
      value,
      ast,
    );
  } else if (ast.field === '<implicit>') {
    for (const field in row) {
      if (testField(row, {...ast, field})) {
        return true;
      }
    }

    return false;
  } else {
    return false;
  }
};

export const filter = <T extends Object>(
  ast: Ast,
  inputData: readonly T[],
): readonly T[] => {
  const data = inputData;

  if (ast.field) {
    return data.filter((row) => {
      return testField(row, ast);
    });
  }

  if (ast.operator === 'NOT' && ast.operand) {
    const removeData = filter(
      ast.operand,
      data,
    );

    return data.filter((row) => {
      return !removeData.includes(row);
    });
  }

  if (!ast.left) {
    throw new Error('Unexpected state.');
  }

  const leftData = filter(
    ast.left,
    data,
  );

  if (ast.operator === 'OR') {
    const rightData = filter(
      ast.right,
      data,
    );

    return Array.from(
      new Set([
        ...leftData,
        ...rightData,
      ]),
    );
  } else if (ast.operator === 'AND') {
    return filter(
      ast.right,
      leftData,
    );
  }

  throw new Error('Unexpected state.');
};
