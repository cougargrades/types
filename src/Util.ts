import { DocumentReference } from './FirestoreStubs';
import { Course } from './Course';
import { Instructor } from './Instructor';
import { Section } from './Section';
import { Group } from './Group';

export const isDocumentReference = (tbd: any): tbd is DocumentReference =>
  tbd.firestore !== undefined;
export const isDocumentReferenceArray = (
  tbd: any,
): tbd is Array<DocumentReference> =>
  Array.isArray(tbd) && tbd.length > 0 && isDocumentReference(tbd[0]);

export async function populate<T>(
  docs: Array<DocumentReference<T>>,
): Promise<Array<T>> {
  let results: Array<T> = [];
  if (isDocumentReferenceArray(docs)) {
    for await (let item of docs.map((e) => e.get())) {
      results.push(item.data()!);
    }
  }
  return results;
}

// See: https://stackoverflow.com/a/53443378
export const sanitizeCourse = ({
  sections,
  instructors,
  groups,
  ...o
}: Course) => o;
export type SanitizedCourse = ReturnType<typeof sanitizeCourse>;
export const sanitizeInstructor = ({
  courses,
  sections,
  keywords,
  ...o
}: Instructor) => o;
export type SanitizedInstructor = ReturnType<typeof sanitizeInstructor>;
export const sanitizeSection = ({ course, instructors, ...o }: Section) => o;
export type SanitizedSection = ReturnType<typeof sanitizeSection>;
export const sanitizeGroup = ({ courses, ...o }: Group) => o;
export type SanitizedGroup = ReturnType<typeof sanitizeGroup>;

export const reverseMap = <K,V>(m1: Map<K, V>): Map<V, K> => new Map(Array.from(m1.entries()).map<[V, K]>(e => [e[1], e[0]]))

export function termCode(termString: string): number {
  return parseInt(`${termString.split(' ')[1]}${seasonCodes.get(termString.split(' ')[0])}`);
}

export function termString(termCode: number): string {
  const year = Math.floor(termCode / 100);
  const seasonCode = `${Math.floor(termCode / 10) % 10}${termCode % 10}`
  return `${seasonStrings.get(seasonCode)} ${year}`;
};

export const seasonCodes = new Map<string, string>([
  ['Spring', '01'],
  ['Summer', '02'],
  ['Fall', '03'],
]);

export const seasonStrings = reverseMap(seasonCodes);
