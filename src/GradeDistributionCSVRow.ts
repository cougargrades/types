/**
 * Object representation of `edu.uh.grade_distribution`.
 * See: https://github.com/cougargrades/publicdata/tree/master/documents/edu.uh.grade_distribution
 */
export default class GradeDistributionCSVRow {
  constructor(
    public TERM?: string,
    public SUBJECT?: string,
    public CATALOG_NBR?: string,
    public CLASS_SECTION?: number,
    public COURSE_DESCR?: string,
    public INSTR_LAST_NAME?: string,
    public INSTR_FIRST_NAME?: string,
    public A?: number,
    public B?: number,
    public C?: number,
    public D?: number,
    public F?: number,
    public TOTAL_DROPPED?: number,
    public AVG_GPA?: number,
  ){}
}
