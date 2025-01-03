import { isSafeUnquotedExpression } from '../../src/isSafeUnquotedExpression';
import test from 'ava';

const testExpression = (t, expected) => {
  t.is(isSafeUnquotedExpression(t.title), expected);
};

test('foo', testExpression, true);

test('.foo', testExpression, false);
