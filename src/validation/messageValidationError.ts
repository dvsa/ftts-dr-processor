import { ValidationError } from './validateSchema';

export class MessageValidationError extends Error {
  constructor(message?: string, public validationErrors?: ValidationError[]) {
    super(message);
    this.name = this.constructor.name;
  }
}
