/* eslint-disable @typescript-eslint/no-non-null-assertion */

import test from 'ava';
import {
  SyntaxError,
} from '../../src/errors';
import {
  parse,
} from '../../src/parse';

const testQuery = (t, expectedAst) => {
  const ast = parse(t.title);

  t.deepEqual(ast, expectedAst);
};

test('error describes offset', (t) => {
  const error = t.throws<SyntaxError>(() => {
    parse('foo bar');
  })!;

  t.true(error instanceof SyntaxError);
  t.is(error.offset, 4);
  t.is(error.line, 1);
  t.is(error.column, 5);
});

test('foo', testQuery, {
  expression: {
    quoted: false,
    type: 'LiteralExpression',
    value: 'foo',
  },
  field: {
    name: '<implicit>',
  },
  type: 'Condition',
});

test.skip('foo bar', testQuery, {
  left: {
    expression: {
      quoted: false,
      value: 'foo',
    },
    field: {
      name: '<implicit>',
    },
    type: 'Condition',
  },
  operator: 'AND',
  right: {
    expression: {
      quoted: false,
      value: 'bar',
    },
    field: {
      name: '<implicit>',
    },
    type: 'Condition',
  },
  type: 'ConditionGroup',
});

test('foo_bar', testQuery, {
  expression: {
    quoted: false,
    type: 'LiteralExpression',
    value: 'foo_bar',
  },
  field: {
    name: '<implicit>',
  },
  type: 'Condition',
});

test('"foo"', testQuery, {
  expression: {
    quoted: true,
    quotes: 'double',
    type: 'LiteralExpression',
    value: 'foo',
  },
  field: {
    name: '<implicit>',
  },
  type: 'Condition',
});

test('\'foo\'', testQuery, {
  expression: {
    quoted: true,
    quotes: 'single',
    type: 'LiteralExpression',
    value: 'foo',
  },
  field: {
    name: '<implicit>',
  },
  type: 'Condition',
});

test('/foo/', testQuery, {
  expression: {
    type: 'RegexExpression',
    value: '/foo/',
  },
  field: {
    name: '<implicit>',
  },
  type: 'Condition',
});

test('/foo/ui', testQuery, {
  expression: {
    type: 'RegexExpression',
    value: '/foo/ui',
  },
  field: {
    name: '<implicit>',
  },
  type: 'Condition',
});

test('/\\s/', testQuery, {
  expression: {
    type: 'RegexExpression',
    value: '/\\s/',
  },
  field: {
    name: '<implicit>',
  },
  type: 'Condition',
});

test('/[^.:@\\s](?:[^:@\\s]*[^.:@\\s])?@[^.@\\s]+(?:\\.[^.@\\s]+)*/', testQuery, {
  expression: {
    type: 'RegexExpression',
    value: '/[^.:@\\s](?:[^:@\\s]*[^.:@\\s])?@[^.@\\s]+(?:\\.[^.@\\s]+)*/',
  },
  field: {
    name: '<implicit>',
  },
  type: 'Condition',
});

test('foo:bar', testQuery, {
  expression: {
    quoted: false,
    type: 'LiteralExpression',
    value: 'bar',
  },
  field: {
    location: 0,
    name: 'foo',
    path: ['foo'],
    quoted: false,
  },
  type: 'Condition',
});

test('foo:   bar', testQuery, {
  expression: {
    quoted: false,
    type: 'LiteralExpression',
    value: 'bar',
  },
  field: {
    location: 0,
    name: 'foo',
    path: ['foo'],
    quoted: false,
  },
  type: 'Condition',
});

test('foo:123', testQuery, {
  expression: {
    quoted: false,
    type: 'LiteralExpression',
    value: '123',
  },
  field: {
    location: 0,
    name: 'foo',
    path: ['foo'],
    quoted: false,
  },
  type: 'Condition',
});

test('foo:=123', testQuery, {
  expression: {
    quoted: false,
    type: 'LiteralExpression',
    value: 123,
  },
  field: {
    location: 0,
    name: 'foo',
    path: ['foo'],
    quoted: false,
  },
  relationalOperator: '=',
  type: 'Condition',
});

test('foo:=   123', testQuery, {
  expression: {
    quoted: false,
    type: 'LiteralExpression',
    value: 123,
  },
  field: {
    location: 0,
    name: 'foo',
    path: ['foo'],
    quoted: false,
  },
  relationalOperator: '=',
  type: 'Condition',
});

