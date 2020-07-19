import { DocumentReference } from '@firebase/firestore-types';

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