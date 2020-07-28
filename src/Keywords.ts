// Based on: https://github.com/cougargrades/importer-python/blob/5c4995ebad68ca28f8c00a43a6faf3d7d69f75e5/cougargrades/util.py

// Module doesn't have TypeScript definitions
const itertools = require('itertools');

export function generateCourseKeywords(
  department: string,
  catalogNumber: string,
  description: string,
) {
  let result: string[] = [];

  // replace punctuation, standalone digits, and roman numerals
  let chars = /[^\w\s]|(\b\d\b)|(\bI\b)|(\bII\b)|(\bIII\b)|(\bIV\b)|(\bV\b)|(\bVI\b)|(\bVII\b)|(\bVIII\b)|(\bIX\b)|(\bX\b)|(\bXI\b)|(\bXII\b)|(\bXIII\b)/g;
  let spaces = /\ +/g;

  // cleaned up version of the description
  let cleaned = description
    .replace(chars, ' ')
    .replace(spaces, ' ')
    .toLowerCase();
  // compute *k* value of the description
  const k = cleaned.split(' ').length;
  // if the k value is too large, don't generate permutations
  let permutations = k < 5 ? generatePermutations(cleaned) : [cleaned];
  // concatenate permutations
  for (let p of permutations) {
    result = result.concat(createKeywords(p));
  }

  return Array.from(
    new Set([
      ...createKeywords(`${department} ${catalogNumber}`.toLowerCase()),
      ...result,
    ]),
  ).sort();
}

export function createKeywords(name: string) {
  let arrName = [];
  let curName = '';
  for (let letter of name) {
    curName += letter.toLowerCase();
    arrName.push(curName);
  }
  return arrName;
}

export function generateKeywords(firstName: string, lastName: string) {
  let fullName = `${firstName} ${lastName}`;
  let k = fullName.split(' ').length; // number of "names"; "John Robert Doe" => 3
  let permutations =
    k < 5
      ? generatePermutations(fullName)
      : generateConservativePermutations(firstName, lastName);
  let result: string[] = [];
  for (let p of permutations) {
    result = result.concat(createKeywords(p));
  }
  return Array.from(new Set(result)).sort(); // remove duplicates and sort
}

export function generatePermutations(fullName: string) {
  let names = fullName.split(' ');
  let permutations: string[][] = [];
  let results = [];
  for (let i = 0; i < names.length; i++) {
    permutations = permutations.concat(
      Array.from(itertools.permutations(names, i)),
    );
  }
  for (let tup of permutations) {
    results.push(tup.join(' '));
  }
  return results;
}

export function generateConservativePermutations(
  firstName: string,
  lastName: string,
) {
  return [
    firstName,
    lastName,
    `${firstName} ${lastName}`,
    `${lastName} ${firstName}`,
  ];
}
