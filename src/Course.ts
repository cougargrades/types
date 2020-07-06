import { DocumentReference } from '@firebase/firestore-types';
import { GPA } from './Statistics';
import Section from './Section';
import Instructor from './Instructor';
import Group from './Group';

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
  ) {}
}
