// Based on: https://github.com/cougargrades/importer-python/blob/5c4995ebad68ca28f8c00a43a6faf3d7d69f75e5/cougargrades/util.py

// Module doesn't have TypeScript definitions
const itertools = require('itertools');

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
