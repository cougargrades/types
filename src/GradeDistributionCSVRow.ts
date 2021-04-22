import n2w from 'number-to-words';
import { Course } from './Course';
import { Instructor } from './Instructor';
import { Section } from './Section';
import { generateKeywords, generateCourseKeywords } from './Keywords';
import { termCode } from './Util';
import * as GPA from './GPA';
import * as is from './is';

const zero_if_undefined = (x: number | undefined) => (x === undefined ? 0 : x);

/**
 * Object representation of `edu.uh.grade_distribution`.
 * See: https://github.com/cougargrades/publicdata/tree/master/documents/edu.uh.grade_distribution
 */
export interface GradeDistributionCSVRow {
  TERM: string;
  SUBJECT: string;
  CATALOG_NBR: string;
  CLASS_SECTION: number;
  COURSE_DESCR: string;
  INSTR_LAST_NAME: string;
  INSTR_FIRST_NAME: string;
  A?: number;
  B?: number;
  C?: number;
  D?: number;
  F?: number;
  TOTAL_DROPPED?: number;
  AVG_GPA?: number;
}

export function getSectionMoniker(self: GradeDistributionCSVRow): string {
  return `${self.SUBJECT}${self.CATALOG_NBR}_${termCode(
    self.TERM,
  )}_${n2w.toWords(self.CLASS_SECTION)}`;
}

export function getCourseMoniker(self: GradeDistributionCSVRow): string {
  return `${self.SUBJECT} ${self.CATALOG_NBR}`;
}

export function getInstructorMoniker(self: GradeDistributionCSVRow): string {
  return `${self.INSTR_LAST_NAME.trim()}, ${self.INSTR_FIRST_NAME.trim()}`;
}

export function toSection(self: GradeDistributionCSVRow): Section {
  return {
    _id: getSectionMoniker(self),
    _path: `sections/${getSectionMoniker(self)}`,
    courseName: getCourseMoniker(self),
    instructorNames: [
      { firstName: self.INSTR_FIRST_NAME, lastName: self.INSTR_LAST_NAME },
    ],
    instructors: [],
    sectionNumber: self.CLASS_SECTION,
    term: termCode(self.TERM),
    termString: self.TERM,
    A: self.A,
    B: self.B,
    C: self.C,
    D: self.D,
    F: self.F,
    Q: self.TOTAL_DROPPED,
    semesterGPA: self.AVG_GPA,
    course: undefined,
  };
}

export function toCourse(self: GradeDistributionCSVRow): Course {
  return {
    _id: getCourseMoniker(self),
    _path: `catalog/${getCourseMoniker(self)}`,
    department: self.SUBJECT,
    catalogNumber: self.CATALOG_NBR,
    description: self.COURSE_DESCR,
    GPA:
      self.AVG_GPA === undefined
        ? GPA.init()
        : GPA.include(GPA.init(), self.AVG_GPA),
    sections: [],
    instructors: [],
    groups: [],
    keywords: generateCourseKeywords(
      self.SUBJECT.toLocaleLowerCase(),
      self.CATALOG_NBR.toLocaleLowerCase(),
      self.COURSE_DESCR.toLocaleLowerCase(),
    ),
    firstTaught: termCode(self.TERM),
    lastTaught: termCode(self.TERM),
    enrollment: {
      totalA: zero_if_undefined(self.A),
      totalB: zero_if_undefined(self.B),
      totalC: zero_if_undefined(self.C),
      totalD: zero_if_undefined(self.D),
      totalF: zero_if_undefined(self.F),
      totalQ: zero_if_undefined(self.TOTAL_DROPPED),
      totalEnrolled:
        zero_if_undefined(self.A) +
        zero_if_undefined(self.B) +
        zero_if_undefined(self.C) +
        zero_if_undefined(self.D) +
        zero_if_undefined(self.F) +
        zero_if_undefined(self.TOTAL_DROPPED),
    },
    publications: [],
  };
}

export function toInstructor(self: GradeDistributionCSVRow): Instructor {
  return {
    _id: getInstructorMoniker(self),
    _path: `instructors/${getInstructorMoniker(self)}`,
    firstName: self.INSTR_FIRST_NAME.trim(),
    lastName: self.INSTR_LAST_NAME.trim(),
    fullName: `${self.INSTR_FIRST_NAME.trim()} ${self.INSTR_LAST_NAME.trim()}`,
    departments: {},
    firstTaught: termCode(self.TERM),
    lastTaught: termCode(self.TERM),
    keywords: generateKeywords(
      self.INSTR_FIRST_NAME.trim().toLocaleLowerCase(),
      self.INSTR_LAST_NAME.trim().toLowerCase(),
    ),
    courses: [],
    sections: [],
    GPA:
      self.AVG_GPA === undefined
        ? GPA.init()
        : GPA.include(GPA.init(), self.AVG_GPA),
    enrollment: {
      totalA: zero_if_undefined(self.A),
      totalB: zero_if_undefined(self.B),
      totalC: zero_if_undefined(self.C),
      totalD: zero_if_undefined(self.D),
      totalF: zero_if_undefined(self.F),
      totalQ: zero_if_undefined(self.TOTAL_DROPPED),
      totalEnrolled:
        zero_if_undefined(self.A) +
        zero_if_undefined(self.B) +
        zero_if_undefined(self.C) +
        zero_if_undefined(self.D) +
        zero_if_undefined(self.F) +
        zero_if_undefined(self.TOTAL_DROPPED),
    },
  };
}

/**
 * Adapted from: https://github.com/cougargrades/importer/blob/3e1fe9571e367dd6d7023c80f57a05dcbcd655ff/src/reader.ts#L35-L70
 */
export function tryFromRaw(raw: any): GradeDistributionCSVRow | null {
  // convert column names that have spaces to underscores
  for (let key of Object.keys(raw)) {
    let sanitized_key = key.replace(/ /g, '_');
    if (sanitized_key !== key) {
      raw[sanitized_key] = raw[key];
      delete raw[key];
    }
  }

  const is_nullish = (x: any) => x === null || x === undefined || x === '' || isNaN(parseInt(x));

  // read the rows into the typed object
  let formatted: GradeDistributionCSVRow = {
    TERM: raw['TERM'],
    SUBJECT: raw['SUBJECT'],
    CATALOG_NBR: raw['CATALOG_NBR'],
    CLASS_SECTION: parseInt(raw['CLASS_SECTION']),
    COURSE_DESCR: raw['COURSE_DESCR'],
    INSTR_LAST_NAME: raw['INSTR_LAST_NAME'],
    INSTR_FIRST_NAME: raw['INSTR_FIRST_NAME'],
    A: raw['A'] === '' ? undefined : parseInt(raw['A']),
    B: raw['B'] === '' ? undefined : parseInt(raw['B']),
    C: raw['C'] === '' ? undefined : parseInt(raw['C']),
    D: raw['D'] === '' ? undefined : parseInt(raw['D']),
    F: raw['F'] === '' ? undefined : parseInt(raw['F']),
    TOTAL_DROPPED: raw['TOTAL_DROPPED'] === '' ? undefined : parseInt(raw['TOTAL_DROPPED']),
    AVG_GPA: raw['AVG_GPA'] === '' ? undefined : parseInt(raw['AVG_GPA']),
  };

  // send it off
  return is.GradeDistributionCSVRow(formatted) ? formatted : null;
}
