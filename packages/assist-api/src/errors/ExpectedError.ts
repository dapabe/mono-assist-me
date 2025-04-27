type Key = 'db.missingLocalData' | 'db.drizzleNoInit';
export class ExpectedError extends Error {
  constructor(public key: Key) {
    super();
    this.name = 'ExpectedError';
  }
}
