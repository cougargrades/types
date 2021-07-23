import n2w from 'number-to-words';
import { Course } from './Course';
import { Instructor } from './Instructor';
import { Section } from './Section';
import { Group } from './Group';
import { generateKeywords, generateCourseKeywords, createKeywords } from './Keywords';
import { termCode } from './Util';
import * as GPA from './GPA';
import * as is from './is';
import * as SUBJECTS from '@cougargrades/publicdata/bundle/com.collegescheduler.uh.subjects/dictionary.json';
const from = require('core-js-pure/features/array/from');
const flat = require('core-js-pure/features/array/flat');
const Set = require('core-js-pure/features/set');
const dedupe = (x: any[]): any[] => from(new Set(x));

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
  A?: number | undefined;
  B?: number | undefined;
  C?: number | undefined;
  D?: number | undefined;
  F?: number | undefined;
  TOTAL_DROPPED?: number | undefined;
  AVG_GPA?: number | undefined;
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
    keywords: dedupe(generateCourseKeywords(
      self.SUBJECT.toLocaleLowerCase(),
      self.CATALOG_NBR.toLocaleLowerCase(),
      self.COURSE_DESCR.toLocaleLowerCase(),
    )),
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
    keywords: dedupe(generateKeywords(
      self.INSTR_FIRST_NAME.trim().toLocaleLowerCase(),
      self.INSTR_LAST_NAME.trim().toLowerCase(),
    )),
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

export function toGroup(self: GradeDistributionCSVRow): Group {
  let name = self.SUBJECT in SUBJECTS ? (SUBJECTS as any)[self.SUBJECT] : self.SUBJECT;
  return {
    name: name,
    identifier: self.SUBJECT,
    description: `Courses from the \"${self.SUBJECT}\" subject.`,
    courses: [],
    courses_count: 0,
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
    A: raw['A'] === '' || isNaN(parseInt(raw['A'])) ? undefined : parseInt(raw['A']),
    B: raw['B'] === '' || isNaN(parseInt(raw['B'])) ? undefined : parseInt(raw['B']),
    C: raw['C'] === '' || isNaN(parseInt(raw['C'])) ? undefined : parseInt(raw['C']),
    D: raw['D'] === '' || isNaN(parseInt(raw['D'])) ? undefined : parseInt(raw['D']),
    F: raw['F'] === '' || isNaN(parseInt(raw['F'])) ? undefined : parseInt(raw['F']),
    TOTAL_DROPPED: raw['TOTAL DROPPED'] === '' || isNaN(parseInt(raw['TOTAL DROPPED'])) ? undefined : parseInt(raw['TOTAL DROPPED']),
    AVG_GPA: raw['AVG GPA'] === '' || isNaN(parseFloat(raw['AVG GPA'])) ? undefined : parseFloat(raw['AVG GPA']),
  };

  // send it off
  return is.GradeDistributionCSVRow(formatted) ? formatted : null;
}
