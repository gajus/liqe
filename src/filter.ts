/* eslint-disable complexity */

import micromatch from 'micromatch';
import parseRegex from 'regex-parser';
import type {
  Ast,
} from './types';

const createRegexTest = (regex: string) => {
  const rule = parseRegex(regex);

  return (subject: string): boolean => {
    return rule.test(subject);
  };
};

const check = (term, value, ast: Ast) => {
  if (Array.isArray(value)) {
    for (const item of value) {
      if (check(term, item, ast)) {
        return true;
      }
    }

    return false;
  }

  if (ast.range) {
    if (value < ast.range.min) {
      return false;
    }

    if (value === ast.range.min && !ast.range.minInclusive) {
      return false;
    }

    if (value > ast.range.max) {
      return false;
    }

    if (value === ast.range.max && !ast.range.maxInclusive) {
      return false;
    }

    return true;
  }

  if (typeof term === 'boolean') {
    return term === value;
  } else if (term === null) {
    return term === null;
  } else if (typeof value === 'string') {
    let normalizedValue = value;

    if (
      ast.quoted === false
    ) {
      normalizedValue = normalizedValue.toLowerCase();
    }

    if (!ast.test) {
      if (ast.regex) {
        ast.test = createRegexTest(ast.term);
      } else if (term.includes('*') && ast.quoted === false) {
        ast.test = micromatch.matcher(term);
      }
    }

    if (ast.test) {
      return ast.test(normalizedValue);
    }

    return normalizedValue.includes(term);
  } else if (typeof term === 'number' && typeof value === 'number') {
    switch (ast.relationalOperator) {
      case '=': return value === term;
      case '>': return value > term;
      case '<': return value < term;
      case '>=': return value >= term;
      case '<=': return value <= term;
      default: throw new Error(`Unimplemented relational operator: ${ast.relationalOperator}`);
    }
  } else {
    return false;
  }
};

const fieldFilter = <T extends Object>(row: T, ast: Ast): boolean => {
  let term = ast.term;

  if (
    ast.quoted !== true &&
    ast.regex !== true &&
    typeof ast.term === 'string'
  ) {
    term = term.toLowerCase();
  }

  if (ast.field in row) {
    return check(
      term,
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

    return check(
      term,
      value,
      ast,
    );
  } else if (ast.field === '<implicit>') {
    for (const field in row) {
      if (fieldFilter(row, {...ast, field})) {
        return true;
      }
    }

    return false;
  } else {
    return false;
  }
};

export const filter = <T extends Object>(
  inputData: readonly T[],
  ast: Ast,
): readonly T[] => {
  const data = inputData;

  if (ast.field) {
    return data.filter((row) => {
      return fieldFilter(row, ast);
    });
  }

  if (ast.operator === 'NOT' && ast.operand) {
    const removeData = filter(
      data,
      ast.operand,
    );

    return data.filter((row) => {
      return !removeData.includes(row);
    });
  }

  if (!ast.left) {
    throw new Error('Unexpected state.');
  }

  const leftData = filter(
    data,
    ast.left,
  );

  if (ast.operator === 'OR') {
    const rightData = filter(
      data,
      ast.right,
    );

    return Array.from(
      new Set([
        ...leftData,
        ...rightData,
      ]),
    );
  } else if (ast.operator === 'AND') {
    return filter(
      leftData,
      ast.right,
    );
  }

  throw new Error('Unexpected state.');
};
