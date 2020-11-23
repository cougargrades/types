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
export default interface Token {
  application: string;
  bearer: string;
  permissions: TokenPermissions;
  createdDate: Date;
}

export function hasPermission(self: Token, operation: 'create' | 'read' | 'update' | 'delete', path: string): boolean {
  return micromatch([path], self.permissions[operation]).length > 0;
}

export function HTTPMethodToOperation(method: 'GET' | 'POST' | 'PUT' | 'DELETE'): 'create' | 'read' | 'update' | 'delete' {
  if (method === 'GET') return 'read';
  if (method === 'POST') return 'update';
  if (method === 'PUT') return 'create';
  if (method === 'DELETE') return 'delete';
  // satisfy type checker
  return 'read';
}

export function init(): Token {
  return {
    application: '<none>',
    bearer: '<none>',
    permissions: {
      create: [],
      read: [],
      update: [],
      delete: []
    },
    createdDate: new Date(0)
  };
}