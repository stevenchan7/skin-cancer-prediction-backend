export default class InputError extends Error {
  status: number;
  constructor(message: string) {
    super(message);
    this.status = 413;

    Object.setPrototypeOf(this, InputError.prototype);
  }
}
