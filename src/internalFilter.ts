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

const testRange = (value: unknown, range: Range): boolean => {
  if (typeof value === 'number') {
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
  }

  // @todo handle non-numeric ranges -- https://github.com/gajus/liqe/issues/3

  return false;
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

const testString = (ast: Ast, value: string): string | false => {
  if (!ast.test) {
    if (ast.regex) {
      ast.test = createRegexTest(ast.query);
    } else if (ast.query.includes('*') && ast.quoted === false) {
      ast.test = createRegexTest('/(' + ast.query.replace(/\*/g, '.+?') + ')/' + (ast.quoted ? 'u' : 'ui'));
    } else {
      ast.test = createRegexTest('/(' + escapeRegexString(ast.query) + ')/' + (ast.quoted ? 'u' : 'ui'));
    }
  }

  return ast.test(value);
};

const testValue = (
  ast: Ast,
  value: unknown,
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

  if (ast.range) {
    return capture(testRange(value, ast.range));
  } else if (ast.relationalOperator) {
    if (typeof value !== 'number') {
      return false;
    }

    return capture(testRelationalRange(ast.query as unknown as number, value, ast.relationalOperator));
  } else if (ast.query === null) {
    return capture(ast.query === null);
  } else if (typeof ast.query === 'boolean') {
    return capture(ast.query === value);
  } else if (typeof value === 'string') {
    return capture(testString(ast, value));
  } else if (Array.isArray(value)) {
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
  if (ast.field in row) {
    return testValue(
      ast,
      row[ast.field],
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
      ast,
      value,
      resultFast,
      path,
      highlights,
    );
  } else if (ast.field === '<implicit>') {
    let foundMatch = false;

    for (const field in row) {
      if (testValue(
        {
          ...ast,
          field,
        },
        row[field],
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
