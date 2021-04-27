import { Firestore, Transaction, FieldValue } from './FirestoreStubs';

import { AppendAction, Archetype, BaseAction, CollectionOperation, CreateAction, DocumentOperation, IncrementAction, MergeAction, Operation, Patchfile, WriteAction } from './Patchfile';

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
 * Patchfile composition
 */

export function init(
  path: string,
  archetype: Archetype = 'document',
): Patchfile {
  return {
    format: 'io.cougargrades.publicdata.patch',
    target: {
      path: path,
      archetype: archetype,
    },
    actions: [],
  };
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
    payload: payload,
  });
}

export function merge_action(self: Patchfile, payload: any): Patchfile {
  return add_action(self, {
    operation: 'merge',
    payload: payload,
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
    datatype: datatype,
  } as AppendAction);
}

export function increment_action(
  self: Patchfile,
  field: string,
  payload: number,
): Patchfile {
  return add_action(self, {
    operation: 'increment',
    payload: payload,
    field: field,
  } as IncrementAction);
}

export function create_action(self: Patchfile, payload: any): Patchfile {
  return add_action(self, {
    operation: 'create',
    payload: payload,
  });
}

/**
 * Patchfile execution
 */
export async function executePatchFile(db: Firestore, fieldValue: FieldValue, patch: Patchfile) {
  await db.runTransaction(async (txn) => {
    for (const action of patch.actions) {
      if (action.operation === 'write')
        await commitPatchWriteOperation(db, txn, patch, action as WriteAction);
      if (action.operation === 'merge')
        await commitPatchMergeOperation(db, txn, patch, action as MergeAction);
      if (action.operation === 'append')
        await commitPatchAppendOperation(db, txn, fieldValue, patch, action as AppendAction);
      if (action.operation === 'increment')
        await commitPatchIncrementOperation(db, txn, fieldValue, patch, action as IncrementAction);
      if (action.operation === 'create')
        await commitPatchCreateOperation(db, txn, patch, action as CreateAction);
    }
    return txn;
  });
}

/**
 * Document exclusive operations
 */
async function commitPatchWriteOperation(
  db: Firestore,
  txn: Transaction,
  patch: Patchfile,
  action: WriteAction,
) {
  const ref = db.doc(patch.target.path);
  await txn.set(ref, action.payload, { merge: false });
}

async function commitPatchMergeOperation(
  db: Firestore,
  txn: Transaction,
  patch: Patchfile,
  action: MergeAction,
) {
  const ref = db.doc(patch.target.path);
  const snap = await txn.get(ref);
  if (snap.exists) {
    await txn.set(ref, action.payload, { merge: true });
  }
}

async function commitPatchAppendOperation(
  db: Firestore,
  txn: Transaction,
  fieldValue: FieldValue,
  patch: Patchfile,
  action: AppendAction,
) {
  const ref = db.doc(patch.target.path);
  const temp: any = {};

  if(action.datatype === 'firebase.firestore.DocumentReference') {
    const refToAppend = db.doc(action.payload);
    temp[action.arrayfield] = fieldValue.arrayUnion(refToAppend);
  }
  else {
    temp[action.arrayfield] = fieldValue.arrayUnion(action.payload);
  }

  await txn.update(ref, temp);
}

async function commitPatchIncrementOperation(
  db: Firestore,
  txn: Transaction,
  fieldValue: FieldValue,
  patch: Patchfile,
  action: IncrementAction,
) {
  const ref = db.doc(patch.target.path);

  const temp: any = {};
  temp[action.field] = fieldValue.increment(action.payload);

  await txn.update(ref, temp);
}

/**
 * Collection exclusive operations
 */
async function commitPatchCreateOperation(
  db: Firestore,
  txn: Transaction,
  patch: Patchfile,
  action: CreateAction,
) {
  const collection = db.collection(patch.target.path);
  
  await txn.set(collection.doc(), action.payload);
}