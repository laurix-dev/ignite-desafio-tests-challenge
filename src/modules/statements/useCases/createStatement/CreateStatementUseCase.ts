import { inject, injectable } from "tsyringe";

import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { InsufficientFunds, UserNotFound } from "./CreateStatementError";
import { ICreateStatementDTO } from "./ICreateStatementDTO";

@injectable()
export class CreateStatementUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,

    @inject("StatementsRepository")
    private statementsRepository: IStatementsRepository
  ) {}

  async execute({ user_id, type, amount, description }: ICreateStatementDTO) {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new UserNotFound();
    }

    if (type === "withdraw") {
      const { balance } = await this.statementsRepository.getUserBalance({
        user_id,
      });

      if (balance < amount) {
        throw new InsufficientFunds();
      }
    }

    const statementOperation = await this.statementsRepository.create({
      user_id,
      type,
      amount,
      description,
    });

    return statementOperation;
  }
}
