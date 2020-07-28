import { DocumentReference } from '@firebase/firestore-types';
import Course from './Course';
import Instructor from './Instructor';
import { Cloneable } from './Statistics';

export default class Section implements Cloneable<Section> {
  constructor(
    public _id: string,
    public _path: string,
    public courseName: string,
    public instructorNames: { firstName: string; lastName: string }[],
    public instructors: Array<DocumentReference<Instructor>> | Array<Instructor>,
    public sectionNumber: number,
    public term: number,
    public termString: string,
    public A?: number,
    public B?: number,
    public C?: number,
    public D?: number,
    public F?: number,
    public Q?: number,
    public semesterGPA?: number,
    public course?: DocumentReference<Course> | Course,
  ) {}
  cloneFrom(source: Section): Section {
    return new Section(
      source._id,
      source._path,
      source.courseName,
      Object.assign({}, source.instructorNames),
      source.instructors,
      source.sectionNumber,
      source.term,
      source.termString,
      source.A,
      source.B,
      source.C,
      source.D,
      source.F,
      source.Q,
      source.semesterGPA,
      source.course
    );
  }
}
