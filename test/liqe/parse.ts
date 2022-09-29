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

  t.like(ast, expectedAst);
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
  field: {
    name: '<implicit>',
  },
  query: 'foo',
  quoted: false,
});

test.skip('foo bar', testQuery, {
  left: {
    field: {
      name: '<implicit>',
    },
    query: 'foo',
    quoted: false,
  },
  operator: 'AND',
  right: {
    field: {
      name: '<implicit>',
    },
    query: 'bar',
    quoted: false,
  },
});

test('foo_bar', testQuery, {
  field: {
    name: '<implicit>',
  },
  query: 'foo_bar',
  quoted: false,
});

test('"foo"', testQuery, {
  field: {
    name: '<implicit>',
  },
  query: 'foo',
  quoted: true,
});

test('\'foo\'', testQuery, {
  field: {
    name: '<implicit>',
  },
  query: 'foo',
  quoted: true,
});

test('/foo/', testQuery, {
  field: {
    name: '<implicit>',
  },
  query: '/foo/',
  quoted: false,
  regex: true,
});

test('/foo/ui', testQuery, {
  field: {
    name: '<implicit>',
  },
  query: '/foo/ui',
  quoted: false,
  regex: true,
});

test('/\\s/', testQuery, {
  field: {
    name: '<implicit>',
  },
  query: '/\\s/',
  quoted: false,
  regex: true,
});

test('/[^.:@\\s](?:[^:@\\s]*[^.:@\\s])?@[^.@\\s]+(?:\\.[^.@\\s]+)*/', testQuery, {
  field: {
    name: '<implicit>',
  },
  query: '/[^.:@\\s](?:[^:@\\s]*[^.:@\\s])?@[^.@\\s]+(?:\\.[^.@\\s]+)*/',
  quoted: false,
  regex: true,
});

test('foo:bar', testQuery, {
  field: {
    name: 'foo',
  },
  query: 'bar',
});

test('foo:   bar', testQuery, {
  field: {
    name: 'foo',
  },
  query: 'bar',
});

test('foo:123', testQuery, {
  field: {
    name: 'foo',
  },
  query: '123',
});

test('foo:=123', testQuery, {
  field: {
    name: 'foo',
  },
  query: 123,
  relationalOperator: '=',
});

test('foo:=   123', testQuery, {
  field: {
    name: 'foo',
  },
  query: 123,
  relationalOperator: '=',
});

test('foo:=-123', testQuery, {
  field: {
    name: 'foo',
  },
  query: -123,
});

test('foo:=123.4', testQuery, {
  field: {
    name: 'foo',
  },
  query: 123.4,
});

test('foo:>=123', testQuery, {
  field: {
    name: 'foo',
  },
  query: 123,
  relationalOperator: '>=',
});

test('foo:true', testQuery, {
  field: {
    name: 'foo',
  },
  query: true,
});

test('foo:false', testQuery, {
  field: {
    name: 'foo',
  },
  query: false,
});

test('foo:null', testQuery, {
  field: {
    name: 'foo',
  },
  query: null,
});

test('foo.bar:baz', testQuery, {
  field: {
    name: 'foo.bar',
    path: [
      'foo',
      'bar',
    ],
  },
  query: 'baz',
});

test('foo_bar:baz', testQuery, {
  field: {
    name: 'foo_bar',
  },
  query: 'baz',
});

test('$foo:baz', testQuery, {
  field: {
    name: '$foo',
  },
  query: 'baz',
});

test('"foo bar":baz', testQuery, {
  field: {
    name: 'foo bar',
  },
  query: 'baz',
});

test('\'foo bar\':baz', testQuery, {
  field: {
    name: 'foo bar',
  },
  query: 'baz',
});

test('foo:"bar"', testQuery, {
  field: {
    name: 'foo',
  },
  query: 'bar',
  quoted: true,
});

test('foo:\'bar\'', testQuery, {
  field: {
    name: 'foo',
  },
  query: 'bar',
  quoted: true,
});

test.skip('foo:bar baz:qux', testQuery, {
  left: {
    field: {
      name: 'foo',
    },
    query: 'bar',
  },
  operator: 'AND',
  right: {
    field: {
      name: 'baz',
    },
    query: 'qux',
  },
});

