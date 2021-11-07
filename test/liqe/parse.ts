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
  quoted: false,
  term: 'foo',
});

test('"foo"', testQuery, {
  field: '<implicit>',
  quoted: true,
  term: 'foo',
});

test('\'foo\'', testQuery, {
  field: '<implicit>',
  quoted: true,
  term: 'foo',
});

test('/foo/', testQuery, {
  field: '<implicit>',
  quoted: false,
  regex: true,
  term: '/foo/',
});

test('/foo/ui', testQuery, {
  field: '<implicit>',
  quoted: false,
  regex: true,
  term: '/foo/ui',
});

test('foo:bar', testQuery, {
  field: 'foo',
  term: 'bar',
});

test('foo:123', testQuery, {
  field: 'foo',
  relationalOperator: '=',
  term: 123,
});

test('foo:-123', testQuery, {
  field: 'foo',
  term: -123,
});

test('foo:123.4', testQuery, {
  field: 'foo',
  term: 123.4,
});

test('foo:>=123', testQuery, {
  field: 'foo',
  relationalOperator: '>=',
  term: 123,
});

test('foo:true', testQuery, {
  field: 'foo',
  term: true,
});

test('foo:false', testQuery, {
  field: 'foo',
  term: false,
});

test('foo:null', testQuery, {
  field: 'foo',
  term: null,
});

test('foo.bar:baz', testQuery, {
  field: 'foo.bar',
  term: 'baz',
});

test('foo:"bar"', testQuery, {
  field: 'foo',
  quoted: true,
  term: 'bar',
});

test('foo:\'bar\'', testQuery, {
  field: 'foo',
  quoted: true,
  term: 'bar',
});

test('foo:bar AND baz:qux', testQuery, {
  left: {
    field: 'foo',
    term: 'bar',
  },
  operator: 'AND',
  right: {
    field: 'baz',
    term: 'qux',
  },
});

test('foo:bar AND NOT baz:qux', testQuery, {
  left: {
    field: 'foo',
    term: 'bar',
  },
  operator: 'AND',
  right: {
    operand: {
      field: 'baz',
      term: 'qux',
    },
    operator: 'NOT',
  },
});

test('foo:bar AND baz:qux AND quuz:corge', testQuery, {
  left: {
    left: {
      field: 'foo',
      term: 'bar',
    },
    operator: 'AND',
    right: {
      field: 'baz',
      term: 'qux',
    },
  },
  operator: 'AND',
  right: {
    field: 'quuz',
    term: 'corge',
  },
});

test('(foo:bar)', testQuery, {
  field: 'foo',
  quoted: false,
  term: 'bar',
});

test('(foo:bar OR baz:qux)', testQuery, {
  left: {
    field: 'foo',
    quoted: false,
    term: 'bar',
  },
  operator: 'OR',
  right: {
    field: 'baz',
    quoted: false,
    term: 'qux',
  },
});

test('foo:bar OR (baz:qux OR quuz:corge)', testQuery, {
  left: {
    field: 'foo',
    quoted: false,
    term: 'bar',
  },
  operator: 'OR',
  right: {
    left: {
      field: 'baz',
      quoted: false,
      term: 'qux',
    },
    operator: 'OR',
    right: {
      field: 'quuz',
      quoted: false,
      term: 'corge',
    },
  },
});

test('(foo:bar OR baz:qux) OR quuz:corge', testQuery, {
  left: {
    left: {
      field: 'foo',
      quoted: false,
      term: 'bar',
    },
    operator: 'OR',
    right: {
      field: 'baz',
      quoted: false,
      term: 'qux',
    },
  },
  operator: 'OR',
  right: {
    field: 'quuz',
    quoted: false,
    term: 'corge',
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
