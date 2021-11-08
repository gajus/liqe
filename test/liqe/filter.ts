import test from 'ava';
import {
  filter,
} from '../../src/filter';
import {
  parse,
} from '../../src/parse';

type Location = {
  city: string,
};

type Person = {
  height: number,
  location?: Location,
  name: string,
  nick?: string,
  tags?: string[],
};

const persons: readonly Person[] = [
  {
    height: 180,
    name: 'david',
  },
  {
    height: 175,
    name: 'john',
  },
  {
    height: 175,
    location: {
      city: 'London',
    },
    name: 'mike',
  },
  {
    height: 220,
    name: 'robert',
    tags: [
      'member',
    ],
  },
  {
    height: 225,
    name: 'noah',
    nick: 'john',
  },
];

const testQuery = test.macro((t, expectedResultNames: string[]) => {
  const matchingPersonNames = filter(parse(t.title), persons).map((person) => {
    return person.name;
  });

  t.deepEqual(matchingPersonNames, expectedResultNames);
});

test('"david"', testQuery, ['david']);

test('name:"da"', testQuery, ['david']);
test('name:"david"', testQuery, ['david']);
test('name:David', testQuery, ['david']);
test('name:D*d', testQuery, ['david']);
test('name:*avid', testQuery, ['david']);
test('name:/(david)|(john)/', testQuery, ['david', 'john']);
test('name:/(David)|(John)/', testQuery, []);
test('name:/(David)|(John)/i', testQuery, ['david', 'john']);

test('height:[200 TO 300]', testQuery, ['robert', 'noah']);
test('height:[220 TO 300]', testQuery, ['robert', 'noah']);
test('height:{220 TO 300]', testQuery, ['noah']);
test('height:[200 TO 225]', testQuery, ['robert', 'noah']);
test('height:[200 TO 225}', testQuery, ['robert']);
test('height:{220 TO 225}', testQuery, []);

test('NOT David', testQuery, ['john', 'mike', 'robert', 'noah']);
test('David OR John', testQuery, ['david', 'john', 'noah']);
test('Noah AND John', testQuery, ['noah']);
test('John AND NOT Noah', testQuery, ['john']);
test('David OR NOT John', testQuery, ['david', 'mike', 'robert']);

test('name:David OR John', testQuery, ['david', 'john', 'noah']);

test('name:David OR name:John', testQuery, ['david', 'john']);
test('name:"david" OR name:"john"', testQuery, ['david', 'john']);
test('name:"David" OR name:"John"', testQuery, []);

test('height:175', testQuery, ['john', 'mike']);
test('height:>200', testQuery, ['robert', 'noah']);
test('height:>220', testQuery, ['noah']);
test('height:>=220', testQuery, ['robert', 'noah']);

test('height:175 AND NOT name:mike', testQuery, ['john']);

test('"member"', testQuery, ['robert']);
test('tags:"member"', testQuery, ['robert']);

test('"London"', testQuery, ['mike']);
test('location.city:"London"', testQuery, ['mike']);