test('foo:bar AND baz:qux', testQuery, {
  left: {
    field: {
      name: 'foo',
    },
    query: 'bar',
  },
  operator: 'AND',
  right: {
    field: {
      name: 'baz',
    },
    query: 'qux',
  },
});

test('(foo:bar) AND (baz:qux)', testQuery, {
  left: {
    field: {
      name: 'foo',
    },
    query: 'bar',
  },
  operator: 'AND',
  right: {
    field: {
      name: 'baz',
    },
    query: 'qux',
  },
});

test('(foo:bar AND baz:qux)', testQuery, {
  left: {
    field: {
      name: 'foo',
    },
    query: 'bar',
  },
  operator: 'AND',
  right: {
    field: {
      name: 'baz',
    },
    query: 'qux',
  },
});

test.skip('NOT (foo:bar AND baz:qux)', testQuery, {
  operand: {
    left: {
      field: {
        name: 'foo',
      },
      query: 'bar',
    },
    operator: 'AND',
    right: {
      field: {
        name: 'baz',
      },
      query: 'qux',
    },
  },
  operator: 'NOT',
});

test('NOT foo:bar', testQuery, {
  operand: {
    field: {
      name: 'foo',
    },
    query: 'bar',
    quoted: false,
  },
  operator: 'NOT',
});

test('foo:bar AND NOT baz:qux', testQuery, {
  left: {
    field: {
      name: 'foo',
    },
    query: 'bar',
  },
  operator: 'AND',
  right: {
    operand: {
      field: {
        name: 'baz',
      },
      query: 'qux',
    },
    operator: 'NOT',
  },
});

test('foo:bar AND baz:qux AND quuz:corge', testQuery, {
  left: {
    left: {
      field: {
        name: 'foo',
      },
      query: 'bar',
    },
    operator: 'AND',
    right: {
      field: {
        name: 'baz',
      },
      query: 'qux',
    },
  },
  operator: 'AND',
  right: {
    field: {
      name: 'quuz',
    },
    query: 'corge',
  },
});

test('(foo:bar)', testQuery, {
  field: {
    name: 'foo',
  },
  query: 'bar',
  quoted: false,
});

test('((foo:bar))', testQuery, {
  field: {
    name: 'foo',
  },
  query: 'bar',
  quoted: false,
});

test('( foo:bar )', testQuery, {
  field: {
    name: 'foo',
  },
  query: 'bar',
  quoted: false,
});

test('(foo:bar OR baz:qux)', testQuery, {
  left: {
    field: {
      name: 'foo',
    },
    query: 'bar',
    quoted: false,
  },
  operator: 'OR',
  right: {
    field: {
      name: 'baz',
    },
    query: 'qux',
    quoted: false,
  },
});

test('foo:bar OR (baz:qux OR quuz:corge)', testQuery, {
  left: {
    field: {
      name: 'foo',
    },
    query: 'bar',
    quoted: false,
  },
  operator: 'OR',
  right: {
    left: {
      field: {
        name: 'baz',
      },
      query: 'qux',
      quoted: false,
    },
    operator: 'OR',
    right: {
      field: {
        name: 'quuz',
      },
      query: 'corge',
      quoted: false,
    },
  },
});

test('(foo:bar OR baz:qux) OR quuz:corge', testQuery, {
  left: {
    left: {
      field: {
        name: 'foo',
      },
      query: 'bar',
      quoted: false,
    },
    operator: 'OR',
    right: {
      field: {
        name: 'baz',
      },
      query: 'qux',
      quoted: false,
    },
  },
  operator: 'OR',
  right: {
    field: {
      name: 'quuz',
    },
    query: 'corge',
    quoted: false,
  },
});

test('[1 TO 2]', testQuery, {
  range: {
    max: 2,
    maxInclusive: true,
    min: 1,
    minInclusive: true,
  },
});

test('{1 TO 2]', testQuery, {
  range: {
    max: 2,
    maxInclusive: true,
    min: 1,
    minInclusive: false,
  },
});

test('[1 TO 2}', testQuery, {
  range: {
    max: 2,
    maxInclusive: false,
    min: 1,
    minInclusive: true,
  },
});

test('{1 TO 2}', testQuery, {
  range: {
    max: 2,
    maxInclusive: false,
    min: 1,
    minInclusive: false,
  },
});
