/* eslint-disable max-classes-per-file */
import { AppError } from "../../../../shared/errors/AppError";

export class UserNotFound extends AppError {
  constructor() {
    super("User not found", 404);
  }
}

export class InsufficientFunds extends AppError {
  constructor() {
    super("Insufficient funds", 400);
  }
}
