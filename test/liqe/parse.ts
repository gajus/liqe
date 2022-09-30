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
    parse('foo &');
  })!;

  t.true(error instanceof SyntaxError);
  t.is(error.offset, 4);
  t.is(error.line, 1);
  t.is(error.column, 5);
});

// TODO not clear what the expected behavior is here
// Ideally we don't want to throw an error.
test.todo('empty query');
test.todo('()');

test('foo', testQuery, {
  expression: {
    location: {
      end: 3,
      start: 0,
    },
    quoted: false,
    type: 'LiteralExpression',
    value: 'foo',
  },
  field: {
    type: 'ImplicitField',
  },
  location: {
    start: 0,
  },
  type: 'TagExpression',
});

test('(foo)', testQuery, {
  expression: {
    expression: {
      location: {
        end: 4,
        start: 1,
      },
      quoted: false,
      type: 'LiteralExpression',
      value: 'foo',
    },
    field: {
      type: 'ImplicitField',
    },
    location: {
      start: 1,
    },
    type: 'TagExpression',
  },
  location: {
    end: 4,
    start: 0,
  },
  type: 'ParenthesizedExpression',
});

test('foo bar', testQuery, {
  left: {
    expression: {
      location: {
        end: 3,
        start: 0,
      },
      quoted: false,
      type: 'LiteralExpression',
      value: 'foo',
    },
    field: {
      type: 'ImplicitField',
    },
    location: {
      start: 0,
    },
    type: 'TagExpression',
  },
  location: {
    start: 0,
  },
  operator: {
    operator: 'AND',
    type: 'ImplicitBooleanOperator',
  },
  right: {
    expression: {
      location: {
        end: 7,
        start: 4,
      },
      quoted: false,
      type: 'LiteralExpression',
      value: 'bar',
    },
    field: {
      type: 'ImplicitField',
    },
    location: {
      start: 4,
    },
    type: 'TagExpression',
  },
  type: 'LogicalExpression',
});

test('foo_bar', testQuery, {
  expression: {
    location: {
      end: 7,
      start: 0,
    },
    quoted: false,
    type: 'LiteralExpression',
    value: 'foo_bar',
  },
  field: {
    type: 'ImplicitField',
  },
  location: {
    start: 0,
  },
  type: 'TagExpression',
});

test('"foo"', testQuery, {
  expression: {
    location: {
      end: 5,
      start: 0,
    },
    quoted: true,
    quotes: 'double',
    type: 'LiteralExpression',
    value: 'foo',
  },
  field: {
    type: 'ImplicitField',
  },
  location: {
    start: 0,
  },
  type: 'TagExpression',
});

test('\'foo\'', testQuery, {
  expression: {
    location: {
      end: 5,
      start: 0,
    },
    quoted: true,
    quotes: 'single',
    type: 'LiteralExpression',
    value: 'foo',
  },
  field: {
    type: 'ImplicitField',
  },
  location: {
    start: 0,
  },
  type: 'TagExpression',
});

test('/foo/', testQuery, {
  expression: {
    location: {
      end: 5,
      start: 0,
    },
    type: 'RegexExpression',
    value: '/foo/',
  },
  field: {
    type: 'ImplicitField',
  },
  location: {
    start: 0,
  },
  type: 'TagExpression',
});

test('/foo/ui', testQuery, {
  expression: {
    location: {
      end: 7,
      start: 0,
    },
    type: 'RegexExpression',
    value: '/foo/ui',
  },
  field: {
    type: 'ImplicitField',
  },
  location: {
    start: 0,
  },
  type: 'TagExpression',
});

test('/\\s/', testQuery, {
  expression: {
    location: {
      end: 4,
      start: 0,
    },
    type: 'RegexExpression',
    value: '/\\s/',
  },
  field: {
    type: 'ImplicitField',
  },
  location: {
    start: 0,
  },
  type: 'TagExpression',
});

test('/[^.:@\\s](?:[^:@\\s]*[^.:@\\s])?@[^.@\\s]+(?:\\.[^.@\\s]+)*/', testQuery, {
  expression: {
    location: {
      end: 55,
      start: 0,
    },
    type: 'RegexExpression',
    value: '/[^.:@\\s](?:[^:@\\s]*[^.:@\\s])?@[^.@\\s]+(?:\\.[^.@\\s]+)*/',
  },
  field: {
    type: 'ImplicitField',
  },
  location: {
    start: 0,
  },
  type: 'TagExpression',
});

test('foo:bar', testQuery, {
  expression: {
    location: {
      end: 7,
      start: 4,
    },
    quoted: false,
    type: 'LiteralExpression',
    value: 'bar',
  },
  field: {
    location: {
      end: 3,
      start: 0,
    },
    name: 'foo',
    path: ['foo'],
    quoted: false,
    type: 'Field',
  },
  location: {
    start: 0,
  },
  operator: {
    location: {
      end: 4,
      start: 3,
    },
    operator: ':',
    type: 'ComparisonOperator',
  },
  type: 'TagExpression',
});

