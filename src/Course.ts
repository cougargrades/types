import { DocumentReference } from '@firebase/firestore-types';
import { GPA } from './GPA';
import { Instructor } from './Instructor';
import { Section } from './Section';
import Group from './Group';
import Enrollment from './Enrollment';

export interface PublicationInfo {
  title: string;
  catoid: string;
  coid: string;
  classification: 'undergraduate' | 'graduate';
  url: string;
}

export interface Course {
  _id: string;
  _path: string;
  department: string;
  catalogNumber: string;
  description: string;
  GPA: GPA;
  sections: Array<DocumentReference<Section>> | Array<Section>;
  instructors: Array<DocumentReference<Instructor>> | Array<Instructor>;
  groups: Array<DocumentReference<Group>> | Array<Group>;
  keywords: string[];
  firstTaught: number;
  lastTaught: number;
  enrollment: Enrollment;
  publications: PublicationInfo[];
}
