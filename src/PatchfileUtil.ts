import { FieldValue, Firestore, Transaction } from './FirestoreStubs';

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
  // check for actions which require something to already exist
  for(const action of patch.actions) {
    if (action.operation === 'append')
      if(! await checkPossiblePatchAppendOperation(db, patch, action as AppendAction))
        throw `[PatchfileUtil] Patchfile execution isn't possible: ${action.operation} won't be able complete.`;
      if (action.operation === 'increment')
        if(! await checkPossiblePatchIncrementOperation(db, patch, action as IncrementAction))
          throw `[PatchfileUtil] Patchfile execution isn't possible: ${action.operation} won't be able complete.`;
  }
  // execute actions
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
  const snap = await txn.get(ref);
  const temp: { [key: string]: any } = {};

  if(snap.exists) {
    if(Array.isArray(snap.data()![action.arrayfield])) {
      if(action.datatype === 'firebase.firestore.DocumentReference') {
        if(action.many) {
          const refsToAppend = Array.from(action.payload).map(e => db.doc(e as string))
          temp[action.arrayfield] = fieldValue.arrayUnion(refsToAppend)
        }
        else {
          const refToAppend = db.doc(action.payload);
          temp[action.arrayfield] = fieldValue.arrayUnion(refToAppend);
        }
      }
      else {
        // doesn't matter what action.many is, payload is of type any
        temp[action.arrayfield] = fieldValue.arrayUnion(action.payload);
      }
      await txn.update(ref, temp);
    }
    else {
      throw "Append operation failed: Target field was not an array";
    }
  }
  else {
    throw "Append operation failed: Target was undefined.";
  }
}

async function checkPossiblePatchAppendOperation(
  db: Firestore,
  patch: Patchfile,
  action: AppendAction,
): Promise<boolean> {
  const ref = db.doc(patch.target.path);
  const snap = await ref.get();
  if(snap.exists) {
    if(Array.isArray(snap.data()![action.arrayfield])) {
      return true;
    }
    else {
      console.warn('[PatchfileUtil] Append operation would have failed: Target field was not an array');
      return false;
    }
  }
  else {
    console.warn('[PatchfileUtil] Append operation would have failed: Target was undefined.');
    return false;
  }
}

async function commitPatchIncrementOperation(
  db: Firestore,
  txn: Transaction,
  fieldValue: FieldValue,
  patch: Patchfile,
  action: IncrementAction,
) {
  const ref = db.doc(patch.target.path);
  const snap = await txn.get(ref);
  const temp: { [key: string]: any } = {};

  if(snap.exists) {
    if(! isNaN(snap.data()![action.field])) {
      temp[action.field] = fieldValue.increment(action.payload);
      await txn.update(ref, temp);
    }
    else {
      throw "Increment operation failed: Target field was not a number";
    }
  }
  else {
    throw "Increment operation failed: Target was undefined.";
  }
}

async function checkPossiblePatchIncrementOperation(
  db: Firestore,
  patch: Patchfile,
  action: IncrementAction,
) {
  const ref = db.doc(patch.target.path);
  const snap = await ref.get();
  const temp: { [key: string]: any } = {};

  if(snap.exists) {
    if(! isNaN(snap.data()![action.field])) {
      return true;
    }
    else {
      console.warn('[PatchfileUtil] Increment operation would have failed: Target field was not a number');
      return false;
    }
  }
  else {
    console.warn('[PatchfileUtil] Increment operation would have failed: Target was undefined.');
    return false;
  }
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