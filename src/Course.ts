import { DocumentReference } from '@firebase/firestore-types';
import { GPA, Cloneable } from './Statistics';
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

export default class Course implements Cloneable<Course> {
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
  cloneFrom(source: Course): Course {
    return new Course(
      source._id,
      source._path,
      source.department,
      source.catalogNumber,
      source.description,
      GPA.prototype.cloneFrom(source.GPA),
      source.sections,
      source.sectionCount,
      source.instructors,
      source.groups,
      source.keywords,
      source.firstTaught,
      source.lastTaught,
      source.enrollment,
      source.publication
    );
  }
}
