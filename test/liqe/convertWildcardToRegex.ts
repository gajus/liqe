import { convertWildcardToRegex } from '../../src/convertWildcardToRegex';
import test from 'ava';

const testRule = test.macro((t, regex: RegExp) => {
  t.deepEqual(convertWildcardToRegex(t.title), regex);
});

test('*', testRule, /(.+?)/);
test('?', testRule, /(.)/);
test('foo*bar', testRule, /foo(.+?)bar/);
test('foo***bar', testRule, /foo(.+?)bar/);
test('foo*bar*', testRule, /foo(.+?)bar(.+?)/);
test('foo?bar', testRule, /foo(.)bar/);
test('foo???bar', testRule, /foo(.)(.)(.)bar/);