test('foo:=-123', testQuery, {
  expression: {
    quoted: false,
    type: 'LiteralExpression',
    value: -123,
  },
  field: {
    location: 0,
    name: 'foo',
    path: ['foo'],
    quoted: false,
  },
  relationalOperator: '=',
  type: 'Condition',
});

test('foo:=123.4', testQuery, {
  expression: {
    quoted: false,
    type: 'LiteralExpression',
    value: 123.4,
  },
  field: {
    location: 0,
    name: 'foo',
    path: ['foo'],
    quoted: false,
  },
  relationalOperator: '=',
  type: 'Condition',
});

test('foo:>=123', testQuery, {
  expression: {
    quoted: false,
    type: 'LiteralExpression',
    value: 123,
  },
  field: {
    location: 0,
    name: 'foo',
    path: ['foo'],
    quoted: false,
  },
  relationalOperator: '>=',
  type: 'Condition',
});

test('foo:true', testQuery, {
  expression: {
    quoted: false,
    type: 'LiteralExpression',
    value: true,
  },
  field: {
    location: 0,
    name: 'foo',
    path: ['foo'],
    quoted: false,
  },
  type: 'Condition',
});

test('foo:false', testQuery, {
  expression: {
    quoted: false,
    type: 'LiteralExpression',
    value: false,
  },
  field: {
    location: 0,
    name: 'foo',
    path: ['foo'],
    quoted: false,
  },
  type: 'Condition',
});

test('foo:null', testQuery, {
  expression: {
    quoted: false,
    type: 'LiteralExpression',
    value: null,
  },
  field: {
    location: 0,
    name: 'foo',
    path: ['foo'],
    quoted: false,
  },
  type: 'Condition',
});

test('foo.bar:baz', testQuery, {
  expression: {
    quoted: false,
    type: 'LiteralExpression',
    value: 'baz',
  },
  field: {
    location: 0,
    name: 'foo.bar',
    path: [
      'foo',
      'bar',
    ],
    quoted: false,
  },
  type: 'Condition',
});

test('foo_bar:baz', testQuery, {
  expression: {
    quoted: false,
    type: 'LiteralExpression',
    value: 'baz',
  },
  field: {
    location: 0,
    name: 'foo_bar',
    path: ['foo_bar'],
    quoted: false,
  },
  type: 'Condition',
});

test('$foo:baz', testQuery, {
  expression: {
    quoted: false,
    type: 'LiteralExpression',
    value: 'baz',
  },
  field: {
    location: 0,
    name: '$foo',
    path: ['$foo'],
    quoted: false,
  },
  type: 'Condition',
});

test('"foo bar":baz', testQuery, {
  expression: {
    quoted: false,
    type: 'LiteralExpression',
    value: 'baz',
  },
  field: {
    location: 0,
    name: 'foo bar',
    path: ['foo bar'],
    quoted: true,
    quotes: 'double',
  },
  type: 'Condition',
});

test('\'foo bar\':baz', testQuery, {
  expression: {
    quoted: false,
    type: 'LiteralExpression',
    value: 'baz',
  },
  field: {
    location: 0,
    name: 'foo bar',
    path: ['foo bar'],
    quoted: true,
    quotes: 'single',
  },
  type: 'Condition',
});

test('foo:"bar"', testQuery, {
  expression: {
    quoted: true,
    quotes: 'double',
    type: 'LiteralExpression',
    value: 'bar',
  },
  field: {
    location: 0,
    name: 'foo',
    path: ['foo'],
    quoted: false,
  },
  type: 'Condition',
});

test('foo:\'bar\'', testQuery, {
  expression: {
    quoted: true,
    quotes: 'single',
    type: 'LiteralExpression',
    value: 'bar',
  },
  field: {
    location: 0,
    name: 'foo',
    path: ['foo'],
    quoted: false,
  },
  type: 'Condition',
});

test.skip('foo:bar baz:qux', testQuery, {
  left: {
    expression: {
      quoted: false,
      type: 'LiteralExpression',
      value: 'bar',
    },
    field: {
      name: 'foo',
      path: ['foo'],
      quoted: false,
    },
    type: 'Condition',
  },
  operator: 'AND',
  right: {
    expression: {
      quoted: false,
      type: 'LiteralExpression',
      value: 'qux',
    },
    field: {
      name: 'baz',
      path: ['baz'],
      quoted: false,
    },
    type: 'Condition',
  },
  type: 'ConditionGroup',
});

