/**
 * BE WARNED
 * 
 * These "stub" types exist because the front-end Firebase
 * JS SDK types aren't automatically compatible with the
 * back-end Firebase Admin SDK. 
 * 
 * See: https://stackoverflow.com/q/55578927
 * 
 * However, they're still incredibly similar enough
 * and I'm stubborn enough that I want to write code once
 * that runs in both places.
 * 
 * So, these are shrunken down versions of the Firebase
 * JS SDK types and back-end Firebase Admin SDK. This is
 * super ghetto and not future proof, but I think it's
 * actually a little clever.
 * 
 * You'll notice that a lot of fields are missing. That's
 * because I only copied the fields that I'm using.
 * 
 * Front-end types based on: https://unpkg.com/browse/@firebase/firestore-types@2.2.0/index.d.ts
 * Back-end types based on: https://unpkg.com/browse/@google-cloud/firestore@4.10.0/types/firestore.d.ts
 */

// From: https://stackoverflow.com/a/63874264
export type CommonByName<A, B> = Pick<
  A,
  {
    [K in keyof A & keyof B]: A[K] extends B[K]
    ? B[K] extends A[K]
    ? K
    : never
    : never;
  }[keyof A & keyof B]
>;

// From: https://stackoverflow.com/a/47379147
export type CommonByType<A, B> = {
  [P in keyof A & keyof B]: A[P] | B[P];
}

export type DocumentData = { [field: string]: any };

export type UpdateData = { [fieldPath: string]: any };

export type SetOptions = {
  readonly merge?: boolean;
}

/**
 * A WriteResult wraps the write time set by the Firestore servers on `sets()`,
 * `updates()`, and `creates()`.
 */
export type WriteResult = {

  /**
   * The write time as set by the Firestore servers.
   */
  //readonly writeTime: Timestamp;
} 

/**
 * A `DocumentReference` refers to a document location in a Firestore database
 * and can be used to write, read, or listen to the location. The document at
 * the referenced location may or may not exist. A `DocumentReference` can
 * also be used to create a `CollectionReference` to a subcollection.
 */
export type DocumentReference<T = DocumentData> = {
  /** The identifier of the document within its collection. */
  readonly id: string;
  /**
   * A reference to the Collection to which this DocumentReference belongs.
   */
  readonly parent: CollectionReference<T>;
  /**
   * A string representing the path of the referenced document (relative
   * to the root of the database).
   */
  readonly path: string;

  /**
   * Writes to the document referred to by this `DocumentReference`. If the
   * document does not yet exist, it will be created. If you pass
   * `SetOptions`, the provided data can be merged into an existing document.
   *
   * @param data A map of the fields and values for the document.
   * @param options An object to configure the set behavior.
   * @return A Promise resolved with the write time of this set.
   */
  set(data: Partial<T>, options: SetOptions): Promise<void | WriteResult>;
  set(data: T): Promise<void | WriteResult>;

  /**
   * Updates fields in the document referred to by this `DocumentReference`.
   * The update will fail if applied to a document that does not exist.
   *
   * Nested fields can be updated by providing dot-separated field path
   * strings.
   *
   * @param data An object containing the fields and values with which to
   * update the document.
   * @return A Promise resolved with the write time of this update.
   */
  update(data: UpdateData): Promise<void | WriteResult>;

  /**
   * Deletes the document referred to by this `DocumentReference`.
   *
   * @return A Promise resolved with the write time of this delete.
   */
  delete(): Promise<void | WriteResult>;

  /**
   * Reads the document referred to by this `DocumentReference`.
   *
   * @return A Promise resolved with a DocumentSnapshot containing the
   * current document contents.
   */
  get(): Promise<DocumentSnapshot<T>>;
};

/**
 * A `DocumentSnapshot` contains data read from a document in your Firestore
 * database. The data can be extracted with `.data()` or `.get(<field>)` to
 * get a specific field.
 *
 * For a `DocumentSnapshot` that points to a non-existing document, any data
 * access will return 'undefined'. You can use the `exists` property to
 * explicitly verify a document's existence.
 */
export type DocumentSnapshot<T = DocumentData> = {
  /** True if the document exists. */
  readonly exists: boolean;
  /** A `DocumentReference` to the document location. */
  readonly ref: DocumentReference<T>;
  /**
   * The ID of the document for which this `DocumentSnapshot` contains data.
   */
  readonly id: string;

  /**
   * Retrieves all fields in the document as an Object. Returns 'undefined' if
   * the document doesn't exist.
   *
   * @return An Object containing all fields in the document.
   */
  data(): T | undefined;
}

/**
 * A `CollectionReference` object can be used for adding documents, getting
 * document references, and querying for documents (using the methods
 * inherited from `Query`).
 */