test('foo: bar', testQuery, {
  expression: {
    location: {
      end: 8,
      start: 5,
    },
    quoted: false,
    type: 'LiteralExpression',
    value: 'bar',
  },
  field: {
    location: {
      end: 3,
      start: 0,
    },
    name: 'foo',
    path: ['foo'],
    quoted: false,
    type: 'Field',
  },
  location: {
    start: 0,
  },
  operator: {
    location: {
      end: 4,
      start: 3,
    },
    operator: ':',
    type: 'ComparisonOperator',
  },
  type: 'TagExpression',
});

test('foo:123', testQuery, {
  expression: {
    location: {
      end: 7,
      start: 4,
    },
    quoted: false,
    type: 'LiteralExpression',
    value: 123,
  },
  field: {
    location: {
      end: 3,
      start: 0,
    },
    name: 'foo',
    path: ['foo'],
    quoted: false,
    type: 'Field',
  },
  location: {
    start: 0,
  },
  operator: {
    location: {
      end: 4,
      start: 3,
    },
    operator: ':',
    type: 'ComparisonOperator',
  },
  type: 'TagExpression',
});

test('foo:=123', testQuery, {
  expression: {
    location: {
      end: 8,
      start: 5,
    },
    quoted: false,
    type: 'LiteralExpression',
    value: 123,
  },
  field: {
    location: {
      end: 3,
      start: 0,
    },
    name: 'foo',
    path: ['foo'],
    quoted: false,
    type: 'Field',
  },
  location: {
    start: 0,
  },
  operator: {
    location: {
      end: 5,
      start: 3,
    },
    operator: ':=',
    type: 'ComparisonOperator',
  },
  type: 'TagExpression',
});

test('foo:= 123', testQuery, {
  expression: {
    location: {
      end: 9,
      start: 6,
    },
    quoted: false,
    type: 'LiteralExpression',
    value: 123,
  },
  field: {
    location: {
      end: 3,
      start: 0,
    },
    name: 'foo',
    path: ['foo'],
    quoted: false,
    type: 'Field',
  },
  location: {
    start: 0,
  },
  operator: {
    location: {
      end: 5,
      start: 3,
    },
    operator: ':=',
    type: 'ComparisonOperator',
  },
  type: 'TagExpression',
});

test('foo:=-123', testQuery, {
  expression: {
    location: {
      end: 9,
      start: 5,
    },
    quoted: false,
    type: 'LiteralExpression',
    value: -123,
  },
  field: {
    location: {
      end: 3,
      start: 0,
    },
    name: 'foo',
    path: ['foo'],
    quoted: false,
    type: 'Field',
  },
  location: {
    start: 0,
  },
  operator: {
    location: {
      end: 5,
      start: 3,
    },
    operator: ':=',
    type: 'ComparisonOperator',
  },
  type: 'TagExpression',
});

test('foo:=123.4', testQuery, {
  expression: {
    location: {
      end: 10,
      start: 5,
    },
    quoted: false,
    type: 'LiteralExpression',
    value: 123.4,
  },
  field: {
    location: {
      end: 3,
      start: 0,
    },
    name: 'foo',
    path: ['foo'],
    quoted: false,
    type: 'Field',
  },
  location: {
    start: 0,
  },
  operator: {
    location: {
      end: 5,
      start: 3,
    },
    operator: ':=',
    type: 'ComparisonOperator',
  },
  type: 'TagExpression',
});

test('foo:>=123', testQuery, {
  expression: {
    location: {
      end: 9,
      start: 6,
    },
    quoted: false,
    type: 'LiteralExpression',
    value: 123,
  },
  field: {
    location: {
      end: 3,
      start: 0,
    },
    name: 'foo',
    path: ['foo'],
    quoted: false,
    type: 'Field',
  },
  location: {
    start: 0,
  },
  operator: {
    location: {
      end: 6,
      start: 3,
    },
    operator: ':>=',
    type: 'ComparisonOperator',
  },
  type: 'TagExpression',
});

test('foo:true', testQuery, {
  expression: {
    location: {
      end: 8,
      start: 4,
    },
    quoted: false,
    type: 'LiteralExpression',
    value: true,
  },
  field: {
    location: {
      end: 3,
      start: 0,
    },
    name: 'foo',
    path: ['foo'],
    quoted: false,
    type: 'Field',
  },
  location: {
    start: 0,
  },
  operator: {
    location: {
      end: 4,
      start: 3,
    },
    operator: ':',
    type: 'ComparisonOperator',
  },
  type: 'TagExpression',
});

