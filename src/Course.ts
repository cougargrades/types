import { DocumentReference, FieldValue } from './FirestoreStubs';
import { GPA } from './GPA';
import { Instructor } from './Instructor';
import { Section } from './Section';
import { Group } from './Group';
import { Enrollment } from './Enrollment';

export interface LabeledLink {
  title: string;
  url: string;
}

export interface PublicationInfo extends LabeledLink {
  //title: string;
  catoid: string;
  coid: string;
  classification: 'undergraduate' | 'graduate';
  //url: string;
  scrapeDate: string;
  content: string;
}

export interface TCCNSUpdateInfo {
  shortMessage: string;
  longMessage: string;
  courseHref: string;
  sourceHref: string;
}

export interface Course {
  _id: string;
  _path: string;
  department: string;
  catalogNumber: string;
  description: string;
  GPA: GPA;
  sections: Array<DocumentReference<Section>> | Array<Section> | FieldValue;
  instructors: Array<DocumentReference<Instructor>> | Array<Instructor> | FieldValue;
  groups: Array<DocumentReference<Group>> | Array<Group> | FieldValue;
  keywords: string[] | FieldValue;
  firstTaught: number;
  lastTaught: number;
  enrollment: Enrollment;
  publications: PublicationInfo[] | FieldValue;
  tccnsUpdates: TCCNSUpdateInfo[];
}