test('foo:bar AND baz:qux', testQuery, {
  left: {
    expression: {
      quoted: false,
      type: 'LiteralExpression',
      value: 'bar',
    },
    field: {
      location: 0,
      name: 'foo',
      path: ['foo'],
      quoted: false,
    },
    type: 'Condition',
  },
  operator: 'AND',
  right: {
    expression: {
      quoted: false,
      type: 'LiteralExpression',
      value: 'qux',
    },
    field: {
      location: 12,
      name: 'baz',
      path: ['baz'],
      quoted: false,
    },
    type: 'Condition',
  },
  type: 'ConditionGroup',
});

test('(foo:bar) AND (baz:qux)', testQuery, {
  left: {
    expression: {
      quoted: false,
      type: 'LiteralExpression',
      value: 'bar',
    },
    field: {
      location: 1,
      name: 'foo',
      path: ['foo'],
      quoted: false,
    },
    type: 'Condition',
  },
  operator: 'AND',
  right: {
    expression: {
      quoted: false,
      type: 'LiteralExpression',
      value: 'qux',
    },
    field: {
      location: 15,
      name: 'baz',
      path: ['baz'],
      quoted: false,
    },
    type: 'Condition',
  },
  type: 'ConditionGroup',
});

test('(foo:bar AND baz:qux)', testQuery, {
  left: {
    expression: {
      quoted: false,
      type: 'LiteralExpression',
      value: 'bar',
    },
    field: {
      location: 1,
      name: 'foo',
      path: ['foo'],
      quoted: false,
    },
    type: 'Condition',
  },
  operator: 'AND',
  right: {
    expression: {
      quoted: false,
      type: 'LiteralExpression',
      value: 'qux',
    },
    field: {
      location: 13,
      name: 'baz',
      path: ['baz'],
      quoted: false,
    },
    type: 'Condition',
  },
  type: 'ConditionGroup',
});

test.skip('NOT (foo:bar AND baz:qux)', testQuery, {
  operand: {
    left: {
      expression: {
        quoted: false,
        type: 'LiteralExpression',
        value: 'bar',
      },
      field: {
        name: 'foo',
        path: ['foo'],
        quoted: false,
      },
      type: 'Condition',
    },
    operator: 'AND',
    right: {
      expression: {
        quoted: false,
        type: 'LiteralExpression',
        value: 'qux',
      },
      field: {
        name: 'baz',
        path: ['baz'],
        quoted: false,
      },
      type: 'Condition',
    },
    type: 'ConditionGroup',
  },
  operator: 'NOT',
  type: 'Operand',
});

test('NOT foo:bar', testQuery, {
  operand: {
    expression: {
      quoted: false,
      type: 'LiteralExpression',
      value: 'bar',
    },
    field: {
      location: 4,
      name: 'foo',
      path: ['foo'],
      quoted: false,
    },
    type: 'Condition',
  },
  operator: 'NOT',
  type: 'Operand',
});

test('foo:bar AND NOT baz:qux', testQuery, {
  left: {
    expression: {
      quoted: false,
      type: 'LiteralExpression',
      value: 'bar',
    },
    field: {
      location: 0,
      name: 'foo',
      path: ['foo'],
      quoted: false,
    },
    type: 'Condition',
  },
  operator: 'AND',
  right: {
    operand: {
      expression: {
        quoted: false,
        type: 'LiteralExpression',
        value: 'qux',
      },
      field: {
        location: 16,
        name: 'baz',
        path: ['baz'],
        quoted: false,
      },
      type: 'Condition',
    },
    operator: 'NOT',
    type: 'Operand',
  },
  type: 'ConditionGroup',
});

test('foo:bar AND baz:qux AND quuz:corge', testQuery, {
  left: {
    left: {
      expression: {
        quoted: false,
        type: 'LiteralExpression',
        value: 'bar',
      },
      field: {
        location: 0,
        name: 'foo',
        path: ['foo'],
        quoted: false,
      },
      type: 'Condition',
    },
    operator: 'AND',
    right: {
      expression: {
        quoted: false,
        type: 'LiteralExpression',
        value: 'qux',
      },
      field: {
        location: 12,
        name: 'baz',
        path: ['baz'],
        quoted: false,
      },
      type: 'Condition',
    },
    type: 'ConditionGroup',
  },
  operator: 'AND',
  right: {
    expression: {
      quoted: false,
      type: 'LiteralExpression',
      value: 'corge',
    },
    field: {
      location: 24,
      name: 'quuz',
      path: ['quuz'],
      quoted: false,
    },
    type: 'Condition',
  },
  type: 'ConditionGroup',
});

