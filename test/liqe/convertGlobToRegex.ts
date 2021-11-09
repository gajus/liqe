import test from 'ava';
import {
  convertGlobToRegex,
} from '../../src/convertGlobToRegex';

const testRule = test.macro((t, regex: RegExp) => {
  t.deepEqual(convertGlobToRegex(t.title), regex);
});

test('*', testRule, /(.+?)/);
test('foo*bar', testRule, /foo(.+?)bar/);
test('foo***bar', testRule, /foo(.+?)bar/);
