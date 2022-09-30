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
    location: 0,
    quoted: false,
    type: 'LiteralExpression',
    value: 'foo',
  },
  field: {
    type: 'ImplicitField',
  },
  type: 'TagExpression',
});

test('(foo)', testQuery, {
  expression: {
    expression: {
      location: 1,
      quoted: false,
      type: 'LiteralExpression',
      value: 'foo',
    },
    field: {
      type: 'ImplicitField',
    },
    type: 'TagExpression',
  },
  type: 'ParenthesizedExpression',
});

test('foo bar', testQuery, {
  left: {
    expression: {
      location: 0,
      quoted: false,
      type: 'LiteralExpression',
      value: 'foo',
    },
    field: {
      type: 'ImplicitField',
    },
    type: 'TagExpression',
  },
  operator: {
    operator: 'AND',
    type: 'ImplicitOperator',
  },
  right: {
    expression: {
      location: 4,
      quoted: false,
      type: 'LiteralExpression',
      value: 'bar',
    },
    field: {
      type: 'ImplicitField',
    },
    type: 'TagExpression',
  },
  type: 'LogicalExpression',
});

test('foo_bar', testQuery, {
  expression: {
    location: 0,
    quoted: false,
    type: 'LiteralExpression',
    value: 'foo_bar',
  },
  field: {
    type: 'ImplicitField',
  },
  type: 'TagExpression',
});

test('"foo"', testQuery, {
  expression: {
    location: 0,
    quoted: true,
    quotes: 'double',
    type: 'LiteralExpression',
    value: 'foo',
  },
  field: {
    type: 'ImplicitField',
  },
  type: 'TagExpression',
});

test('\'foo\'', testQuery, {
  expression: {
    location: 0,
    quoted: true,
    quotes: 'single',
    type: 'LiteralExpression',
    value: 'foo',
  },
  field: {
    type: 'ImplicitField',
  },
  type: 'TagExpression',
});

test('/foo/', testQuery, {
  expression: {
    location: 0,
    type: 'RegexExpression',
    value: '/foo/',
  },
  field: {
    type: 'ImplicitField',
  },
  type: 'TagExpression',
});

test('/foo/ui', testQuery, {
  expression: {
    location: 0,
    type: 'RegexExpression',
    value: '/foo/ui',
  },
  field: {
    type: 'ImplicitField',
  },
  type: 'TagExpression',
});

test('/\\s/', testQuery, {
  expression: {
    location: 0,
    type: 'RegexExpression',
    value: '/\\s/',
  },
  field: {
    type: 'ImplicitField',
  },
  type: 'TagExpression',
});

test('/[^.:@\\s](?:[^:@\\s]*[^.:@\\s])?@[^.@\\s]+(?:\\.[^.@\\s]+)*/', testQuery, {
  expression: {
    location: 0,
    type: 'RegexExpression',
    value: '/[^.:@\\s](?:[^:@\\s]*[^.:@\\s])?@[^.@\\s]+(?:\\.[^.@\\s]+)*/',
  },
  field: {
    type: 'ImplicitField',
  },
  type: 'TagExpression',
});

test('foo:bar', testQuery, {
  expression: {
    location: 4,
    quoted: false,
    type: 'LiteralExpression',
    value: 'bar',
  },
  field: {
    location: 0,
    name: 'foo',
    path: ['foo'],
    quoted: false,
    type: 'Field',
  },
  type: 'TagExpression',
});

test('foo: bar', testQuery, {
  expression: {
    location: 5,
    quoted: false,
    type: 'LiteralExpression',
    value: 'bar',
  },
  field: {
    location: 0,
    name: 'foo',
    path: ['foo'],
    quoted: false,
    type: 'Field',
  },
  type: 'TagExpression',
});

test('foo:123', testQuery, {
  expression: {
    location: 4,
    quoted: false,
    type: 'LiteralExpression',
    value: '123',
  },
  field: {
    location: 0,
    name: 'foo',
    path: ['foo'],
    quoted: false,
    type: 'Field',
  },
  type: 'TagExpression',
});