test('foo:false', testQuery, {
  expression: {
    location: {
      end: 9,
      start: 4,
    },
    quoted: false,
    type: 'LiteralExpression',
    value: false,
  },
  field: {
    location: {
      end: 3,
      start: 0,
    },
    name: 'foo',
    path: ['foo'],
    quoted: false,
    type: 'Field',
  },
  location: {
    start: 0,
  },
  operator: {
    location: {
      end: 4,
      start: 3,
    },
    operator: ':',
    type: 'ComparisonOperator',
  },
  type: 'TagExpression',
});

test('foo:null', testQuery, {
  expression: {
    location: {
      end: 8,
      start: 4,
    },
    quoted: false,
    type: 'LiteralExpression',
    value: null,
  },
  field: {
    location: {
      end: 3,
      start: 0,
    },
    name: 'foo',
    path: ['foo'],
    quoted: false,
    type: 'Field',
  },
  location: {
    start: 0,
  },
  operator: {
    location: {
      end: 4,
      start: 3,
    },
    operator: ':',
    type: 'ComparisonOperator',
  },
  type: 'TagExpression',
});

test('foo.bar:baz', testQuery, {
  expression: {
    location: {
      end: 11,
      start: 8,
    },
    quoted: false,
    type: 'LiteralExpression',
    value: 'baz',
  },
  field: {
    location: {
      end: 7,
      start: 0,
    },
    name: 'foo.bar',
    path: [
      'foo',
      'bar',
    ],
    quoted: false,
    type: 'Field',
  },
  location: {
    start: 0,
  },
  operator: {
    location: {
      end: 8,
      start: 7,
    },
    operator: ':',
    type: 'ComparisonOperator',
  },
  type: 'TagExpression',
});

test('foo_bar:baz', testQuery, {
  expression: {
    location: {
      end: 11,
      start: 8,
    },
    quoted: false,
    type: 'LiteralExpression',
    value: 'baz',
  },
  field: {
    location: {
      end: 7,
      start: 0,
    },
    name: 'foo_bar',
    path: ['foo_bar'],
    quoted: false,
    type: 'Field',
  },
  location: {
    start: 0,
  },
  operator: {
    location: {
      end: 8,
      start: 7,
    },
    operator: ':',
    type: 'ComparisonOperator',
  },
  type: 'TagExpression',
});

test('$foo:baz', testQuery, {
  expression: {
    location: {
      end: 8,
      start: 5,
    },
    quoted: false,
    type: 'LiteralExpression',
    value: 'baz',
  },
  field: {
    location: {
      end: 4,
      start: 0,
    },
    name: '$foo',
    path: ['$foo'],
    quoted: false,
    type: 'Field',
  },
  location: {
    start: 0,
  },
  operator: {
    location: {
      end: 5,
      start: 4,
    },
    operator: ':',
    type: 'ComparisonOperator',
  },
  type: 'TagExpression',
});

test('"foo bar":baz', testQuery, {
  expression: {
    location: {
      end: 13,
      start: 10,
    },
    quoted: false,
    type: 'LiteralExpression',
    value: 'baz',
  },
  field: {
    location: {
      end: 9,
      start: 0,
    },
    name: 'foo bar',
    path: ['foo bar'],
    quoted: true,
    quotes: 'double',
    type: 'Field',
  },
  location: {
    start: 0,
  },
  operator: {
    location: {
      end: 10,
      start: 9,
    },
    operator: ':',
    type: 'ComparisonOperator',
  },
  type: 'TagExpression',
});

test('\'foo bar\':baz', testQuery, {
  expression: {
    location: {
      end: 13,
      start: 10,
    },
    quoted: false,
    type: 'LiteralExpression',
    value: 'baz',
  },
  field: {
    location: {
      end: 9,
      start: 0,
    },
    name: 'foo bar',
    path: ['foo bar'],
    quoted: true,
    quotes: 'single',
    type: 'Field',
  },
  location: {
    start: 0,
  },
  operator: {
    location: {
      end: 10,
      start: 9,
    },
    operator: ':',
    type: 'ComparisonOperator',
  },
  type: 'TagExpression',
});

test('foo:"bar"', testQuery, {
  expression: {
    location: {
      end: 9,
      start: 4,
    },
    quoted: true,
    quotes: 'double',
    type: 'LiteralExpression',
    value: 'bar',
  },
  field: {
    location: {
      end: 3,
      start: 0,
    },
    name: 'foo',
    path: ['foo'],
    quoted: false,
    type: 'Field',
  },
  location: {
    start: 0,
  },
  operator: {
    location: {
      end: 4,
      start: 3,
    },
    operator: ':',
    type: 'ComparisonOperator',
  },
  type: 'TagExpression',
});

