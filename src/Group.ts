import { DocumentReference } from '@firebase/firestore-types';
import Course from './Course';

export default class Group {
  constructor(
    public name: string,
    public identifier: string,
    public description: string,
    public courses: Array<DocumentReference<Course>>,
    public courses_count: number,
    public keywords: string[],
  ) {}
}
