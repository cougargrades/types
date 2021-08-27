import { DocumentReference } from './FirestoreStubs';
import { Course } from './Course';
import { Instructor } from './Instructor';
import { Section } from './Section';
import { Group } from './Group';
import { AsyncSemaphore } from './AsyncSemaphore';

export const isDocumentReference = (tbd: any): tbd is DocumentReference =>
  tbd.firestore !== undefined;
export const isDocumentReferenceArray = (
  tbd: any,
): tbd is Array<DocumentReference> =>
  Array.isArray(tbd) && tbd.length > 0 && isDocumentReference(tbd[0]);

export async function populate<T>(
  docs: Array<DocumentReference<T>>,
  concurrent = 5,
  extraPrecaution = false,
  checkCache = false,
  progress?: (p: number, total: number) => void,
): Promise<Array<T>> {
  if(extraPrecaution) {
    return await populateSafe(docs)
  }
  else {
    let results: Array<T> = [];
    if (isDocumentReferenceArray(docs)) {
      const semaphore = new AsyncSemaphore(concurrent);
      let p = 0;
      for(let i = 0; i < docs.length; i++) {
        await semaphore.withLockRunAndForget(async () => {
          results[i] = (await getDocument(docs[i], checkCache)).data()!
          p++;
          if(progress) {
            progress(p, docs.length);
          }
        })
      }
      await semaphore.awaitTerminate();
    }
    return results;
  }
}

export async function populateSafe<T>(
  docs: Array<DocumentReference<T>>,
  progress?: (p: number, total: number) => void,
): Promise<Array<T>> {
  let results: Array<T> = [];
  if (isDocumentReferenceArray(docs)) {
    let p = 0;
    for(const ref of docs) {
      results.push((await ref.get()).data()!)
      p++;
      if(progress) {
        progress(p, docs.length);
      }
    }
  }
  return results;
}

/**
 * 
 * @param doc 
 * @param checkCache Do NOT supply in the admin sdk environment. It is unsupported there!
 * @returns 
 */
export async function getDocument<T>(doc: DocumentReference<T>, checkCache = false) {
  if(checkCache) {
    try {
      // DocumentReference.get() returns an error if no data is in the cache to satisfy call
      const snap = await doc.get({ source: 'cache' })
      console.count('cache hit')
      return snap
    }
    catch(err) {
      const snap = await doc.get({ source: 'server' })
      console.count('cache miss')
      return snap
    }
  }
  else {
    return await doc.get()
  }
}

// From: https://stackoverflow.com/a/24782004
export function chunk<T>(array: T[], chunkSize = 10): T[][] {
  const R = [];
  for (let i = 0, len = array.length; i < len; i += chunkSize)
    R.push(array.slice(i, i + chunkSize));
  return R;
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
