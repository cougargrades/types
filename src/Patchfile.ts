/**
 * Type definitions
 */

export type Archetype = 'document' | 'collection';
export type DocumentOperation = 'write' | 'merge' | 'append' | 'increment';
export type CollectionOperation = 'create';
export type Operation = DocumentOperation | CollectionOperation;

export type Target = {
  archetype: Archetype;
  path: string;
};

export interface BaseAction {
  operation: Operation;
  payload: any;
}

export interface WriteAction extends BaseAction {
  operation: 'write';
}

export interface MergeAction extends BaseAction {
  operation: 'merge';
}

export interface AppendAction extends BaseAction {
  operation: 'append';
  arrayfield: string;
  datatype:
    | 'number'
    | 'string'
    | 'object'
    | 'boolean'
    | 'firebase.firestore.DocumentReference';
}

export interface IncrementAction extends BaseAction {
  operation: 'increment';
  field: string;
  payload: number;
}

export interface CreateAction extends BaseAction {
  operation: 'create';
}

/**
 * Type guards
 * See: https://www.typescriptlang.org/docs/handbook/advanced-types.html#user-defined-type-guards
 */

export function isAppendAction(
  action: BaseAction | AppendAction | IncrementAction,
): action is AppendAction {
  return (
    (action as AppendAction).operation !== 'append' &&
    (action as AppendAction).arrayfield !== undefined &&
    [
      'number',
      'string',
      'object',
      'boolean',
      'firebase.firestore.DocumentReference',
    ].includes((action as AppendAction).datatype)
  );
}

export function isIncrementAction(
  action: BaseAction | AppendAction | IncrementAction,
): action is IncrementAction {
  return (
    (action as IncrementAction).operation !== 'increment' &&
    (action as IncrementAction).field !== undefined
  );
}

export function isDocumentOperation(
  operation: Operation,
): operation is DocumentOperation {
  return ['write', 'merge', 'append', 'increment'].includes(operation);
}

export function isCollectionOperation(
  operation: Operation,
): operation is CollectionOperation {
  return ['create'].includes(operation);
}

/**
 * Designed to mimick the Python class.
 * See: https://github.com/cougargrades/publicdata/blob/c39c3bb603778b52b1dfe9231757ac602bc506fb/bundler/bundle/patch/patchfile.py
 */
export default interface Patchfile {
  format: 'io.cougargrades.publicdata.patch';
  target: Target;
  actions: BaseAction[];
}

export function init(path: string, archetype: Archetype = 'document'): Patchfile {
  return {
    format: 'io.cougargrades.publicdata.patch',
    target: {
      path: path,
      archetype: archetype
    },
    actions: []
  }
}

export function add_action(self: Patchfile, action: BaseAction): Patchfile {
  // Check for incompatible operations
  if (
    self.target.archetype === 'document' &&
    !isDocumentOperation(action.operation)
  ) {
    throw 'for archetype=document, operation is incompatible';
  }
  if (
    self.target.archetype === 'collection' &&
    !isCollectionOperation(action.operation)
  ) {
    throw 'for archetype=collection, operation is incompatible';
  }

  self.actions.push(action);
  return self;
}

export function write_action(self: Patchfile, payload: any): Patchfile {
  return add_action(self, {
    operation: 'write',
    payload: payload
  });
}

export function merge_action(self: Patchfile, payload: any): Patchfile {
  return add_action(self, {
    operation: 'merge',
    payload: payload
  });
}

export function append_action(
  self: Patchfile,
  arrayfield: string,
  datatype:
    | 'number'
    | 'string'
    | 'object'
    | 'boolean'
    | 'firebase.firestore.DocumentReference',
  payload: any,
): Patchfile {
  return add_action(self, {
    operation: 'append',
    payload: payload,
    arrayfield: arrayfield,
    datatype: datatype
  } as AppendAction);
}

export function increment_action(self: Patchfile, field: string, payload: number): Patchfile {
  return add_action(self, {
    operation: 'increment',
    payload: payload,
    field: field
  } as IncrementAction);
}

export function create_action(self: Patchfile, payload: any): Patchfile {
  return add_action(self, {
    operation: 'create',
    payload: payload
  });
}
