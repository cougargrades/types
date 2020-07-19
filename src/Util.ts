import { DocumentReference } from '@firebase/firestore-types';
import Course from './Course';
import Instructor from './Instructor';
import Group from './Group';
import Section from './Section';

export const isDocumentReference = (tbd: any): tbd is DocumentReference => tbd.firestore !== undefined;
export const isDocumentReferenceArray = (tbd: any): tbd is Array<DocumentReference> => Array.isArray(tbd) && tbd.length > 0 && isDocumentReference(tbd[0]);

export async function populate<T>(docs: Array<DocumentReference<T>>): Promise<Array<T>> {
  let results: Array<T> = [];
  if(isDocumentReferenceArray(docs)) {
    for await (let item of docs.map(e => e.get())) {
      results.push(item.data()!)
    }
  }
  return results;
}

// See: https://stackoverflow.com/a/53443378
export const sanitizeCourse = ({sections, instructors, groups, ...o}: Course) => o;
export const sanitizeInstructor = ({courses, sections, ...o}: Instructor) => o;
export const sanitizeSection = ({course, instructors, ...o}: Section) => o;
export const sanitizeGroup = ({courses, ...o}: Group) => o;