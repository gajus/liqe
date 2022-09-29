import test from 'ava';
import {
  parse,
} from '../../src/parse';
import {
  serialize,
} from '../../src/serialize';

const testQuery = (t) => {
  t.is(serialize(parse(t.title)), t.title);
};

test('foo', testQuery);

test('foo bar', testQuery);

test('foo_bar', testQuery);

test('"foo"', testQuery);

test('\'foo\'', testQuery);

test('/foo/', testQuery);

test('/foo/ui', testQuery);

test('/\\s/', testQuery);

test('/[^.:@\\s](?:[^:@\\s]*[^.:@\\s])?@[^.@\\s]+(?:\\.[^.@\\s]+)*/', testQuery);

test('foo:bar', testQuery);

test.skip('foo: bar', testQuery);

test('foo:123', testQuery);

test('foo:=123', testQuery);

test.skip('foo:= 123', testQuery);

test('foo:=-123', testQuery);

test('foo:=123.4', testQuery);

test('foo:>=123', testQuery);

test('foo:true', testQuery);

test('foo:false', testQuery);

test('foo:null', testQuery);

test('foo.bar:baz', testQuery);

test('foo_bar:baz', testQuery);

test('$foo:baz', testQuery);

test('"foo bar":baz', testQuery);

test('\'foo bar\':baz', testQuery);

test('foo:"bar"', testQuery);

test('foo:\'bar\'', testQuery);

test('foo:bar baz:qux', testQuery);

test('foo:bar AND baz:qux', testQuery);

test('(foo:bar AND baz:qux)', testQuery);

test('(foo:bar) AND (baz:qux)', testQuery);

test.skip('NOT (foo:bar AND baz:qux)', testQuery);

test('NOT foo:bar', testQuery);

test.skip('NOT (foo:bar)', testQuery);

test('(foo:bar AND NOT baz:qux)', testQuery);

test('foo:bar AND baz:qux AND quuz:corge', testQuery);

test('((foo:bar AND baz:qux) AND quuz:corge)', testQuery);

test('(foo:bar)', testQuery);

test('((foo:bar))', testQuery);

test.skip('( foo:bar )', testQuery);

test('(foo:bar OR baz:qux)', testQuery);

test('(foo:bar OR (baz:qux OR quuz:corge))', testQuery);

test('((foo:bar OR baz:qux) OR quuz:corge)', testQuery);

test('[1 TO 2]', testQuery);

test('{1 TO 2]', testQuery);

test('[1 TO 2}', testQuery);

test('{1 TO 2}', testQuery);