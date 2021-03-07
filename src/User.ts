
// Based on: https://firebase.google.com/docs/reference/admin/node/admin.auth.UserRecord
export default interface User {
  displayName: string;
  email: string;
  photoURL: string;
  unlimited_access: boolean;
}
