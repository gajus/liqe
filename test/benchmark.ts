import {
  add,
  complete,
  cycle,
  suite,
} from 'benny';
import faker from 'faker';
import {
  parse,
  filter,
} from '../src/Liqe';

const randomInRange = (min, max) => {
  return Math.floor(
    Math.random() * (Math.ceil(max) - Math.floor(min) + 1) + min,
  );
};

type Person = {
  email: string,
  height: number,
  name: string,
};

const persons: Person[] = [];

let size = 10_000;

while (size--) {
  persons.push({
    email: faker.internet.email(),
    height: randomInRange(160, 220),
    name: faker.name.findName(),
  });
}

void suite(
  'liqe',

  add('filters list by the "name" field using simple strict equality check', () => {
    const query = parse('name:"Gajus"');

    return () => {
      filter(query, persons);
    };
  }),

  add('filters list by the "name" field using regex check', () => {
    const query = parse('name:/Gajus/ui');

    return () => {
      filter(query, persons);
    };
  }),

  add('filters list by the "name" field using loose inclusion check', () => {
    const query = parse('name:Gajus');

    return () => {
      filter(query, persons);
    };
  }),

  add('filters list by the "name" field using glob check', () => {
    const query = parse('name:Ga*');

    return () => {
      filter(query, persons);
    };
  }),

  add('filters list by any field using loose inclusion check', () => {
    const query = parse('Gajus');

    return () => {
      filter(query, persons);
    };
  }),

  add('filters list by the "height" field using strict equality check', () => {
    const query = parse('height:180');

    return () => {
      filter(query, persons);
    };
  }),

  add('filters list by the "height" field using range check', () => {
    const query = parse('height:[160 TO 180]');

    return () => {
      filter(query, persons);
    };
  }),
  cycle(),
  complete(),
);

