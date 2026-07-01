import { filter } from '../../src/filter';
import { parse } from '../../src/parse';
import test from 'ava';

type Location = {
  city: string;
};

type Person = {
  attributes?: Record<string, null | string>;
  balance?: number;
  email?: string;
  height: number;
  location?: Location;
  membership?: null;
  name: string;
  nick?: string;
  phoneNumber?: string;
  subscribed?: boolean;
  tags?: string[];
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
    tags: ['member'],
  },
  {
    attributes: {
      member: null,
    },
    balance: 6_364_917,
    email: 'noah@john.com',
    height: 225,
    membership: null,
    name: 'noah',
    nick: 'john',
    phoneNumber: '404-050-2611',
    subscribed: true,
  },
  {
    height: 150,
    name: 'foo bar',
    nick: 'old dog',
  },
  {
    height: 194,
    name: 'fox',
    nick: 'quick fox',
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
test('name:a*d', testQuery, ['david']);
test('name:/(david)|(john)/', testQuery, ['david', 'john']);
test('name:/(David)|(John)/', testQuery, []);
test('name:/(David)|(John)/i', testQuery, ['david', 'john']);

test('height:[200 TO 300]', testQuery, ['robert', 'noah']);
test('height:[220 TO 300]', testQuery, ['robert', 'noah']);
test('height:{220 TO 300]', testQuery, ['noah']);
test('height:[200 TO 225]', testQuery, ['robert', 'noah']);
test('height:[200 TO 225}', testQuery, ['robert']);
test('height:{220 TO 225}', testQuery, []);

test('NOT David', testQuery, [
  'john',
  'mike',
  'robert',
  'noah',
  'foo bar',
  'fox',
]);
test('-David', testQuery, ['john', 'mike', 'robert', 'noah', 'foo bar', 'fox']);
test('David OR John', testQuery, ['david', 'john', 'noah']);
test('Noah AND John', testQuery, ['noah']);
test('John AND NOT Noah', testQuery, ['john']);
test('David OR NOT John', testQuery, [
  'david',
  'mike',
  'robert',
  'foo bar',
  'fox',
]);
test('John AND -Noah', testQuery, ['john']);
test('David OR -John', testQuery, [
  'david',
  'mike',
  'robert',
  'foo bar',
  'fox',
]);

test('name:David OR John', testQuery, ['david', 'john', 'noah']);

test('name:David OR name:John', testQuery, ['david', 'john']);
test('name:"david" OR name:"john"', testQuery, ['david', 'john']);
test('name:"David" OR name:"John"', testQuery, []);

test('height:=175', testQuery, ['john', 'mike']);
test('height:>200', testQuery, ['robert', 'noah']);
test('height:>220', testQuery, ['noah']);
test('height:>=220', testQuery, ['robert', 'noah']);

test('height:=175 AND NOT name:mike', testQuery, ['john']);

test('"member"', testQuery, ['robert']);

test('tags:"member"', testQuery, ['robert']);

test('"London"', testQuery, ['mike']);
test('city:"London"', testQuery, []);
test('location.city:"London"', testQuery, ['mike']);

test('membership:null', testQuery, ['noah']);
test('attributes.member:null', testQuery, ['noah']);

test('subscribed:true', testQuery, ['noah']);

test(
  'email:/[^.:@\\s](?:[^:@\\s]*[^.:@\\s])?@[^.@\\s]+(?:\\.[^.@\\s]+)*/',
  testQuery,
  ['noah'],
);

test('phoneNumber:"404-050-2611"', testQuery, ['noah']);
test('phoneNumber:404', testQuery, ['noah']);

test('balance:364', testQuery, ['noah']);

test('(David)', testQuery, ['david']);
test('(name:david OR name:john)', testQuery, ['david', 'john']);
test('(name:"foo bar" AND nick:"quick fox") OR name:fox', testQuery, ['fox']);
test('(name:fox OR name:"foo bar" AND nick:"old dog")', testQuery, ['foo bar']);
test('(name:fox OR (name:"foo bar" AND nick:"old dog"))', testQuery, [
  'fox',
  'foo bar',
]);

// String ranges make ISO 8601 date/datetime and 24-hour time filtering work,
// because for these canonical forms lexical order == chronological order.
// https://github.com/gajus/liqe/issues/3
type Event = {
  date: string;
  id: string;
  startTime: string;
  timestamp: string;
};

const events: readonly Event[] = [
  {
    date: '2019-06-15',
    id: 'a',
    startTime: '08:30',
    timestamp: '2019-06-15T08:30:00.000Z',
  },
  {
    date: '2020-03-15',
    id: 'b',
    startTime: '09:00',
    timestamp: '2020-03-15T09:00:00.000Z',
  },
  {
    date: '2020-11-30',
    id: 'c',
    startTime: '14:15',
    timestamp: '2020-11-30T14:15:00.000Z',
  },
  {
    date: '2021-12-25',
    id: 'd',
    startTime: '17:45',
    timestamp: '2021-12-25T17:45:00.000Z',
  },
];

const testEvents = test.macro((t, expectedIds: string[]) => {
  const matchingIds = filter(parse(t.title), events).map((event) => {
    return event.id;
  });

  t.deepEqual(matchingIds, expectedIds);
});

// Date-only (YYYY-MM-DD).
test('date:["2020-01-01" TO "2020-12-31"]', testEvents, ['b', 'c']);
test('date:{"2019-06-15" TO "2021-12-25"}', testEvents, ['b', 'c']);
test('date:["2020-03-15" TO "2020-11-30"}', testEvents, ['b']);
test('date:{"2019-06-15" TO "2020-11-30"]', testEvents, ['b', 'c']);

// Full ISO 8601 datetime (single-timezone, fixed-precision).
test(
  'timestamp:["2020-01-01T00:00:00.000Z" TO "2021-01-01T00:00:00.000Z"]',
  testEvents,
  ['b', 'c'],
);

// 24-hour zero-padded time (HH:mm).
test('startTime:["09:00" TO "17:00"]', testEvents, ['b', 'c']);
test('startTime:{"09:00" TO "17:00"}', testEvents, ['c']);

// UTC date-times without milliseconds are accepted too, as long as both
// boundaries share the same shape.
test('accepts second-precision UTC date-time ranges', (t) => {
  const rows = [
    { id: 'x', ts: '2020-06-01T12:00:00Z' },
    { id: 'y', ts: '2022-06-01T12:00:00Z' },
  ];

  const matchingIds = filter(
    parse('ts:["2020-01-01T00:00:00Z" TO "2021-01-01T00:00:00Z"]'),
    rows,
  ).map((row) => {
    return row.id;
  });

  t.deepEqual(matchingIds, ['x']);
});

// Ranges whose boundaries are not a supported, consistent date/time format
// throw a TypeError rather than returning a silently-wrong lexical result.
const unsupportedRangeQueries = [
  // Free-text boundaries are not a date/time format.
  'name:["a" TO "e"]',
  // Lowercase "z" is not valid ISO 8601 (UTC must be uppercase "Z").
  'timestamp:["2020-01-01T00:00:00.000z" TO "2021-01-01T00:00:00.000z"]',
  // Mismatched millisecond precision between the two boundaries.
  'timestamp:["2020-01-01T00:00:00.00Z" TO "2021-01-01T00:00:00.000Z"]',
  // Timezone offsets break lexical ordering and are rejected.
  'timestamp:["2020-01-01T00:00:00.000+05:00" TO "2021-01-01T00:00:00.000+05:00"]',
  // Mismatched boundary types (number vs string).
  'date:[1 TO "2020-12-31"]',
  // Mismatched categories (date vs time).
  'date:["2020-01-01" TO "17:00"]',
];

for (const query of unsupportedRangeQueries) {
  test(`throws TypeError for unsupported range: ${query}`, (t) => {
    t.throws(
      () => {
        return filter(parse(query), events);
      },
      { instanceOf: TypeError },
    );
  });
}
