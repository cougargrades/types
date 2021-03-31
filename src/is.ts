import { is, createIs } from 'typescript-is';

// Types without methods
import { Course, PublicationInfo } from './Course';
import { Instructor } from './Instructor';
import { Section } from './Section';
import { DepartmentCode } from './DepartmentCode';
import { default as Enrollment } from './Enrollment';
import { default as Group } from './Group';
import { User, CustomClaims } from './User';

// Types with methods
import { GradeDistributionCSVRow } from './GradeDistributionCSVRow';
import { Patchfile } from './Patchfile';
import { GPA } from './GPA';
import { Average } from './Statistics/Average';
import { StandardDeviation } from './Statistics/StandardDeviation';
import { MaxMinRange } from './Statistics/MaxMinRange';
//import { Token } from './Token';
//import * as Util from './Util';

// Error: Classes cannot be validated. https://github.com/woutervh-/typescript-is/issues/3
// export function Course(object: any): object is Course {
//   return is<Course>(object);
// }

export function PublicationInfo(object: any): object is PublicationInfo {
  return is<PublicationInfo>(object);
}

// Error: Classes cannot be validated. https://github.com/woutervh-/typescript-is/issues/3
// export function Instructor(object: any): object is Instructor {
//   return is<Instructor>(object);
// }

// Error: Classes cannot be validated. https://github.com/woutervh-/typescript-is/issues/3
// export function Section(object: any): object is Section {
//   return is<Section>(object);
// }

export function DepartmentCode(object: any): object is DepartmentCode {
  return is<DepartmentCode>(object);
}

export function Enrollment(object: any): object is Enrollment {
  return is<Enrollment>(object);
}

// Error: Classes cannot be validated. https://github.com/woutervh-/typescript-is/issues/3
// export function Group(object: any): object is Group {
//   return is<Group>(object);
// }

export function User(object: any): object is User {
  return is<User>(object);
}

export function CustomClaims(object: any): object is CustomClaims {
  return is<CustomClaims>(object);
}

export function GradeDistributionCSVRow(object: any): object is GradeDistributionCSVRow {
  return is<GradeDistributionCSVRow>(object);
}

export function Patchfile(object: any): object is Patchfile {
  return is<Patchfile>(object);
}

export function GPA(object: any): object is GPA {
  return is<GPA>(object);
}

export function Average(object: any): object is Average {
  return is<Average>(object);
}

export function StandardDeviation(object: any): object is StandardDeviation {
  return is<StandardDeviation>(object);
}

export function MaxMinRange(object: any): object is MaxMinRange {
  return is<MaxMinRange>(object);
}

