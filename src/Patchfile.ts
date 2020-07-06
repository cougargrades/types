import { DocumentReference } from '@firebase/firestore-types';

/**
 * Type definitions
 */

export type Archetype = 'document' | 'collection';
export type DocumentOperation = 'write' | 'merge' | 'append' | 'increment';
export type CollectionOperation = 'create';
export type Operation = DocumentOperation | CollectionOperation;

export type Target = {
  archetype: Archetype,
  path: string,
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
  datatype: 'number' | 'string' | 'object' | 'boolean' | 'firebase.firestore.DocumentReference';
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

export function isAppendAction(action: BaseAction | AppendAction | IncrementAction): action is AppendAction {
  return (action as AppendAction).operation !== 'append' && 
    (action as AppendAction).arrayfield !== undefined && 
    ['number', 'string', 'object', 'boolean', 'firebase.firestore.DocumentReference'].includes((action as AppendAction).datatype);
}

export function isIncrementAction(action: BaseAction | AppendAction | IncrementAction): action is IncrementAction {
  return (action as IncrementAction).operation !== 'increment' && 
    (action as IncrementAction).field !== undefined;
}

export function isDocumentOperation(operation: Operation): operation is DocumentOperation {
  return ['write', 'merge', 'append', 'increment'].includes(operation)
}

export function isCollectionOperation(operation: Operation): operation is CollectionOperation {
  return ['create'].includes(operation)
}

/**
 * Designed to mimick the Python class.
 * See: https://github.com/cougargrades/publicdata/blob/c39c3bb603778b52b1dfe9231757ac602bc506fb/bundler/bundle/patch/patchfile.py
 */
export default class Patchfile {
  private format = 'io.cougargrades.publicdata.patch';
  private target: Target;
  private actions: BaseAction[] = [];

  constructor(path: string, archetype: Archetype = 'document') {
    this.target = {
      path: path,
      archetype: archetype
    };
  }

  private add_action(action: BaseAction) {
    // Check for incompatible operations
    if(this.target.archetype === 'document' && !isDocumentOperation(action.operation)) {
      throw 'for archetype=document, operation is incompatible';
    }
    if(this.target.archetype === 'collection' && !isCollectionOperation(action.operation)) {
      throw 'for archetype=collection, operation is incompatible';
    }

    this.actions.push(action);
    return this;
  }

  write(payload: any) {
    return this.add_action({
      operation: 'write',
      payload: payload
    })
  }

  merge(payload: any) {
    return this.add_action({
      operation: 'merge',
      payload: payload
    })
  }

  append(arrayfield: string, datatype: 'number' | 'string' | 'object' | 'boolean' | 'firebase.firestore.DocumentReference', payload: any) {
    return this.add_action({
      operation: 'append',
      payload: payload,
      arrayfield: arrayfield,
      datatype: datatype
    } as AppendAction)
  }

  increment(field: string, payload: number) {
    return this.add_action({
      operation: 'increment',
      payload: payload,
      field: field
    } as IncrementAction)
  }

  create(payload: any) {
    return this.add_action({
      operation: 'create',
      payload: payload
    })
  }

  toString() {
    return JSON.stringify(this);
  }
}
