import n2w from 'number-to-words';
import { Course } from './Course';
import { Instructor } from './Instructor';
import { Section } from './Section';
import { Group } from './Group';
import { generateKeywords, generateCourseKeywords, createKeywords } from './Keywords';
import { termCode } from './Util';
import * as GPA from './GPA';
import * as is from './is';
import * as SUBJECTS from '@cougargrades/publicdata/bundle/edu.uh.publications.subjects/subjects.json';
const from = require('core-js-pure/features/array/from');
const flat = require('core-js-pure/features/array/flat');
const Set = require('core-js-pure/features/set');
const dedupe = (x: any[]): any[] => from(new Set(x));

//const zero_if_undefined = (x: number | undefined) => (x === undefined ? 0 : x);
const zero_if_nan = (x: any) => isNaN(parseFloat(x)) ? 0 : parseFloat(x);
const null_if_nan = (x: any) => isNaN(parseFloat(x)) ? null : parseFloat(x);

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
  A: number; // May be undefined in source data
  B: number; // May be undefined in source data
  C: number; // May be undefined in source data
  D: number; // May be undefined in source data
  F: number; // May be undefined in source data
  SATISFACTORY: number; // May be undefined in source data
  NOT_REPORTED: number; // May be undefined in source data
  TOTAL_DROPPED: number; // May be undefined in source data
  AVG_GPA: number | null; // May be undefined in source data
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

export function getGroupMoniker(self: GradeDistributionCSVRow): string {
  return `${self.SUBJECT}`;
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
    S: self.SATISFACTORY,
    NCR: self.NOT_REPORTED,
    W: self.TOTAL_DROPPED,
    semesterGPA: self.AVG_GPA,
    course: null,
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
      self.AVG_GPA === null
        ? GPA.init()
        : GPA.include(GPA.init(), self.AVG_GPA),
    sections: [],
    instructors: [],
    groups: [],
    keywords: dedupe(generateCourseKeywords(
      self.SUBJECT.toLocaleLowerCase(),
      self.CATALOG_NBR.toLocaleLowerCase(),
      self.COURSE_DESCR.toLocaleLowerCase(),
    )),
    firstTaught: termCode(self.TERM),
    lastTaught: termCode(self.TERM),
    enrollment: {
      totalA: zero_if_nan(self.A),
      totalB: zero_if_nan(self.B),
      totalC: zero_if_nan(self.C),
      totalD: zero_if_nan(self.D),
      totalF: zero_if_nan(self.F),
      totalS: zero_if_nan(self.SATISFACTORY),
      totalNCR: zero_if_nan(self.NOT_REPORTED),
      totalW: zero_if_nan(self.TOTAL_DROPPED),
      totalEnrolled:
        zero_if_nan(self.A) +
        zero_if_nan(self.B) +
        zero_if_nan(self.C) +
        zero_if_nan(self.D) +
        zero_if_nan(self.F) +
        zero_if_nan(self.SATISFACTORY) +
        zero_if_nan(self.NOT_REPORTED) +
        zero_if_nan(self.TOTAL_DROPPED),
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
    keywords: dedupe(generateKeywords(
      self.INSTR_FIRST_NAME.trim().toLocaleLowerCase(),
      self.INSTR_LAST_NAME.trim().toLowerCase(),
    )),
    courses: [],
    sections: [],
    GPA:
      self.AVG_GPA === null
        ? GPA.init()
        : GPA.include(GPA.init(), self.AVG_GPA),
    enrollment: {
      totalA: zero_if_nan(self.A),
      totalB: zero_if_nan(self.B),
      totalC: zero_if_nan(self.C),
      totalD: zero_if_nan(self.D),
      totalF: zero_if_nan(self.F),
      totalS: zero_if_nan(self.SATISFACTORY),
      totalNCR: zero_if_nan(self.NOT_REPORTED),
      totalW: zero_if_nan(self.TOTAL_DROPPED),
      totalEnrolled:
        zero_if_nan(self.A) +
        zero_if_nan(self.B) +
        zero_if_nan(self.C) +
        zero_if_nan(self.D) +
        zero_if_nan(self.F) +
        zero_if_nan(self.SATISFACTORY) +
        zero_if_nan(self.NOT_REPORTED) +
        zero_if_nan(self.TOTAL_DROPPED),
    },
  };
}

export function toGroup(self: GradeDistributionCSVRow): Group {
  let name = self.SUBJECT in SUBJECTS ? (SUBJECTS as any)[self.SUBJECT] : self.SUBJECT;
  return {
    name: name,
    identifier: self.SUBJECT,
    description: `Courses from the \"${self.SUBJECT}\" subject.`,
    courses: [],
    sections: [],
    keywords: dedupe(flat([ self.SUBJECT, name ].map(e => createKeywords(e)))),
    categories: [],
  };
}

/**
 * Adapted from: https://github.com/cougargrades/importer/blob/3e1fe9571e367dd6d7023c80f57a05dcbcd655ff/src/reader.ts#L35-L70
 */
export function tryFromRaw(raw: any): GradeDistributionCSVRow | null {
  // read the rows into the typed object

  const undefined_if_emptystr = (x: any) => x === '' ? undefined : x;

  let formatted: GradeDistributionCSVRow = {
    TERM: undefined_if_emptystr(raw['TERM']),
    SUBJECT: undefined_if_emptystr(raw['SUBJECT']),
    CATALOG_NBR: undefined_if_emptystr(raw['CATALOG NBR']),
    CLASS_SECTION: parseInt(raw['CLASS SECTION']),
    COURSE_DESCR: undefined_if_emptystr(raw['COURSE DESCR']),
    INSTR_LAST_NAME: undefined_if_emptystr(raw['INSTR LAST NAME']),
    INSTR_FIRST_NAME: undefined_if_emptystr(raw['INSTR FIRST NAME']),
    A: zero_if_nan(raw['A']),
    B: zero_if_nan(raw['B']),
    C: zero_if_nan(raw['C']),
    D: zero_if_nan(raw['D']),
    F: zero_if_nan(raw['F']),
    SATISFACTORY: zero_if_nan(raw['SATISFACTORY']),
    NOT_REPORTED: zero_if_nan(raw['NOT REPORTED']),
    TOTAL_DROPPED: zero_if_nan(raw['TOTAL DROPPED']),
    AVG_GPA: null_if_nan(raw['AVG GPA']),
  };

  // send it off
  return is.GradeDistributionCSVRow(formatted) ? formatted : null;
}