export type CollectionReference<T = DocumentData> = {
  /** The identifier of the collection. */
  readonly id: string;
  /**
   * A reference to the containing Document if this is a subcollection, else
   * null.
   */
  readonly parent: DocumentReference<DocumentData> | null;
  /**
   * A string representing the path of the referenced collection (relative
   * to the root of the database).
   */
  readonly path: string;

  /**
   * Get a `DocumentReference` for the document within the collection at the
   * specified path. If `documentPath` is not specified, an automatically-generated
   * unique ID will be used as the document ID.
   *
   * @param documentPath A slash-separated path to a document.
   * @return The `DocumentReference` instance.
   */
  doc(documentPath?: string): DocumentReference<T>;
  /**
   * Add a new document to this collection with the specified data, assigning
   * it a document ID automatically.
   *
   * @param data An Object containing the data for the new document.
   * @return A Promise resolved with a `DocumentReference` pointing to the
   * newly created document after it has been written to the backend.
   */
  add(data: T): Promise<DocumentReference<T>>;
}

/**
 * `Firestore` represents a Firestore Database and is the entry point for all
 * Firestore operations.
 */
export type Firestore = {
  /**
   * Gets a `DocumentReference` instance that refers to the document at the
   * specified path.
   *
   * @param documentPath A slash-separated path to a document.
   * @return The `DocumentReference` instance.
   */
  doc(documentPath: string): DocumentReference<DocumentData>;

  /**
   * Gets a `CollectionReference` instance that refers to the collection at
   * the specified path.
   *
   * @param collectionPath A slash-separated path to a collection.
   * @return The `CollectionReference` instance.
   */
  collection(collectionPath: string): CollectionReference<DocumentData>;

  /**
   * Executes the given updateFunction and commits the changes applied within
   * the transaction.
   *
   * You can use the transaction object passed to 'updateFunction' to read and
   * modify Firestore documents under lock. Transactions are committed once
   * 'updateFunction' resolves and attempted up to five times on failure.
   *
   * @param updateFunction The function to execute within the transaction
   * context.
   * @return If the transaction completed successfully or was explicitly
   * aborted (by the updateFunction returning a failed Promise), the Promise
   * returned by the updateFunction will be returned here. Else if the
   * transaction failed, a rejected Promise with the corresponding failure
   * error will be returned.
   */
  runTransaction<T>(
    updateFunction: (transaction: Transaction) => Promise<T>
  ): Promise<T>;
}

/**
 * A reference to a transaction.
 * The `Transaction` object passed to a transaction's updateFunction provides
 * the methods to read and write data within the transaction context. See
 * `Firestore.runTransaction()`.
 */
export type Transaction = {
  /**
   * Reads the document referenced by the provided `DocumentReference.`
   * Holds a pessimistic lock on the returned document.
   *
   * @param documentRef A reference to the document to be read.
   * @return A DocumentSnapshot for the read data.
   */
  get<T>(documentRef: DocumentReference<T>): Promise<DocumentSnapshot<T>>;

  /**
   * Writes to the document referred to by the provided `DocumentReference`.
   * If the document does not exist yet, it will be created. If you pass
   * `SetOptions`, the provided data can be merged into the existing document.
   *
   * @param documentRef A reference to the document to be set.
   * @param data An object of the fields and values for the document.
   * @param options An object to configure the set behavior.
   * @return This `Transaction` instance. Used for chaining method calls.
   */
  set<T>(
    documentRef: DocumentReference<T>,
    data: Partial<T>,
    options: SetOptions
  ): Transaction;
  set<T>(documentRef: DocumentReference<T>, data: T): Transaction;

  /**
   * Updates fields in the document referred to by the provided
   * `DocumentReference`. The update will fail if applied to a document that
   * does not exist.
   *
   * Nested fields can be updated by providing dot-separated field path
   * strings.
   *
   * @param documentRef A reference to the document to be updated.
   * @param data An object containing the fields and values with which to
   * update the document.
   * @return This `Transaction` instance. Used for chaining method calls.
   */
  update(documentRef: DocumentReference<any>, data: UpdateData): Transaction;

  /**
   * Deletes the document referred to by the provided `DocumentReference`.
   *
   * @param documentRef A reference to the document to be deleted.
   * @return This `Transaction` instance. Used for chaining method calls.
   */
  delete(documentRef: DocumentReference<any>): Transaction;
}

// Acquire native FieldValue types
import { default as firebase } from 'firebase';
import FrontFieldValue = firebase.firestore.FieldValue;
import * as admin from 'firebase-admin';
import AdminFieldValue = admin.firestore.FieldValue;

// Export the things
export type FieldValue = FrontFieldValue | AdminFieldValue;
export { FrontFieldValue, AdminFieldValue };
export { isNode } from 'browser-or-node';
