import { DocumentReference } from '@firebase/firestore-types';
import { GPA } from './Statistics';
import { DepartmentCode } from './DepartmentCode';
import Section from './Section';
import Course from './Course';

export default class Instructor {
  constructor(
    public _id: string,
    public _path: string,
    public firstName: string,
    public lastName: string,
    public fullName: string,
    public departments: { [key in DepartmentCode]?: number },
    public keywords: string[],
    public courses: Array<DocumentReference<Course>>,
    public courses_count: number,
    public sections: Array<DocumentReference<Section>>,
    public sections_count: number,
    public GPA: GPA,
  ) {}
}
