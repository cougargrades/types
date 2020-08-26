import n2w from 'number-to-words';
import Section from './Section';
import Course from './Course';
import Instructor from './Instructor';
import { GPA } from './Statistics';
import { generateKeywords, generateCourseKeywords } from './Keywords';
import Enrollment from './Enrollment';
import { termCode } from './Util';

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
  ) {}

  getSectionMoniker(): string {
    return `${this.SUBJECT}${this.CATALOG_NBR}_${termCode(
      this.TERM,
    )}_${n2w.toWords(this.CLASS_SECTION)}`;
  }

  getCourseMoniker(): string {
    return `${this.SUBJECT} ${this.CATALOG_NBR}`;
  }

  getInstructorMoniker(): string {
    return `${this.INSTR_LAST_NAME.trim()}, ${this.INSTR_FIRST_NAME.trim()}`;
  }

  toSection(): Section {
    return new Section(
      this.getSectionMoniker(),
      `sections/${this.getSectionMoniker()}`,
      this.getCourseMoniker(),
      [{ firstName: this.INSTR_FIRST_NAME, lastName: this.INSTR_LAST_NAME }],
      [],
      this.CLASS_SECTION,
      termCode(this.TERM),
      this.TERM,
      this.A,
      this.B,
      this.C,
      this.D,
      this.F,
      this.TOTAL_DROPPED,
      this.AVG_GPA,
      undefined,
    );
  }

  toCourse(): Course {
    return new Course(
      this.getCourseMoniker(),
      `catalog/${this.getCourseMoniker()}`,
      this.SUBJECT,
      this.CATALOG_NBR,
      this.COURSE_DESCR,
      this.AVG_GPA === undefined ? new GPA() : new GPA().include(this.AVG_GPA),
      [],
      0,
      [],
      [],
      generateCourseKeywords(
        this.SUBJECT.toLowerCase(),
        this.CATALOG_NBR.toLowerCase(),
        this.COURSE_DESCR.toLowerCase(),
      ),
      termCode(this.TERM),
      termCode(this.TERM),
      new Enrollment(0, 0, 0, 0, 0, 0, 0),
    );
  }

  toInstructor(): Instructor {
    return new Instructor(
      this.getInstructorMoniker(),
      `instructors/${this.getInstructorMoniker()}`,
      this.INSTR_FIRST_NAME.trim(),
      this.INSTR_LAST_NAME.trim(),
      `${this.INSTR_FIRST_NAME.trim()} ${this.INSTR_LAST_NAME.trim()}`,
      {},
      generateKeywords(
        this.INSTR_FIRST_NAME.trim().toLowerCase(),
        this.INSTR_LAST_NAME.trim().toLowerCase(),
      ),
      [],
      0,
      [],
      0,
      this.AVG_GPA === undefined ? new GPA() : new GPA().include(this.AVG_GPA),
    );
  }
}
