export class MissingLocalDataError extends Error {
  constructor() {
    super();
    this.name = 'MissingLocalDataError';
  }
}
