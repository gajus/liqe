# liqe

[![Travis build status](http://img.shields.io/travis/gajus/liqe/main.svg?style=flat-square)](https://app.travis-ci.com/github/gajus/liqe)
[![Coveralls](https://img.shields.io/coveralls/gajus/liqe.svg?style=flat-square)](https://coveralls.io/github/gajus/liqe)
[![NPM version](http://img.shields.io/npm/v/liqe.svg?style=flat-square)](https://www.npmjs.org/package/liqe)
[![Canonical Code Style](https://img.shields.io/badge/code%20style-canonical-blue.svg?style=flat-square)](https://github.com/gajus/canonical)
[![Twitter Follow](https://img.shields.io/twitter/follow/kuizinas.svg?style=social&label=Follow)](https://twitter.com/kuizinas)

Lightweight and performant Lucene-like parser and search engine.

* [Usage](#usage)
* [Query Syntax](#query-syntax)
  * [Keyword matching](#keyword-matching)
  * [Range matching](#range-matching)
  * [Wildcard matching](#wildcard-matching)
* [Compatibility with Lucene](#compatibility-with-lucene)
* [Development](#development)

## Usage

```ts
import {
  filter,
  highlight,
  parse,
  test,
} from 'liqe';

const persons = [
  {
    height: 180,
    name: 'John Morton',
  },
  {
    height: 175,
    name: 'David Barker',
  },
  {
    height: 170,
    name: 'Thomas Castro',
  },
];
```

Filter a collection:

```ts
filter(parse('height:>170'), persons);
// [
//   {
//     height: 180,
//     name: 'John Morton',
//   },
//   {
//     height: 175,
//     name: 'David Barker',
//   },
// ]
```

Test a single object:

```ts
test(parse('name:John'), persons[0]);
// true
test(parse('name:David'), persons[0]);
// false
```

Highlight matching fields and substrings:

```ts
test(highlight('name:John'), persons[0]);
// [
//   {
//     keyword: 'John',
//     path: 'name',
//   }
// ]
```

## Query Syntax

### Keyword matching

Search for word "foo" in any field.

```
foo
```

Search for word "foo" in the `title` field.

```
title:foo
```

Search for phrase "foo bar" in the `title` field.

```
title:"foo bar"
```

Search for phrase "foo bar" in the `title` field AND the phrase "quick fox" in the `body` field.

```
title:"foo bar" AND body:"quick fox"
```

Search for either the phrase "foo bar" in the `title` field AND the phrase "quick fox" in the `body` field, or the word "fox" in the `title` field.

```
(title:"foo bar" AND body:"quick fox") OR title:fox
```

### Range matching

Search for value greater or equal to 100 and lower or equal to 200 in the `height` field.

```
height:[100 TO 200]
```

Search for value greater than 100 and lower than 200 in the `height` field.

```
height:{100 TO 200}
```

Search for value greater than 100 in the `height` field.

```
height:>100
```

Search for value greater than or equal to 100 in the `height` field.

```
height:>=100
```

### Wildcard matching

Search for any word that starts with "foo" in the `title` field.

```
title:foo*
```

Search for any word that starts with "foo" and ends with bar in the `title` field.

```
title:foo*bar
```

## Compatibility with Lucene

The following Lucene abilities are not supported:

* [Fuzzy Searches](https://lucene.apache.org/core/2_9_4/queryparsersyntax.html#Fuzzy%20Searches)
* [Proximity Searches](https://lucene.apache.org/core/2_9_4/queryparsersyntax.html#Proximity%20Searches)
* [Boosting a Term](https://lucene.apache.org/core/2_9_4/queryparsersyntax.html#Boosting%20a%20Term)

## Development

### Compiling Parser

If you are going to modify parser, then use `npm run watch` to run compiler in watch mode.

### Benchmarking Changes

Before making any changes, capture the current benchmark on your machine using `npm run benchmark`. Run benchmark again after making any changes. Before committing changes, ensure that performance is not negatively impacted.