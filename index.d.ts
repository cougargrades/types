/**
 * Defines which endpoints this Token has what kind of access to.
 */
export interface TokenPermissions {
  create: string[];
  read: string[];
  update: string[];
  delete: string[];
}

/**
 * Defines the metadata for a token
 */
export default class TokenMetadata {
  constructor(application: string, bearer: string, permissions: TokenPermissions, createdDate: Date);

  application: string;
  bearer: string;
  permissions: TokenPermissions;
  createdDate: Date;

  operation(method: 'GET'|'POST'|'PUT'|'DELETE'): 'create'|'read'|'update'|'delete';
  hasPermission(operation: 'create'|'read'|'update'|'delete', path: string): boolean;
  serialize(): any;
}

/**
 * Object representation of `edu.uh.grade_distribution`.
 * See: https://github.com/cougargrades/publicdata/tree/master/documents/edu.uh.grade_distribution
 */
export declare namespace EduUHGradeDistribution {
  export interface CSVRow {
    TERM: string;
  }
}