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

// Technically, this is a memory leak.
// Practically, it is unlikely to cause issues and
// it is the most efficient method of caching regex.
// Alternatively, we could initiate regexCache
// in the `internalFilter` closure.
const regexCache = {};

const createRegexTest = (regex: string) => {
  let rule: RegExp;

  if (regexCache[regex]) {
    rule = regexCache[regex];
  } else {
    rule = regexCache[regex] = parseRegex(regex);
  }

  return (subject: string): string | false => {
    return subject.match(rule)?.[0] ?? false;
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
  resultFast: boolean,
  path: string[],
  highlights: Highlight[],
) => {
  const capture = (condition: boolean | string) => {
    if (condition) {
      highlights.push({
        ...typeof condition === 'string' && {keyword: condition},
        path: path.join('.'),
      });

      return true;
    }

    return false;
  };

  if (typeof value === 'number' && ast.range) {
    return capture(testRange(value, ast.range));
  } else if (typeof query === 'boolean') {
    return capture(query === value);
  } else if (query === null) {
    return capture(query === null);
  } else if (typeof value === 'string') {
    return capture(testString(ast, query, value));
  } else if (typeof query === 'number' && typeof value === 'number' && ast.relationalOperator) {
    return capture(testRelationalRange(query, value, ast.relationalOperator));
  } else if (Array.isArray(value)) {
    let foundMatch = false;
    let index = 0;

    for (const item of value) {
      if (testValue(query, item, ast, resultFast, [...path, String(index++)], highlights)) {
        if (resultFast) {
          return true;
        }

        foundMatch = true;
      }
    }

    return foundMatch;
  } else if (typeof value === 'object' && value !== null) {
    let foundMatch = false;

    for (const key of Object.keys(value)) {
      if (testValue(query, value[key], ast, resultFast, [...path, key], highlights)) {
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

const testField = <T extends Object>(
  row: T,
  ast: Ast,
  resultFast: boolean,
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
      resultFast,
      path,
      highlights,
    );
  } else if (ast.field.includes('.')) {
    let value = row;

    for (const key of ast.field.split('.')) {
      if (typeof value !== 'object' || value === null) {
        return false;
      } else if (key in value) {
        value = value[key];
      } else {
        return false;
      }
    }

    return testValue(
      query,
      value,
      ast,
      resultFast,
      path,
      highlights,
    );
  } else if (ast.field === '<implicit>') {
    let foundMatch = false;
    for (const field in row) {
      if (testField(
        row,
        {...ast, field},
        resultFast,
        [
          ...path,
          field,
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
  ast: Ast,
  rows: readonly T[],
  resultFast: boolean = true,
  path: string[] = [],
  highlights: Highlight[] = [],
): readonly T[] => {
  if (ast.field) {
    return rows.filter((row) => {
      return testField(
        row,
        ast,
        resultFast,
        ast.field === '<implicit>' ? path : [...path, ast.field],
        highlights,
      );
    });
  }

  if (ast.operator === 'NOT' && ast.operand) {
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
    throw new Error('Unexpected state.');
  }

  const leftRows = internalFilter(
    ast.left,
    rows,
    resultFast,
    path,
    highlights,
  );

  if (ast.operator === 'OR') {
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
  } else if (ast.operator === 'AND') {
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
