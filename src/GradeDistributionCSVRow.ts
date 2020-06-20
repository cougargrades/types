import n2w from 'number-to-words';
import Section from './Section';
import Course from './Course';
import Instructor from './Instructor';
import { GPA } from './Statistics';
import { generateKeywords } from './Keywords';

export function termCode(term: string): number {
  return parseInt(`${term.split(' ')[1]}${seasonCode(term.split(' ')[0])}`);
}

export function seasonCode(season: string): string | null {
  if(season === 'Spring') {
    return '01';
  }
  if(season === 'Summer') {
    return '02';
  }
  if(season === 'Fall') {
    return '03';
  }
  return null
}

/**
 * Object representation of `edu.uh.grade_distribution`.
 * See: https://github.com/cougargrades/publicdata/tree/master/documents/edu.uh.grade_distribution
 */
export default class GradeDistributionCSVRow {
  constructor(
    public TERM: string,
    public SUBJECT: string,
    public CATALOG_NBR: string,
    public CLASS_SECTION: number,
    public COURSE_DESCR: string,
    public INSTR_LAST_NAME: string,
    public INSTR_FIRST_NAME: string,
    public A?: number,
    public B?: number,
    public C?: number,
    public D?: number,
    public F?: number,
    public TOTAL_DROPPED?: number,
    public AVG_GPA?: number,
  ){}

  getSectionMoniker(): string {
    return `${this.SUBJECT}${this.CATALOG_NBR}_${termCode(this.TERM)}_${n2w.toWords(this.CLASS_SECTION)}`
  }

  getCourseMoniker(): string {
    return `${this.SUBJECT} ${this.CATALOG_NBR}`
  }

  getInstructorMonker(): string {
    return `${this.INSTR_LAST_NAME.trim()}, ${this.INSTR_FIRST_NAME.trim()}`
  }

  toSection(): Section {
    return {
      A: this.A,
      B: this.B,
      C: this.C,
      D: this.D,
      F: this.F,
      Q: this.TOTAL_DROPPED,
      instructorNames: [
        {
          firstName: this.INSTR_FIRST_NAME,
          lastName: this.INSTR_LAST_NAME
        }
      ],
      instructors: [],
      sectionNumber: this.CLASS_SECTION,
      semesterGPA: this.AVG_GPA,
      term: termCode(this.TERM),
      termString: this.TERM,
      courseName: this.getCourseMoniker(),
    }
  }

  toCourse(): Course {
    return {
      department: this.SUBJECT,
      catalogNumber: this.CATALOG_NBR,
      description: this.COURSE_DESCR,
      GPA: new GPA(),
      sections: [],
      instructors: [],
      sectionCount: 0
    }
  }

  toInstructor(): Instructor {
    return {
      firstName: this.INSTR_FIRST_NAME.trim(),
      lastName: this.INSTR_LAST_NAME.trim(),
      fullName: `${this.INSTR_FIRST_NAME.trim()} ${this.INSTR_LAST_NAME.trim()}`,
      departments: {},
      keywords: generateKeywords(this.INSTR_FIRST_NAME.trim().toLowerCase(), this.INSTR_LAST_NAME.trim().toLowerCase()),
      courses: [],
      courses_count: 0,
      sections: [],
      sections_count: 0,
      GPA: new GPA()
    }
  }
}
