import test from 'ava';
import {
  hydrateAst,
} from '../../src/hydrateAst';
import {
  isOptionalChainingSupported,
} from '../../src/isOptionalChainingSupported';

if (isOptionalChainingSupported()) {
  test('adds getValue when field is a safe path', (t) => {
    const parserAst = {
      field: '.foo',
    };

    const hydratedAst = hydrateAst(parserAst);

    t.true('getValue' in hydratedAst);
  });

  test('adds getValue when field is a safe path (recursive)', (t) => {
    const parserAst = {
      field: '<implicit>',
      left: {
        field: '<implicit>',
        right: {
          field: '<implicit>',
          operand: {
            field: '.foo',
          },
        },
      },
    };

    const hydratedAst = hydrateAst(parserAst);

    t.true('getValue' in hydratedAst!.left!.right!.operand!);
  });

  test('does not add getValue if path is unsafe', (t) => {
    const parserAst = {
      field: 'foo',
    };

    const hydratedAst = hydrateAst(parserAst);

    t.false('getValue' in hydratedAst);
  });

  test('getValue accesses existing value', (t) => {
    const parserAst = {
      field: '.foo',
    };

    const hydratedAst = hydrateAst(parserAst);

    t.is(hydratedAst.getValue?.({foo: 'bar'}), 'bar');
  });

  test('getValue accesses existing value (deep)', (t) => {
    const parserAst = {
      field: '.foo.bar.baz',
    };

    const hydratedAst = hydrateAst(parserAst);

    t.is(hydratedAst.getValue?.({foo: {bar: {baz: 'qux'}}}), 'qux');
  });

  test('returns undefined if path does not resolve', (t) => {
    const parserAst = {
      field: '.foo.bar.baz',
    };

    const hydratedAst = hydrateAst(parserAst);

    t.is(hydratedAst.getValue?.({}), undefined);
  });
}