test('foo:=123', testQuery, {
  expression: {
    location: 5,
    quoted: false,
    type: 'LiteralExpression',
    value: 123,
  },
  field: {
    location: 0,
    name: 'foo',
    path: ['foo'],
    quoted: false,
    type: 'Field',
  },
  relationalOperator: '=',
  type: 'TagExpression',
});

test('foo:= 123', testQuery, {
  expression: {
    location: 6,
    quoted: false,
    type: 'LiteralExpression',
    value: 123,
  },
  field: {
    location: 0,
    name: 'foo',
    path: ['foo'],
    quoted: false,
    type: 'Field',
  },
  relationalOperator: '=',
  type: 'TagExpression',
});

test('foo:=-123', testQuery, {
  expression: {
    location: 5,
    quoted: false,
    type: 'LiteralExpression',
    value: -123,
  },
  field: {
    location: 0,
    name: 'foo',
    path: ['foo'],
    quoted: false,
    type: 'Field',
  },
  relationalOperator: '=',
  type: 'TagExpression',
});

test('foo:=123.4', testQuery, {
  expression: {
    location: 5,
    quoted: false,
    type: 'LiteralExpression',
    value: 123.4,
  },
  field: {
    location: 0,
    name: 'foo',
    path: ['foo'],
    quoted: false,
    type: 'Field',
  },
  relationalOperator: '=',
  type: 'TagExpression',
});

test('foo:>=123', testQuery, {
  expression: {
    location: 5,
    quoted: false,
    type: 'LiteralExpression',
    value: 123,
  },
  field: {
    location: 0,
    name: 'foo',
    path: ['foo'],
    quoted: false,
    type: 'Field',
  },
  relationalOperator: '>=',
  type: 'TagExpression',
});

test('foo:true', testQuery, {
  expression: {
    location: 4,
    quoted: false,
    type: 'LiteralExpression',
    value: true,
  },
  field: {
    location: 0,
    name: 'foo',
    path: ['foo'],
    quoted: false,
    type: 'Field',
  },
  type: 'TagExpression',
});

test('foo:false', testQuery, {
  expression: {
    location: 4,
    quoted: false,
    type: 'LiteralExpression',
    value: false,
  },
  field: {
    location: 0,
    name: 'foo',
    path: ['foo'],
    quoted: false,
    type: 'Field',
  },
  type: 'TagExpression',
});

test('foo:null', testQuery, {
  expression: {
    location: 4,
    quoted: false,
    type: 'LiteralExpression',
    value: null,
  },
  field: {
    location: 0,
    name: 'foo',
    path: ['foo'],
    quoted: false,
    type: 'Field',
  },
  type: 'TagExpression',
});

test('foo.bar:baz', testQuery, {
  expression: {
    location: 8,
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
    type: 'Field',
  },
  type: 'TagExpression',
});

test('foo_bar:baz', testQuery, {
  expression: {
    location: 8,
    quoted: false,
    type: 'LiteralExpression',
    value: 'baz',
  },
  field: {
    location: 0,
    name: 'foo_bar',
    path: ['foo_bar'],
    quoted: false,
    type: 'Field',
  },
  type: 'TagExpression',
});

test('$foo:baz', testQuery, {
  expression: {
    location: 5,
    quoted: false,
    type: 'LiteralExpression',
    value: 'baz',
  },
  field: {
    location: 0,
    name: '$foo',
    path: ['$foo'],
    quoted: false,
    type: 'Field',
  },
  type: 'TagExpression',
});

test('"foo bar":baz', testQuery, {
  expression: {
    location: 10,
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
    type: 'Field',
  },
  type: 'TagExpression',
});

test('\'foo bar\':baz', testQuery, {
  expression: {
    location: 10,
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
    type: 'Field',
  },
  type: 'TagExpression',
});

