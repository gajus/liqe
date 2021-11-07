import test from 'ava';
import {
  parse,
} from '../../src/parse';

const testQuery = (t, expectedAst) => {
  const ast = parse(t.title);

  t.like(ast, expectedAst);
};

test('foo', testQuery, {
  field: '<implicit>',
  query: 'foo',
  quoted: false,
});

test('foo_bar', testQuery, {
  field: '<implicit>',
  query: 'foo_bar',
  quoted: false,
});

test('"foo"', testQuery, {
  field: '<implicit>',
  query: 'foo',
  quoted: true,
});

test('\'foo\'', testQuery, {
  field: '<implicit>',
  query: 'foo',
  quoted: true,
});

test('/foo/', testQuery, {
  field: '<implicit>',
  query: '/foo/',
  quoted: false,
  regex: true,
});

test('/foo/ui', testQuery, {
  field: '<implicit>',
  query: '/foo/ui',
  quoted: false,
  regex: true,
});

test('foo:bar', testQuery, {
  field: 'foo',
  query: 'bar',
});

test('foo:   bar', testQuery, {
  field: 'foo',
  query: 'bar',
});

test('foo:123', testQuery, {
  field: 'foo',
  query: 123,
  relationalOperator: '=',
});

test('foo:-123', testQuery, {
  field: 'foo',
  query: -123,
});

test('foo:123.4', testQuery, {
  field: 'foo',
  query: 123.4,
});

test('foo:>=123', testQuery, {
  field: 'foo',
  query: 123,
  relationalOperator: '>=',
});

test('foo:true', testQuery, {
  field: 'foo',
  query: true,
});

test('foo:false', testQuery, {
  field: 'foo',
  query: false,
});

test('foo:null', testQuery, {
  field: 'foo',
  query: null,
});

test('foo.bar:baz', testQuery, {
  field: 'foo.bar',
  query: 'baz',
});

test('foo_bar:baz', testQuery, {
  field: 'foo_bar',
  query: 'baz',
});

test('$foo:baz', testQuery, {
  field: '$foo',
  query: 'baz',
});

test('foo:"bar"', testQuery, {
  field: 'foo',
  query: 'bar',
  quoted: true,
});

test('foo:\'bar\'', testQuery, {
  field: 'foo',
  query: 'bar',
  quoted: true,
});

test('foo:bar AND baz:qux', testQuery, {
  left: {
    field: 'foo',
    query: 'bar',
  },
  operator: 'AND',
  right: {
    field: 'baz',
    query: 'qux',
  },
});

test('foo:bar AND NOT baz:qux', testQuery, {
  left: {
    field: 'foo',
    query: 'bar',
  },
  operator: 'AND',
  right: {
    operand: {
      field: 'baz',
      query: 'qux',
    },
    operator: 'NOT',
  },
});

test('foo:bar AND baz:qux AND quuz:corge', testQuery, {
  left: {
    left: {
      field: 'foo',
      query: 'bar',
    },
    operator: 'AND',
    right: {
      field: 'baz',
      query: 'qux',
    },
  },
  operator: 'AND',
  right: {
    field: 'quuz',
    query: 'corge',
  },
});

test('(foo:bar)', testQuery, {
  field: 'foo',
  query: 'bar',
  quoted: false,
});

test('( foo:bar )', testQuery, {
  field: 'foo',
  query: 'bar',
  quoted: false,
});

test('(foo:bar OR baz:qux)', testQuery, {
  left: {
    field: 'foo',
    query: 'bar',
    quoted: false,
  },
  operator: 'OR',
  right: {
    field: 'baz',
    query: 'qux',
    quoted: false,
  },
});

test('foo:bar OR (baz:qux OR quuz:corge)', testQuery, {
  left: {
    field: 'foo',
    query: 'bar',
    quoted: false,
  },
  operator: 'OR',
  right: {
    left: {
      field: 'baz',
      query: 'qux',
      quoted: false,
    },
    operator: 'OR',
    right: {
      field: 'quuz',
      query: 'corge',
      quoted: false,
    },
  },
});

test('(foo:bar OR baz:qux) OR quuz:corge', testQuery, {
  left: {
    left: {
      field: 'foo',
      query: 'bar',
      quoted: false,
    },
    operator: 'OR',
    right: {
      field: 'baz',
      query: 'qux',
      quoted: false,
    },
  },
  operator: 'OR',
  right: {
    field: 'quuz',
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
