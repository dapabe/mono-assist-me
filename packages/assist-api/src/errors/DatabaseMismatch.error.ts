export class DatabaseMismatchError extends Error {
  constructor(
    public readonly currentVersion: number,
    public readonly appVersion: number
  ) {
    super();
    this.name = 'DatabaseMismatchError';
  }
}