test('foo:\'bar\'', testQuery, {
  expression: {
    location: {
      end: 9,
      start: 4,
    },
    quoted: true,
    quotes: 'single',
    type: 'LiteralExpression',
    value: 'bar',
  },
  field: {
    location: {
      end: 3,
      start: 0,
    },
    name: 'foo',
    path: ['foo'],
    quoted: false,
    type: 'Field',
  },
  location: {
    start: 0,
  },
  operator: {
    location: {
      end: 4,
      start: 3,
    },
    operator: ':',
    type: 'ComparisonOperator',
  },
  type: 'TagExpression',
});

test('foo:bar baz:qux', testQuery, {
  left: {
    expression: {
      location: {
        end: 7,
        start: 4,
      },
      quoted: false,
      type: 'LiteralExpression',
      value: 'bar',
    },
    field: {
      location: {
        end: 3,
        start: 0,
      },
      name: 'foo',
      path: ['foo'],
      quoted: false,
      type: 'Field',
    },
    location: {
      start: 0,
    },
    operator: {
      location: {
        end: 4,
        start: 3,
      },
      operator: ':',
      type: 'ComparisonOperator',
    },
    type: 'TagExpression',
  },
  location: {
    start: 0,
  },
  operator: {
    operator: 'AND',
    type: 'ImplicitBooleanOperator',
  },
  right: {
    expression: {
      location: {
        end: 15,
        start: 12,
      },
      quoted: false,
      type: 'LiteralExpression',
      value: 'qux',
    },
    field: {
      location: {
        end: 11,
        start: 8,
      },
      name: 'baz',
      path: ['baz'],
      quoted: false,
      type: 'Field',
    },
    location: {
      start: 8,
    },
    operator: {
      location: {
        end: 12,
        start: 11,
      },
      operator: ':',
      type: 'ComparisonOperator',
    },
    type: 'TagExpression',
  },
  type: 'LogicalExpression',
});

test('foo:bar AND baz:qux', testQuery, {
  left: {
    expression: {
      location: {
        end: 7,
        start: 4,
      },
      quoted: false,
      type: 'LiteralExpression',
      value: 'bar',
    },
    field: {
      location: {
        end: 3,
        start: 0,
      },
      name: 'foo',
      path: ['foo'],
      quoted: false,
      type: 'Field',
    },
    location: {
      start: 0,
    },
    operator: {
      location: {
        end: 4,
        start: 3,
      },
      operator: ':',
      type: 'ComparisonOperator',
    },
    type: 'TagExpression',
  },
  location: {
    start: 0,
  },
  operator: {
    location: {
      end: 11,
      start: 8,
    },
    operator: 'AND',
    type: 'BooleanOperator',
  },
  right: {
    expression: {
      location: {
        end: 19,
        start: 16,
      },
      quoted: false,
      type: 'LiteralExpression',
      value: 'qux',
    },
    field: {
      location: {
        end: 15,
        start: 12,
      },
      name: 'baz',
      path: ['baz'],
      quoted: false,
      type: 'Field',
    },
    location: {
      start: 12,
    },
    operator: {
      location: {
        end: 16,
        start: 15,
      },
      operator: ':',
      type: 'ComparisonOperator',
    },
    type: 'TagExpression',
  },
  type: 'LogicalExpression',
});

test('(foo:bar) AND (baz:qux)', testQuery, {
  left: {
    expression: {
      expression: {
        location: {
          end: 8,
          start: 5,
        },
        quoted: false,
        type: 'LiteralExpression',
        value: 'bar',
      },
      field: {
        location: {
          end: 4,
          start: 1,
        },
        name: 'foo',
        path: ['foo'],
        quoted: false,
        type: 'Field',
      },
      location: {
        start: 1,
      },
      operator: {
        location: {
          end: 5,
          start: 4,
        },
        operator: ':',
        type: 'ComparisonOperator',
      },
      type: 'TagExpression',
    },
    location: {
      end: 8,
      start: 0,
    },
    type: 'ParenthesizedExpression',
  },
  location: {
    start: 0,
  },
  operator: {
    location: {
      end: 13,
      start: 10,
    },
    operator: 'AND',
    type: 'BooleanOperator',
  },
  right: {
    expression: {
      expression: {
        location: {
          end: 22,
          start: 19,
        },
        quoted: false,
        type: 'LiteralExpression',
        value: 'qux',
      },
      field: {
        location: {
          end: 18,
          start: 15,
        },
        name: 'baz',
        path: ['baz'],
        quoted: false,
        type: 'Field',
      },
      location: {
        start: 15,
      },
      operator: {
        location: {
          end: 19,
          start: 18,
        },
        operator: ':',
        type: 'ComparisonOperator',
      },
      type: 'TagExpression',
    },
    location: {
      end: 22,
      start: 14,
    },
    type: 'ParenthesizedExpression',
  },
  type: 'LogicalExpression',
});

