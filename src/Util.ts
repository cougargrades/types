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
export const sanitizeInstructor = ({
  courses,
  sections,
  keywords,
  ...o
}: Instructor) => o;
export const sanitizeSection = ({ course, instructors, ...o }: Section) => o;
export const sanitizeGroup = ({ courses, ...o }: Group) => o;

export function termCode(term: string): number {
  return parseInt(`${term.split(' ')[1]}${seasonCode(term.split(' ')[0])}`);
}

export function seasonCode(season: string): string | null {
  if (season === 'Spring') {
    return '01';
  }
  if (season === 'Summer') {
    return '02';
  }
  if (season === 'Fall') {
    return '03';
  }
  return null;
}
