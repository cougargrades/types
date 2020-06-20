/**
 * Object representation of `edu.uh.grade_distribution`.
 * See: https://github.com/cougargrades/publicdata/tree/master/documents/edu.uh.grade_distribution
 */
export default interface GradeDistributionCSVRow {
  TERM?: string;
  SUBJECT?: string;
  CATALOG_NBR?: string;
  CLASS_SECTION?: number;
  COURSE_DESCR?: string;
  INSTR_LAST_NAME?: string;
  INSTR_FIRST_NAME?: string;
  A?: number;
  B?: number;
  C?: number;
  D?: number;
  F?: number;
  TOTAL_DROPPED?: number;
  AVG_GPA?: number;
}