test('(foo:bar AND baz:qux)', testQuery, {
  expression: {
    left: {
      expression: {
        location: {
          end: 8,
          start: 5,
        },
        quoted: false,
        type: 'LiteralExpression',
        value: 'bar',
      },
      field: {
        location: {
          end: 4,
          start: 1,
        },
        name: 'foo',
        path: ['foo'],
        quoted: false,
        type: 'Field',
      },
      location: {
        start: 1,
      },
      operator: {
        location: {
          end: 5,
          start: 4,
        },
        operator: ':',
        type: 'ComparisonOperator',
      },
      type: 'TagExpression',
    },
    location: {
      start: 1,
    },
    operator: {
      location: {
        end: 12,
        start: 9,
      },
      operator: 'AND',
      type: 'BooleanOperator',
    },
    right: {
      expression: {
        location: {
          end: 20,
          start: 17,
        },
        quoted: false,
        type: 'LiteralExpression',
        value: 'qux',
      },
      field: {
        location: {
          end: 16,
          start: 13,
        },
        name: 'baz',
        path: ['baz'],
        quoted: false,
        type: 'Field',
      },
      location: {
        start: 13,
      },
      operator: {
        location: {
          end: 17,
          start: 16,
        },
        operator: ':',
        type: 'ComparisonOperator',
      },
      type: 'TagExpression',
    },
    type: 'LogicalExpression',
  },
  location: {
    end: 20,
    start: 0,
  },
  type: 'ParenthesizedExpression',
});

test('NOT foo:bar', testQuery, {
  location: {
    end: 3,
    start: 0,
  },
  operand: {
    expression: {
      location: {
        end: 11,
        start: 8,
      },
      quoted: false,
      type: 'LiteralExpression',
      value: 'bar',
    },
    field: {
      location: {
        end: 7,
        start: 4,
      },
      name: 'foo',
      path: ['foo'],
      quoted: false,
      type: 'Field',
    },
    location: {
      start: 4,
    },
    operator: {
      location: {
        end: 8,
        start: 7,
      },
      operator: ':',
      type: 'ComparisonOperator',
    },
    type: 'TagExpression',
  },
  operator: 'NOT',
  type: 'UnaryOperator',
});

test('-foo:bar', testQuery, {
  location: {
    end: 1,
    start: 0,
  },
  operand: {
    expression: {
      location: {
        end: 8,
        start: 5,
      },
      quoted: false,
      type: 'LiteralExpression',
      value: 'bar',
    },
    field: {
      location: {
        end: 4,
        start: 1,
      },
      name: 'foo',
      path: ['foo'],
      quoted: false,
      type: 'Field',
    },
    location: {
      start: 1,
    },
    operator: {
      location: {
        end: 5,
        start: 4,
      },
      operator: ':',
      type: 'ComparisonOperator',
    },
    type: 'TagExpression',
  },
  operator: '-',
  type: 'UnaryOperator',
});

test('NOT (foo:bar)', testQuery, {
  location: {
    end: 3,
    start: 0,
  },
  operand: {
    expression: {
      expression: {
        location: {
          end: 12,
          start: 9,
        },
        quoted: false,
        type: 'LiteralExpression',
        value: 'bar',
      },
      field: {
        location: {
          end: 8,
          start: 5,
        },
        name: 'foo',
        path: ['foo'],
        quoted: false,
        type: 'Field',
      },
      location: {
        start: 5,
      },
      operator: {
        location: {
          end: 9,
          start: 8,
        },
        operator: ':',
        type: 'ComparisonOperator',
      },
      type: 'TagExpression',
    },
    location: {
      end: 12,
      start: 4,
    },
    type: 'ParenthesizedExpression',
  },
  operator: 'NOT',
  type: 'UnaryOperator',
});

test('NOT (foo:bar AND baz:qux)', testQuery, {
  location: {
    end: 3,
    start: 0,
  },
  operand: {
    expression: {
      left: {
        expression: {
          location: {
            end: 12,
            start: 9,
          },
          quoted: false,
          type: 'LiteralExpression',
          value: 'bar',
        },
        field: {
          location: {
            end: 8,
            start: 5,
          },
          name: 'foo',
          path: ['foo'],
          quoted: false,
          type: 'Field',
        },
        location: {
          start: 5,
        },
        operator: {
          location: {
            end: 9,
            start: 8,
          },
          operator: ':',
          type: 'ComparisonOperator',
        },
        type: 'TagExpression',
      },
      location: {
        start: 5,
      },
      operator: {
        location: {
          end: 16,
          start: 13,
        },
        operator: 'AND',
        type: 'BooleanOperator',
      },
      right: {
        expression: {
          location: {
            end: 24,
            start: 21,
          },
          quoted: false,
          type: 'LiteralExpression',
          value: 'qux',
        },
        field: {
          location: {
            end: 20,
            start: 17,
          },
          name: 'baz',
          path: ['baz'],
          quoted: false,
          type: 'Field',
        },
        location: {
          start: 17,
        },
        operator: {
          location: {
            end: 21,
            start: 20,
          },
          operator: ':',
          type: 'ComparisonOperator',
        },
        type: 'TagExpression',
      },
      type: 'LogicalExpression',
    },
    location: {
      end: 24,
      start: 4,
    },
    type: 'ParenthesizedExpression',
  },
  operator: 'NOT',
  type: 'UnaryOperator',
});

