import { DocumentReference } from '@firebase/firestore-types';
import { GPA, Cloneable } from './Statistics';
import { DepartmentCode } from './DepartmentCode';
import Section from './Section';
import Course from './Course';
import Enrollment from './Enrollment';

export default class Instructor implements Cloneable<Instructor> {
  constructor(
    public _id: string,
    public _path: string,
    public firstName: string,
    public lastName: string,
    public fullName: string,
    public departments: { [key in DepartmentCode]?: number },
    public keywords: string[],
    public courses: Array<DocumentReference<Course>> | Array<Course>,
    public courses_count: number,
    public sections: Array<DocumentReference<Section>> | Array<Section>,
    public sections_count: number,
    public GPA: GPA,
    public enrollment?: Enrollment,
  ) {}
  cloneFrom(source: Instructor): Instructor {
    return new Instructor(
      source._id,
      source._path,
      source.firstName,
      source.lastName,
      source.fullName,
      Object.assign({}, source.departments),
      source.keywords,
      source.courses,
      source.courses_count,
      source.sections,
      source.sections_count,
      GPA.prototype.cloneFrom(source.GPA),
      Object.assign({}, source.enrollment)
    );
  }
}