test('foo:"bar"', testQuery, {
  expression: {
    location: 4,
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
    type: 'Field',
  },
  type: 'TagExpression',
});

test('foo:\'bar\'', testQuery, {
  expression: {
    location: 4,
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
    type: 'Field',
  },
  type: 'TagExpression',
});

test('foo:bar baz:qux', testQuery, {
  left: {
    expression: {
      location: 4,
      quoted: false,
      type: 'LiteralExpression',
      value: 'bar',
    },
    field: {
      location: 0,
      name: 'foo',
      path: ['foo'],
      quoted: false,
      type: 'Field',
    },
    type: 'TagExpression',
  },
  operator: {
    operator: 'AND',
    type: 'ImplicitOperator',
  },
  right: {
    expression: {
      location: 12,
      quoted: false,
      type: 'LiteralExpression',
      value: 'qux',
    },
    field: {
      location: 8,
      name: 'baz',
      path: ['baz'],
      quoted: false,
      type: 'Field',
    },
    type: 'TagExpression',
  },
  type: 'LogicalExpression',
});

test('foo:bar AND baz:qux', testQuery, {
  left: {
    expression: {
      location: 4,
      quoted: false,
      type: 'LiteralExpression',
      value: 'bar',
    },
    field: {
      location: 0,
      name: 'foo',
      path: ['foo'],
      quoted: false,
      type: 'Field',
    },
    type: 'TagExpression',
  },
  operator: {
    location: 8,
    operator: 'AND',
    type: 'Operator',
  },
  right: {
    expression: {
      location: 16,
      quoted: false,
      type: 'LiteralExpression',
      value: 'qux',
    },
    field: {
      location: 12,
      name: 'baz',
      path: ['baz'],
      quoted: false,
      type: 'Field',
    },
    type: 'TagExpression',
  },
  type: 'LogicalExpression',
});

test('(foo:bar) AND (baz:qux)', testQuery, {
  left: {
    expression: {
      expression: {
        location: 5,
        quoted: false,
        type: 'LiteralExpression',
        value: 'bar',
      },
      field: {
        location: 1,
        name: 'foo',
        path: ['foo'],
        quoted: false,
        type: 'Field',
      },
      type: 'TagExpression',
    },
    type: 'ParenthesizedExpression',
  },
  operator: {
    location: 10,
    operator: 'AND',
    type: 'Operator',
  },
  right: {
    expression: {
      expression: {
        location: 19,
        quoted: false,
        type: 'LiteralExpression',
        value: 'qux',
      },
      field: {
        location: 15,
        name: 'baz',
        path: ['baz'],
        quoted: false,
        type: 'Field',
      },
      type: 'TagExpression',
    },
    type: 'ParenthesizedExpression',
  },
  type: 'LogicalExpression',
});

test('(foo:bar AND baz:qux)', testQuery, {
  expression: {
    left: {
      expression: {
        location: 5,
        quoted: false,
        type: 'LiteralExpression',
        value: 'bar',
      },
      field: {
        location: 1,
        name: 'foo',
        path: ['foo'],
        quoted: false,
        type: 'Field',
      },
      type: 'TagExpression',
    },
    operator: {
      location: 9,
      operator: 'AND',
      type: 'Operator',
    },
    right: {
      expression: {
        location: 17,
        quoted: false,
        type: 'LiteralExpression',
        value: 'qux',
      },
      field: {
        location: 13,
        name: 'baz',
        path: ['baz'],
        quoted: false,
        type: 'Field',
      },
      type: 'TagExpression',
    },
    type: 'LogicalExpression',
  },
  type: 'ParenthesizedExpression',
});