test('foo:bar AND NOT baz:qux', testQuery, {
  left: {
    expression: {
      location: {
        end: 7,
        start: 4,
      },
      quoted: false,
      type: 'LiteralExpression',
      value: 'bar',
    },
    field: {
      location: {
        end: 3,
        start: 0,
      },
      name: 'foo',
      path: ['foo'],
      quoted: false,
      type: 'Field',
    },
    location: {
      start: 0,
    },
    operator: {
      location: {
        end: 4,
        start: 3,
      },
      operator: ':',
      type: 'ComparisonOperator',
    },
    type: 'TagExpression',
  },
  location: {
    start: 0,
  },
  operator: {
    location: {
      end: 11,
      start: 8,
    },
    operator: 'AND',
    type: 'BooleanOperator',
  },
  right: {
    location: {
      end: 15,
      start: 12,
    },
    operand: {
      expression: {
        location: {
          end: 23,
          start: 20,
        },
        quoted: false,
        type: 'LiteralExpression',
        value: 'qux',
      },
      field: {
        location: {
          end: 19,
          start: 16,
        },
        name: 'baz',
        path: ['baz'],
        quoted: false,
        type: 'Field',
      },
      location: {
        start: 16,
      },
      operator: {
        location: {
          end: 20,
          start: 19,
        },
        operator: ':',
        type: 'ComparisonOperator',
      },
      type: 'TagExpression',
    },
    operator: 'NOT',
    type: 'UnaryOperator',
  },
  type: 'LogicalExpression',
});

test('foo:bar AND baz:qux AND quuz:corge', testQuery, {
  left: {
    left: {
      expression: {
        location: {
          end: 7,
          start: 4,
        },
        quoted: false,
        type: 'LiteralExpression',
        value: 'bar',
      },
      field: {
        location: {
          end: 3,
          start: 0,
        },
        name: 'foo',
        path: ['foo'],
        quoted: false,
        type: 'Field',
      },
      location: {
        start: 0,
      },
      operator: {
        location: {
          end: 4,
          start: 3,
        },
        operator: ':',
        type: 'ComparisonOperator',
      },
      type: 'TagExpression',
    },
    location: {
      start: 0,
    },
    operator: {
      location: {
        end: 11,
        start: 8,
      },
      operator: 'AND',
      type: 'BooleanOperator',
    },
    right: {
      expression: {
        location: {
          end: 19,
          start: 16,
        },
        quoted: false,
        type: 'LiteralExpression',
        value: 'qux',
      },
      field: {
        location: {
          end: 15,
          start: 12,
        },
        name: 'baz',
        path: ['baz'],
        quoted: false,
        type: 'Field',
      },
      location: {
        start: 12,
      },
      operator: {
        location: {
          end: 16,
          start: 15,
        },
        operator: ':',
        type: 'ComparisonOperator',
      },
      type: 'TagExpression',
    },
    type: 'LogicalExpression',
  },
  location: {
    start: 0,
  },
  operator: {
    location: {
      end: 23,
      start: 20,
    },
    operator: 'AND',
    type: 'BooleanOperator',
  },
  right: {
    expression: {
      location: {
        end: 34,
        start: 29,
      },
      quoted: false,
      type: 'LiteralExpression',
      value: 'corge',
    },
    field: {
      location: {
        end: 28,
        start: 24,
      },
      name: 'quuz',
      path: ['quuz'],
      quoted: false,
      type: 'Field',
    },
    location: {
      start: 24,
    },
    operator: {
      location: {
        end: 29,
        start: 28,
      },
      operator: ':',
      type: 'ComparisonOperator',
    },
    type: 'TagExpression',
  },
  type: 'LogicalExpression',
});

