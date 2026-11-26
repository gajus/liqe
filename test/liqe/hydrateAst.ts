import { hydrateAst } from '../../src/hydrateAst';
import { type LiqeQuery } from '../../src/types';
import test from 'ava';

test('adds getValue when field is a safe path', (t) => {
  const parserAst = {
    field: {
      name: '.foo',
      type: 'Field',
    },
    type: 'Tag',
  } as LiqeQuery;

  const hydratedAst = hydrateAst(parserAst);

  t.true('getValue' in hydratedAst);
});

test('adds getValue when field is a safe path (recursive)', (t) => {
  const parserAst = {
    field: {
      type: 'ImplicitField',
    },
    left: {
      field: {
        type: 'ImplicitField',
      },
      right: {
        field: {
          type: 'ImplicitField',
        },
        operand: {
          field: {
            name: '.foo',
            type: 'Field',
          },
          type: 'Tag',
        },
      },
    },
  } as LiqeQuery;

  const hydratedAst = hydrateAst(parserAst);

  t.true('getValue' in (hydratedAst?.left?.right?.operand ?? {}));
});

test('does not add getValue if path is unsafe', (t) => {
  const parserAst = {
    field: {
      name: 'foo',
      type: 'Field',
    },
  } as LiqeQuery;

  const hydratedAst = hydrateAst(parserAst);

  t.false('getValue' in hydratedAst);
});

test('getValue accesses existing value', (t) => {
  const parserAst = {
    field: {
      name: '.foo',
      type: 'Field',
    },
    type: 'Tag',
  } as LiqeQuery;

  const hydratedAst = hydrateAst(parserAst);

  t.is(hydratedAst.getValue?.({ foo: 'bar' }), 'bar');
});

test('getValue accesses existing value (deep)', (t) => {
  const parserAst = {
    field: {
      name: '.foo.bar.baz',
      type: 'Field',
    },
    type: 'Tag',
  } as LiqeQuery;

  const hydratedAst = hydrateAst(parserAst);

  t.is(hydratedAst.getValue?.({ foo: { bar: { baz: 'qux' } } }), 'qux');
});

test('returns undefined if path does not resolve', (t) => {
  const parserAst = {
    field: {
      name: '.foo.bar.baz',
      type: 'Field',
    },
  } as LiqeQuery;

  const hydratedAst = hydrateAst(parserAst);

  t.is(hydratedAst.getValue?.({}), undefined);
});

test('hydrates inner tags inside parenthesized expression', (t) => {
  const parserAst = {
    expression: {
      expression: {
        field: {
          name: '.bar',
          type: 'Field',
        },
        type: 'Tag',
      },
      type: 'ParenthesizedExpression',
    },
    field: {
      name: '.foo',
      type: 'Field',
    },
    type: 'Tag',
  } as LiqeQuery;

  const hydratedAst = hydrateAst(parserAst);

  t.is(typeof hydratedAst.getValue, 'function');

  if (
    hydratedAst.type === 'Tag' &&
    hydratedAst.expression.type === 'ParenthesizedExpression'
  ) {
    const inner = hydratedAst.expression.expression as LiqeQuery;

    t.is(typeof inner.getValue, 'function');
  } else {
    t.fail('Expected Tag with ParenthesizedExpression.');
  }
});
