import { DocumentReference } from '@firebase/firestore-types';
import { GPA } from './Statistics';
import Section from './Section';
import Instructor from './Instructor';
import Group from './Group';
import Enrollment from './Enrollment';

export class PublicationInfo {
  constructor(
    public title: string,
    public catoid: string,
    public coid: string,
    public classification: 'undergraduate' | 'graduate',
    public url: string,
  ) {}
}

export const isDocumentReference = (tbd: any): tbd is DocumentReference => tbd.firestore !== undefined;
export const isDocumentReferenceArray = (tbd: any): tbd is Array<DocumentReference> => Array.isArray(tbd) && tbd.length > 0 && isDocumentReference(tbd[0]);

export default class Course {
  constructor(
    public _id: string,
    public _path: string,
    public department: string,
    public catalogNumber: string,
    public description: string,
    public GPA: GPA,
    public sections: Array<DocumentReference<Section>> | Array<Section>,
    public sectionCount: number,
    public instructors: Array<DocumentReference<Instructor>> | Array<Instructor>,
    public groups: Array<DocumentReference<Group>> | Array<Group>,
    public keywords: string[],
    public firstTaught: number,
    public lastTaught: number,
    public enrollment: Enrollment,
    public publication?: PublicationInfo,
  ) {}

  public async populateSections(): Promise<void> {
    let results: Array<Section> = [];
    // concurrently get results
    if(isDocumentReferenceArray(this.sections)) {
      for await (let item of this.sections.map(e => e.get())) {
        results.push(item.data()!)
      }
    }
    
    this.sections = results;
  }
}
