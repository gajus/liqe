import test from 'ava';
import {
  highlight,
} from '../../src/highlight';
import {
  parse,
} from '../../src/parse';
import type {
  Highlight,
} from '../../src/types';

const testQuery = test.macro(<T extends Object>(t, query: string, subject: T, highlights: Highlight[]) => {
  t.deepEqual(highlight(parse(query), subject), highlights);
});

test(
  'matches any property',
  testQuery,
  'foo',
  {
    email: 'foo@bar.com',
    name: 'foo bar',
  },
  [
    {
      keyword: 'foo',
      path: 'email',
    },
    {
      keyword: 'foo',
      path: 'name',
    },
  ],
);

test(
  'matches property',
  testQuery,
  'name:foo',
  {
    name: 'foo bar',
  },
  [
    {
      keyword: 'foo',
      path: 'name',
    },
  ],
);

test(
  'matches property (correctly handles case mismatch)',
  testQuery,
  'name:foo',
  {
    name: 'Foo Bar',
  },
  [
    {
      keyword: 'Foo',
      path: 'name',
    },
  ],
);

test(
  'matches or',
  testQuery,
  'name:foo OR name:bar OR height:180',
  {
    height: 180,
    name: 'bar',
  },
  [
    {
      keyword: 'bar',
      path: 'name',
    },
    {
      path: 'height',
    },
  ],
);

test(
  'matches glob',
  testQuery,
  'name:f*o',
  {
    name: 'foo bar baz',
  },
  [
    {
      keyword: 'foo',
      path: 'name',
    },
  ],
);

test(
  'matches glob (lazy)',
  testQuery,
  'name:f*o',
  {
    name: 'foo bar o baz',
  },
  [
    {
      keyword: 'foo',
      path: 'name',
    },
  ],
);

test(
  'matches regex',
  testQuery,
  'name:/foo/',
  {
    name: 'foo bar baz',
  },
  [
    {
      keyword: 'foo',
      path: 'name',
    },
  ],
);

test.skip(
  'matches regex (multiple)',
  testQuery,
  'name:/(foo|bar)/g',
  {
    name: 'foo bar baz',
  },
  [
    {
      keyword: 'foo',
      path: 'name',
    },
    {
      keyword: 'bar',
      path: 'name',
    },
  ],
);

test(
  'matches number',
  testQuery,
  'height:180',
  {
    height: 180,
  },
  [
    {
      path: 'height',
    },
  ],
);

test(
  'matches range',
  testQuery,
  'height:[100 TO 200]',
  {
    height: 180,
  },
  [
    {
      path: 'height',
    },
  ],
);

test(
  'matches boolean',
  testQuery,
  'member:false',
  {
    member: false,
  },
  [
    {
      path: 'member',
    },
  ],
);

test(
  'matches array member',
  testQuery,
  'tags:bar',
  {
    tags: [
      'foo',
      'bar',
      'baz qux',
    ],
  },
  [
    {
      keyword: 'bar',
      path: 'tags.1',
    },
  ],
);

test(
  'matches multiple array members',
  testQuery,
  'tags:ba',
  {
    tags: [
      'foo',
      'bar',
      'baz qux',
    ],
  },
  [
    {
      keyword: 'ba',
      path: 'tags.1',
    },
    {
      keyword: 'ba',
      path: 'tags.2',
    },
  ],
);

test.skip(
  'does not include highlights from non-matching branches',
  testQuery,
  'name:foo AND NOT name:foo',
  {
    name: 'foo',
  },
  [],
);