test.skip('NOT (foo:bar AND baz:qux)', testQuery, {
  operand: {
    left: {
      expression: {
        location: 9,
        quoted: false,
        type: 'LiteralExpression',
        value: 'bar',
      },
      field: {
        name: 'foo',
        path: ['foo'],
        quoted: false,
        type: 'Field',
      },
      type: 'TagExpression',
    },
    operator: {
      operator: 'AND',
      type: 'Operator',
    },
    right: {
      expression: {
        location: 21,
        quoted: false,
        type: 'LiteralExpression',
        value: 'qux',
      },
      field: {
        name: 'baz',
        path: ['baz'],
        quoted: false,
        type: 'Field',
      },
      type: 'TagExpression',
    },
    type: 'LogicalExpression',
  },
  operator: 'NOT',
  type: 'Operand',
});

test('NOT foo:bar', testQuery, {
  operand: {
    expression: {
      location: 8,
      quoted: false,
      type: 'LiteralExpression',
      value: 'bar',
    },
    field: {
      location: 4,
      name: 'foo',
      path: ['foo'],
      quoted: false,
      type: 'Field',
    },
    type: 'TagExpression',
  },
  operator: 'NOT',
  type: 'Operand',
});

test('foo:bar AND NOT baz:qux', testQuery, {
  left: {
    expression: {
      location: 4,
      quoted: false,
      type: 'LiteralExpression',
      value: 'bar',
    },
    field: {
      location: 0,
      name: 'foo',
      path: ['foo'],
      quoted: false,
      type: 'Field',
    },
    type: 'TagExpression',
  },
  operator: {
    location: 8,
    operator: 'AND',
    type: 'Operator',
  },
  right: {
    operand: {
      expression: {
        location: 20,
        quoted: false,
        type: 'LiteralExpression',
        value: 'qux',
      },
      field: {
        location: 16,
        name: 'baz',
        path: ['baz'],
        quoted: false,
        type: 'Field',
      },
      type: 'TagExpression',
    },
    operator: 'NOT',
    type: 'Operand',
  },
  type: 'LogicalExpression',
});

test('foo:bar AND baz:qux AND quuz:corge', testQuery, {
  left: {
    left: {
      expression: {
        location: 4,
        quoted: false,
        type: 'LiteralExpression',
        value: 'bar',
      },
      field: {
        location: 0,
        name: 'foo',
        path: ['foo'],
        quoted: false,
        type: 'Field',
      },
      type: 'TagExpression',
    },
    operator: {
      location: 8,
      operator: 'AND',
      type: 'Operator',
    },
    right: {
      expression: {
        location: 16,
        quoted: false,
        type: 'LiteralExpression',
        value: 'qux',
      },
      field: {
        location: 12,
        name: 'baz',
        path: ['baz'],
        quoted: false,
        type: 'Field',
      },
      type: 'TagExpression',
    },
    type: 'LogicalExpression',
  },
  operator: {
    location: 20,
    operator: 'AND',
    type: 'Operator',
  },
  right: {
    expression: {
      location: 29,
      quoted: false,
      type: 'LiteralExpression',
      value: 'corge',
    },
    field: {
      location: 24,
      name: 'quuz',
      path: ['quuz'],
      quoted: false,
      type: 'Field',
    },
    type: 'TagExpression',
  },
  type: 'LogicalExpression',
});

test('(foo:bar)', testQuery, {
  expression: {
    expression: {
      location: 5,
      quoted: false,
      type: 'LiteralExpression',
      value: 'bar',
    },
    field: {
      location: 1,
      name: 'foo',
      path: ['foo'],
      quoted: false,
      type: 'Field',
    },
    type: 'TagExpression',
  },
  type: 'ParenthesizedExpression',
});

test('((foo:bar))', testQuery, {
  expression: {
    expression: {
      expression: {
        location: 6,
        quoted: false,
        type: 'LiteralExpression',
        value: 'bar',
      },
      field: {
        location: 2,
        name: 'foo',
        path: ['foo'],
        quoted: false,
        type: 'Field',
      },
      type: 'TagExpression',
    },
    type: 'ParenthesizedExpression',
  },
  type: 'ParenthesizedExpression',
});