test('(foo:bar)', testQuery, {
  expression: {
    expression: {
      location: {
        end: 8,
        start: 5,
      },
      quoted: false,
      type: 'LiteralExpression',
      value: 'bar',
    },
    field: {
      location: {
        end: 4,
        start: 1,
      },
      name: 'foo',
      path: ['foo'],
      quoted: false,
      type: 'Field',
    },
    location: {
      start: 1,
    },
    operator: {
      location: {
        end: 5,
        start: 4,
      },
      operator: ':',
      type: 'ComparisonOperator',
    },
    type: 'TagExpression',
  },
  location: {
    end: 8,
    start: 0,
  },
  type: 'ParenthesizedExpression',
});

test('((foo:bar))', testQuery, {
  expression: {
    expression: {
      expression: {
        location: {
          end: 9,
          start: 6,
        },
        quoted: false,
        type: 'LiteralExpression',
        value: 'bar',
      },
      field: {
        location: {
          end: 5,
          start: 2,
        },
        name: 'foo',
        path: ['foo'],
        quoted: false,
        type: 'Field',
      },
      location: {
        start: 2,
      },
      operator: {
        location: {
          end: 6,
          start: 5,
        },
        operator: ':',
        type: 'ComparisonOperator',
      },
      type: 'TagExpression',
    },
    location: {
      end: 9,
      start: 1,
    },
    type: 'ParenthesizedExpression',
  },
  location: {
    end: 10,
    start: 0,
  },
  type: 'ParenthesizedExpression',
});

test('( foo:bar )', testQuery, {
  expression: {
    expression: {
      location: {
        end: 9,
        start: 6,
      },
      quoted: false,
      type: 'LiteralExpression',
      value: 'bar',
    },
    field: {
      location: {
        end: 5,
        start: 2,
      },
      name: 'foo',
      path: ['foo'],
      quoted: false,
      type: 'Field',
    },
    location: {
      start: 2,
    },
    operator: {
      location: {
        end: 6,
        start: 5,
      },
      operator: ':',
      type: 'ComparisonOperator',
    },
    type: 'TagExpression',
  },
  location: {
    end: 10,
    start: 0,
  },
  type: 'ParenthesizedExpression',
});

test('(foo:bar OR baz:qux)', testQuery, {
  expression: {
    left: {
      expression: {
        location: {
          end: 8,
          start: 5,
        },
        quoted: false,
        type: 'LiteralExpression',
        value: 'bar',
      },
      field: {
        location: {
          end: 4,
          start: 1,
        },
        name: 'foo',
        path: ['foo'],
        quoted: false,
        type: 'Field',
      },
      location: {
        start: 1,
      },
      operator: {
        location: {
          end: 5,
          start: 4,
        },
        operator: ':',
        type: 'ComparisonOperator',
      },
      type: 'TagExpression',
    },
    location: {
      start: 1,
    },
    operator: {
      location: {
        end: 11,
        start: 9,
      },
      operator: 'OR',
      type: 'BooleanOperator',
    },
    right: {
      expression: {
        location: {
          end: 19,
          start: 16,
        },
        quoted: false,
        type: 'LiteralExpression',
        value: 'qux',
      },
      field: {
        location: {
          end: 15,
          start: 12,
        },
        name: 'baz',
        path: ['baz'],
        quoted: false,
        type: 'Field',
      },
      location: {
        start: 12,
      },
      operator: {
        location: {
          end: 16,
          start: 15,
        },
        operator: ':',
        type: 'ComparisonOperator',
      },
      type: 'TagExpression',
    },
    type: 'LogicalExpression',
  },
  location: {
    end: 19,
    start: 0,
  },
  type: 'ParenthesizedExpression',
});

test('foo:bar OR (baz:qux OR quuz:corge)', testQuery, {
  left: {
    expression: {
      location: {
        end: 7,
        start: 4,
      },
      quoted: false,
      type: 'LiteralExpression',
      value: 'bar',
    },
    field: {
      location: {
        end: 3,
        start: 0,
      },
      name: 'foo',
      path: ['foo'],
      quoted: false,
      type: 'Field',
    },
    location: {
      start: 0,
    },
    operator: {
      location: {
        end: 4,
        start: 3,
      },
      operator: ':',
      type: 'ComparisonOperator',
    },
    type: 'TagExpression',
  },
  location: {
    start: 0,
  },
  operator: {
    location: {
      end: 10,
      start: 8,
    },
    operator: 'OR',
    type: 'BooleanOperator',
  },
  right: {
    expression: {
      left: {
        expression: {
          location: {
            end: 19,
            start: 16,
          },
          quoted: false,
          type: 'LiteralExpression',
          value: 'qux',
        },
        field: {
          location: {
            end: 15,
            start: 12,
          },
          name: 'baz',
          path: ['baz'],
          quoted: false,
          type: 'Field',
        },
        location: {
          start: 12,
        },
        operator: {
          location: {
            end: 16,
            start: 15,
          },
          operator: ':',
          type: 'ComparisonOperator',
        },
        type: 'TagExpression',
      },
      location: {
        start: 12,
      },
      operator: {
        location: {
          end: 22,
          start: 20,
        },
        operator: 'OR',
        type: 'BooleanOperator',
      },
      right: {
        expression: {
          location: {
            end: 33,
            start: 28,
          },
          quoted: false,
          type: 'LiteralExpression',
          value: 'corge',
        },
        field: {
          location: {
            end: 27,
            start: 23,
          },
          name: 'quuz',
          path: ['quuz'],
          quoted: false,
          type: 'Field',
        },
        location: {
          start: 23,
        },
        operator: {
          location: {
            end: 28,
            start: 27,
          },
          operator: ':',
          type: 'ComparisonOperator',
        },
        type: 'TagExpression',
      },
      type: 'LogicalExpression',
    },
    location: {
      end: 33,
      start: 11,
    },
    type: 'ParenthesizedExpression',
  },
  type: 'LogicalExpression',
});

