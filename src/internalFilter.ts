import parseRegex from 'regex-parser';
import {
  escapeRegexString,
} from './escapeRegexString';
import type {
  Ast,
  Range,
  RelationalOperator,
  Highlight,
} from './types';

const createRegexTest = (regex: string) => {
  const rule = parseRegex(regex);

  return (subject: string): string | false => {
    const result = subject.match(rule);

    return result ? result[0] : false;
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

const testString = (ast: Ast, query: string, value: string): string | false => {
  if (!ast.test) {
    if (ast.regex) {
      ast.test = createRegexTest(ast.query);
    } else if (query.includes('*') && ast.quoted === false) {
      ast.test = createRegexTest('/(' + query.replace(/\*/g, '.+?') + ')/' + (ast.quoted ? 'u' : 'ui'));
    } else {
      ast.test = createRegexTest('/(' + escapeRegexString(ast.query) + ')/' + (ast.quoted ? 'u' : 'ui'));
    }
  }

  return ast.test(value);
};

const testValue = (
  query: string,
  value: unknown,
  ast: Ast,
  failFast: boolean,
  path: string[],
  highlights: Highlight[],
) => {
  const capture = (condition: boolean | string) => {
    if (condition) {
      if (highlights) {
        if (typeof condition === 'string') {
          highlights.push({
            keyword: condition,
            path: path.join('.'),
          });
        } else {
          highlights.push({
            path: path.join('.'),
          });
        }
      }

      return true;
    }

    return false;
  };

  if (Array.isArray(value)) {
    let foundMatch = false;
    let index = 0;

    for (const item of value) {
      if (testValue(query, item, ast, failFast, [...path, String(index++)], highlights)) {
        if (failFast) {
          return true;
        }

        foundMatch = true;
      }
    }

    return foundMatch;
  } else if (typeof value === 'number' && ast.range) {
    return capture(testRange(value, ast.range));
  } else if (typeof query === 'boolean') {
    return capture(query === value);
  } else if (query === null) {
    return capture(query === null);
  } else if (typeof value === 'string') {
    return capture(testString(ast, query, value));
  } else if (typeof query === 'number' && typeof value === 'number' && ast.relationalOperator) {
    return capture(testRelationalRange(query, value, ast.relationalOperator));
  } else {
    return false;
  }
};

const testField = <T extends Object>(
  row: T,
  ast: Ast,
  failFast: boolean,
  path: string[],
  highlights: Highlight[],
): boolean => {
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
      failFast,
      path,
      highlights,
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
      failFast,
      path,
      highlights,
    );
  } else if (ast.field === '<implicit>') {
    let foundMatch = false;
    for (const field in row) {
      if (testField(
        row,
        {...ast, field},
        failFast,
        [
          ...path,
          field,
        ],
        highlights,
      )) {
        if (failFast) {
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
  ast: Ast,
  data: readonly T[],
  failFast: boolean = true,
  path: string[] = [],
  highlights: Highlight[] = [],
): readonly T[] => {
  if (ast.field) {
    return data.filter((row) => {
      return testField(
        row,
        ast,
        failFast,
        ast.field === '<implicit>' ? path : [...path, ast.field],
        highlights,
      );
    });
  }

  if (ast.operator === 'NOT' && ast.operand) {
    const removeData = internalFilter(
      ast.operand,
      data,
      failFast,
      path,
      [],
    );

    return data.filter((row) => {
      return !removeData.includes(row);
    });
  }

  if (!ast.left) {
    throw new Error('Unexpected state.');
  }

  const leftData = internalFilter(
    ast.left,
    data,
    failFast,
    path,
    highlights,
  );

  if (ast.operator === 'OR') {
    const rightData = internalFilter(
      ast.right,
      data,
      failFast,
      path,
      highlights,
    );

    return Array.from(
      new Set([
        ...leftData,
        ...rightData,
      ]),
    );
  } else if (ast.operator === 'AND') {
    return internalFilter(
      ast.right,
      leftData,
      failFast,
      path,
      highlights,
    );
  }

  throw new Error('Unexpected state.');
};