test('( foo:bar )', testQuery, {
  expression: {
    expression: {
      location: 6,
      quoted: false,
      type: 'LiteralExpression',
      value: 'bar',
    },
    field: {
      location: 2,
      name: 'foo',
      path: ['foo'],
      quoted: false,
      type: 'Field',
    },
    type: 'TagExpression',
  },
  type: 'ParenthesizedExpression',
});

test('(foo:bar OR baz:qux)', testQuery, {
  expression: {
    left: {
      expression: {
        location: 5,
        quoted: false,
        type: 'LiteralExpression',
        value: 'bar',
      },
      field: {
        location: 1,
        name: 'foo',
        path: ['foo'],
        quoted: false,
        type: 'Field',
      },
      type: 'TagExpression',
    },
    operator: {
      location: 9,
      operator: 'OR',
      type: 'Operator',
    },
    right: {
      expression: {
        location: 16,
        quoted: false,
        type: 'LiteralExpression',
        value: 'qux',
      },
      field: {
        location: 12,
        name: 'baz',
        path: ['baz'],
        quoted: false,
        type: 'Field',
      },
      type: 'TagExpression',
    },
    type: 'LogicalExpression',
  },
  type: 'ParenthesizedExpression',
});

test('foo:bar OR (baz:qux OR quuz:corge)', testQuery, {
  left: {
    expression: {
      location: 4,
      quoted: false,
      type: 'LiteralExpression',
      value: 'bar',
    },
    field: {
      location: 0,
      name: 'foo',
      path: ['foo'],
      quoted: false,
      type: 'Field',
    },
    type: 'TagExpression',
  },
  operator: {
    location: 8,
    operator: 'OR',
    type: 'Operator',
  },
  right: {
    expression: {
      left: {
        expression: {
          location: 16,
          quoted: false,
          type: 'LiteralExpression',
          value: 'qux',
        },
        field: {
          location: 12,
          name: 'baz',
          path: ['baz'],
          quoted: false,
          type: 'Field',
        },
        type: 'TagExpression',
      },
      operator: {
        location: 20,
        operator: 'OR',
        type: 'Operator',
      },
      right: {
        expression: {
          location: 28,
          quoted: false,
          type: 'LiteralExpression',
          value: 'corge',
        },
        field: {
          location: 23,
          name: 'quuz',
          path: ['quuz'],
          quoted: false,
          type: 'Field',
        },
        type: 'TagExpression',
      },
      type: 'LogicalExpression',
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
          location: 5,
          quoted: false,
          type: 'LiteralExpression',
          value: 'bar',
        },
        field: {
          location: 1,
          name: 'foo',
          path: ['foo'],
          quoted: false,
          type: 'Field',
        },
        type: 'TagExpression',
      },
      operator: {
        location: 9,
        operator: 'OR',
        type: 'Operator',
      },
      right: {
        expression: {
          location: 16,
          quoted: false,
          type: 'LiteralExpression',
          value: 'qux',
        },
        field: {
          location: 12,
          name: 'baz',
          path: ['baz'],
          quoted: false,
          type: 'Field',
        },
        type: 'TagExpression',
      },
      type: 'LogicalExpression',
    },
    type: 'ParenthesizedExpression',
  },
  operator: {
    location: 21,
    operator: 'OR',
    type: 'Operator',
  },
  right: {
    expression: {
      location: 29,
      quoted: false,
      type: 'LiteralExpression',
      value: 'corge',
    },
    field: {
      location: 24,
      name: 'quuz',
      path: ['quuz'],
      quoted: false,
      type: 'Field',
    },
    type: 'TagExpression',
  },
  type: 'LogicalExpression',
});

test('[1 TO 2]', testQuery, {
  expression: {
    location: 0,
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
  type: 'TagExpression',
});

test('{1 TO 2]', testQuery, {
  expression: {
    location: 0,
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
  type: 'TagExpression',
});

test('[1 TO 2}', testQuery, {
  expression: {
    location: 0,
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
  type: 'TagExpression',
});

test('{1 TO 2}', testQuery, {
  expression: {
    location: 0,
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
  type: 'TagExpression',
});
