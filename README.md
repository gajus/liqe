# liqe

[![Travis build status](http://img.shields.io/travis/gajus/liqe/main.svg?style=flat-square)](https://app.travis-ci.com/github/gajus/liqe)
[![Coveralls](https://img.shields.io/coveralls/gajus/liqe.svg?style=flat-square)](https://coveralls.io/github/gajus/liqe)
[![NPM version](http://img.shields.io/npm/v/liqe.svg?style=flat-square)](https://www.npmjs.org/package/liqe)
[![Canonical Code Style](https://img.shields.io/badge/code%20style-canonical-blue.svg?style=flat-square)](https://github.com/gajus/canonical)
[![Twitter Follow](https://img.shields.io/twitter/follow/kuizinas.svg?style=social&label=Follow)](https://twitter.com/kuizinas)

Lightweight and performant Lucene-like parser and search engine.

* [Usage](#usage)
* [Query Syntax](#query-syntax)
  * [Liqe syntax cheat sheet](#liqe-syntax-cheat-sheet)
  * [Keyword matching](#keyword-matching)
  * [Number matching](#number-matching)
  * [Range matching](#range-matching)
  * [Wildcard matching](#wildcard-matching)
  * [Logical Operators](#logical-operators)
* [Compatibility with Lucene](#compatibility-with-lucene)
* [Recipes](#recipes)
  * [Highlighting matches](#highlighting-matches)
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
test(highlight('name:john'), persons[0]);
// [
//   {
//     path: 'name',
//     query: /(John)/,
//   }
// ]
test(highlight('height:180'), persons[0]);
// [
//   {
//     path: 'height',
//   }
// ]
```

## Query Syntax

### Liqe syntax cheat sheet

```rb
# search for "foo" term anywhere in the document (case insensitive)
foo

# search for "foo" term anywhere in the document (case sensitive)
'foo'
"foo"

# search for "foo" term in `name` field
name:foo

# search for "foo" term in `first` field, member of `name`, i.e.
# matches {name: {first: 'foo'}}
name.first:foo

# search using regex
name:/foo/
name:/foo/o

# search using wildcard
name:foo*bar

# boolean search
member:true
member:false

# null search
member:null

# search for age =, >, >=, <, <=
age:=100
age:>100
age:>=100
age:<100
age:<=100

# search for age in range (inclusive, exclusive)
height:[100 TO 200]
height:{100 TO 200}

# logical operators
name:foo AND age:=100
name:foo OR name:bar

# grouping
name:foo AND (bio:bar OR bio:baz)
```

### Keyword matching

Search for word "foo" in any field (case insensitive).

```rb
foo
```

Search for word "foo" in the `name` field.

```rb
name:foo
```

Search for `name` field values matching `/foo/i` regex.

```rb
name:/foo/i
```

Search for `name` field values matching `f*o` glob pattern.

```rb
name:f*o
```

Search for phrase "foo bar" in the `name` field (case sensitive).

```rb
name:"foo bar"
```

### Number matching

Search for value equal to 100 in the `height` field.

```rb
height:=100
```

Search for value greater than 100 in the `height` field.

```rb
height:>100
```

Search for value greater than or equal to 100 in the `height` field.

```rb
height:>=100
```

### Range matching

Search for value greater or equal to 100 and lower or equal to 200 in the `height` field.

```rb
height:[100 TO 200]
```

Search for value greater than 100 and lower than 200 in the `height` field.

```rb
height:{100 TO 200}
```

### Wildcard matching

Search for any word that starts with "foo" in the `name` field.

```rb
name:foo*
```

Search for any word that starts with "foo" and ends with bar in the `name` field.

```rb
name:foo*bar
```

### Logical Operators

Search for phrase "foo bar" in the `name` field AND the phrase "quick fox" in the `bio` field.

```rb
name:"foo bar" AND bio:"quick fox"
```

Search for either the phrase "foo bar" in the `name` field AND the phrase "quick fox" in the `bio` field, or the word "fox" in the `name` field.

```rb
(name:"foo bar" AND bio:"quick fox") OR name:fox
```

## Compatibility with Lucene

The following Lucene abilities are not supported:

* [Fuzzy Searches](https://lucene.apache.org/core/2_9_4/queryparsersyntax.html#Fuzzy%20Searches)
* [Proximity Searches](https://lucene.apache.org/core/2_9_4/queryparsersyntax.html#Proximity%20Searches)
* [Boosting a Term](https://lucene.apache.org/core/2_9_4/queryparsersyntax.html#Boosting%20a%20Term)

## Recipes

### Highlighting matches

Consider using [`highlight-words`](https://github.com/tricinel/highlight-words) package to highlight Liqe matches.

## Development

### Compiling Parser

If you are going to modify parser, then use `npm run watch` to run compiler in watch mode.

### Benchmarking Changes

Before making any changes, capture the current benchmark on your machine using `npm run benchmark`. Run benchmark again after making any changes. Before committing changes, ensure that performance is not negatively impacted.