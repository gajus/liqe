import test from 'ava';
import {
  hydrateAst,
} from '../../src/hydrateAst';
import {
  isOptionalChainingSupported,
} from '../../src/isOptionalChainingSupported';
import type {
  HydratedAst,
} from '../../src/types';

if (isOptionalChainingSupported()) {
  test('adds getValue when field is a safe path', (t) => {
    const parserAst = {
      field: {
        name: '.foo',
      },
    } as HydratedAst;

    const hydratedAst = hydrateAst(parserAst);

    t.true('getValue' in hydratedAst);
  });

  test('adds getValue when field is a safe path (recursive)', (t) => {
    const parserAst = {
      field: {
        name: '<implicit>',
      },
      left: {
        field: {
          name: '<implicit>',
        },
        right: {
          field: {
            name: '<implicit>',
          },
          operand: {
            field: {
              name: '.foo',
            },
          },
        },
      },
    } as HydratedAst;

    const hydratedAst = hydrateAst(parserAst);

    t.true('getValue' in (hydratedAst?.left?.right?.operand ?? {}));
  });

  test('does not add getValue if path is unsafe', (t) => {
    const parserAst = {
      field: {
        name: 'foo',
      },
    } as HydratedAst;

    const hydratedAst = hydrateAst(parserAst);

    t.false('getValue' in hydratedAst);
  });

  test('getValue accesses existing value', (t) => {
    const parserAst = {
      field: {
        name: '.foo',
      },
    } as HydratedAst;

    const hydratedAst = hydrateAst(parserAst);

    t.is(hydratedAst.getValue?.({foo: 'bar'}), 'bar');
  });

  test('getValue accesses existing value (deep)', (t) => {
    const parserAst = {
      field: {
        name: '.foo.bar.baz',
      },
    } as HydratedAst;

    const hydratedAst = hydrateAst(parserAst);

    t.is(hydratedAst.getValue?.({foo: {bar: {baz: 'qux'}}}), 'qux');
  });

  test('returns undefined if path does not resolve', (t) => {
    const parserAst = {
      field: {
        name: '.foo.bar.baz',
      },
    } as HydratedAst;

    const hydratedAst = hydrateAst(parserAst);

    t.is(hydratedAst.getValue?.({}), undefined);
  });
}
