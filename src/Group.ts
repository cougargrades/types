import { DocumentReference, FieldValue } from './FirestoreStubs';
import { Course, LabeledLink } from './Course';
import { Section } from './Section';

export interface Group {
  name: string;
  identifier: string;
  description: string;
  courses: Array<DocumentReference<Course>> | Array<Course> | FieldValue;
  sections: Array<DocumentReference<Section>> | Array<Section> | FieldValue;
  relatedGroups: Array<DocumentReference<Group>> | Array<Group> | FieldValue;
  keywords: string[] | FieldValue;
  categories: string[] | FieldValue;
  sources: LabeledLink[] | FieldValue;
}
