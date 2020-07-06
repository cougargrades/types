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

export default class Course {
  constructor(
    public _id: string,
    public _path: string,
    public department: string,
    public catalogNumber: string,
    public description: string,
    public GPA: GPA,
    public sections: Array<DocumentReference<Section>>,
    public sectionCount: number,
    public instructors: Array<DocumentReference<Instructor>>,
    public groups: Array<DocumentReference<Group>>,
    public keywords: string[],
    public firstTaught?: number,
    public lastTaught?: number,
    public publication?: PublicationInfo,
    public enrollment?: Enrollment,
  ) {}
}
