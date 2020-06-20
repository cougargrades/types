import micromatch from 'micromatch';

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
export default class Token {
  constructor(
    application: string = '<none>',
    bearer: string = '<none>',
    permissions: TokenPermissions = {
      create: [],
      read: [],
      update: [],
      delete: [],
    },
    createdDate: Date = new Date(0),
  ) {
    this.application = application;
    this.bearer = bearer;
    this.permissions = permissions;
    this.createdDate = createdDate;
  }

  application: string;
  bearer: string;
  permissions: TokenPermissions;
  createdDate: Date;

  operation(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  ): 'create' | 'read' | 'update' | 'delete' {
    if (method === 'GET') return 'read';
    if (method === 'POST') return 'update';
    if (method === 'PUT') return 'create';
    if (method === 'DELETE') return 'delete';
    // satisfy type checker
    return 'read';
  }

  hasPermission(
    operation: 'create' | 'read' | 'update' | 'delete',
    path: string,
  ): boolean {
    return micromatch([path], this.permissions[operation]).length > 0;
  }
}