test('(foo:bar)', testQuery, {
  expression: {
    quoted: false,
    type: 'LiteralExpression',
    value: 'bar',
  },
  field: {
    location: 1,
    name: 'foo',
    path: ['foo'],
    quoted: false,
  },
  type: 'Condition',
});

test('((foo:bar))', testQuery, {
  expression: {
    quoted: false,
    type: 'LiteralExpression',
    value: 'bar',
  },
  field: {
    location: 2,
    name: 'foo',
    path: ['foo'],
    quoted: false,
  },
  type: 'Condition',
});

test('( foo:bar )', testQuery, {
  expression: {
    quoted: false,
    type: 'LiteralExpression',
    value: 'bar',
  },
  field: {
    location: 2,
    name: 'foo',
    path: ['foo'],
    quoted: false,
  },
  type: 'Condition',
});

test('(foo:bar OR baz:qux)', testQuery, {
  left: {
    expression: {
      quoted: false,
      type: 'LiteralExpression',
      value: 'bar',
    },
    field: {
      location: 1,
      name: 'foo',
      path: ['foo'],
      quoted: false,
    },
    type: 'Condition',
  },
  operator: 'OR',
  right: {
    expression: {
      quoted: false,
      type: 'LiteralExpression',
      value: 'qux',
    },
    field: {
      location: 12,
      name: 'baz',
      path: ['baz'],
      quoted: false,
    },
    type: 'Condition',
  },
  type: 'ConditionGroup',
});

test('foo:bar OR (baz:qux OR quuz:corge)', testQuery, {
  left: {
    expression: {
      quoted: false,
      type: 'LiteralExpression',
      value: 'bar',
    },
    field: {
      location: 0,
      name: 'foo',
      path: ['foo'],
      quoted: false,
    },
    type: 'Condition',
  },
  operator: 'OR',
  right: {
    left: {
      expression: {
        quoted: false,
        type: 'LiteralExpression',
        value: 'qux',
      },
      field: {
        location: 12,
        name: 'baz',
        path: ['baz'],
        quoted: false,
      },
      type: 'Condition',
    },
    operator: 'OR',
    right: {
      expression: {
        quoted: false,
        type: 'LiteralExpression',
        value: 'corge',
      },
      field: {
        location: 23,
        name: 'quuz',
        path: ['quuz'],
        quoted: false,
      },
      type: 'Condition',
    },
    type: 'ConditionGroup',
  },
  type: 'ConditionGroup',
});

test('(foo:bar OR baz:qux) OR quuz:corge', testQuery, {
  left: {
    left: {
      expression: {
        quoted: false,
        type: 'LiteralExpression',
        value: 'bar',
      },
      field: {
        location: 1,
        name: 'foo',
        path: ['foo'],
        quoted: false,
      },
      type: 'Condition',
    },
    operator: 'OR',
    right: {
      expression: {
        quoted: false,
        type: 'LiteralExpression',
        value: 'qux',
      },
      field: {
        location: 12,
        name: 'baz',
        path: ['baz'],
        quoted: false,
      },
      type: 'Condition',
    },
    type: 'ConditionGroup',
  },
  operator: 'OR',
  right: {
    expression: {
      quoted: false,
      type: 'LiteralExpression',
      value: 'corge',
    },
    field: {
      location: 24,
      name: 'quuz',
      path: ['quuz'],
      quoted: false,
    },
    type: 'Condition',
  },
  type: 'ConditionGroup',
});

test('[1 TO 2]', testQuery, {
  expression: {
    range: {
      max: 2,
      maxInclusive: true,
      min: 1,
      minInclusive: true,
    },
    type: 'RangeExpression',
  },
  field: {
    name: '<implicit>',
  },
  type: 'Condition',
});

test('{1 TO 2]', testQuery, {
  expression: {
    range: {
      max: 2,
      maxInclusive: true,
      min: 1,
      minInclusive: false,
    },
    type: 'RangeExpression',
  },
  field: {
    name: '<implicit>',
  },
  type: 'Condition',
});

test('[1 TO 2}', testQuery, {
  expression: {
    range: {
      max: 2,
      maxInclusive: false,
      min: 1,
      minInclusive: true,
    },
    type: 'RangeExpression',
  },
  field: {
    name: '<implicit>',
  },
  type: 'Condition',
});

test('{1 TO 2}', testQuery, {
  expression: {
    range: {
      max: 2,
      maxInclusive: false,
      min: 1,
      minInclusive: false,
    },
    type: 'RangeExpression',
  },
  field: {
    name: '<implicit>',
  },
  type: 'Condition',
});