test('(foo:bar OR baz:qux) OR quuz:corge', testQuery, {
  left: {
    expression: {
      left: {
        expression: {
          location: {
            end: 8,
            start: 5,
          },
          quoted: false,
          type: 'LiteralExpression',
          value: 'bar',
        },
        field: {
          location: {
            end: 4,
            start: 1,
          },
          name: 'foo',
          path: ['foo'],
          quoted: false,
          type: 'Field',
        },
        location: {
          start: 1,
        },
        operator: {
          location: {
            end: 5,
            start: 4,
          },
          operator: ':',
          type: 'ComparisonOperator',
        },
        type: 'TagExpression',
      },
      location: {
        start: 1,
      },
      operator: {
        location: {
          end: 11,
          start: 9,
        },
        operator: 'OR',
        type: 'BooleanOperator',
      },
      right: {
        expression: {
          location: {
            end: 19,
            start: 16,
          },
          quoted: false,
          type: 'LiteralExpression',
          value: 'qux',
        },
        field: {
          location: {
            end: 15,
            start: 12,
          },
          name: 'baz',
          path: ['baz'],
          quoted: false,
          type: 'Field',
        },
        location: {
          start: 12,
        },
        operator: {
          location: {
            end: 16,
            start: 15,
          },
          operator: ':',
          type: 'ComparisonOperator',
        },
        type: 'TagExpression',
      },
      type: 'LogicalExpression',
    },
    location: {
      end: 19,
      start: 0,
    },
    type: 'ParenthesizedExpression',
  },
  location: {
    start: 0,
  },
  operator: {
    location: {
      end: 23,
      start: 21,
    },
    operator: 'OR',
    type: 'BooleanOperator',
  },
  right: {
    expression: {
      location: {
        end: 34,
        start: 29,
      },
      quoted: false,
      type: 'LiteralExpression',
      value: 'corge',
    },
    field: {
      location: {
        end: 28,
        start: 24,
      },
      name: 'quuz',
      path: ['quuz'],
      quoted: false,
      type: 'Field',
    },
    location: {
      start: 24,
    },
    operator: {
      location: {
        end: 29,
        start: 28,
      },
      operator: ':',
      type: 'ComparisonOperator',
    },
    type: 'TagExpression',
  },
  type: 'LogicalExpression',
});

test('[1 TO 2]', testQuery, {
  expression: {
    location: {
      end: 7,
      start: 0,
    },
    range: {
      max: 2,
      maxInclusive: true,
      min: 1,
      minInclusive: true,
    },
    type: 'RangeExpression',
  },
  field: {
    type: 'ImplicitField',
  },
  location: {
    start: 0,
  },
  type: 'TagExpression',
});

test('{1 TO 2]', testQuery, {
  expression: {
    location: {
      end: 7,
      start: 0,
    },
    range: {
      max: 2,
      maxInclusive: true,
      min: 1,
      minInclusive: false,
    },
    type: 'RangeExpression',
  },
  field: {
    type: 'ImplicitField',
  },
  location: {
    start: 0,
  },
  type: 'TagExpression',
});

test('[1 TO 2}', testQuery, {
  expression: {
    location: {
      end: 7,
      start: 0,
    },
    range: {
      max: 2,
      maxInclusive: false,
      min: 1,
      minInclusive: true,
    },
    type: 'RangeExpression',
  },
  field: {
    type: 'ImplicitField',
  },
  location: {
    start: 0,
  },
  type: 'TagExpression',
});

test('{1 TO 2}', testQuery, {
  expression: {
    location: {
      end: 7,
      start: 0,
    },
    range: {
      max: 2,
      maxInclusive: false,
      min: 1,
      minInclusive: false,
    },
    type: 'RangeExpression',
  },
  field: {
    type: 'ImplicitField',
  },
  location: {
    start: 0,
  },
  type: 'TagExpression',
});
