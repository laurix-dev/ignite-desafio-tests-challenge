import { User } from "../../../users/entities/User";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { InsufficientFunds, UserNotFound } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

let inMemoryUserRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;

describe("CreateStatementUseCase", () => {
  let user: User;
  beforeEach(async () => {
    inMemoryUserRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUserRepository,
      inMemoryStatementsRepository
    );

    user = await inMemoryUserRepository.create({
      name: "leandro",
      email: "teste@email.com",
      password: "123456",
    });
  });

  it("should be able to create a statement", async () => {
    const statement = await createStatementUseCase.execute({
      user_id: user.id,
      amount: 500,
      description: "dummy description",
      type: OperationType.DEPOSIT,
    });

    expect(statement).toHaveProperty("id");
  });

  it("should not be able create statement if the user doesnt exist", async () => {
    await expect(
      createStatementUseCase.execute({
        user_id: "00000",
        amount: 500,
        description: "dummy description",
        type: OperationType.DEPOSIT,
      })
    ).rejects.toBeInstanceOf(UserNotFound);
  });

  it("should not be able to create withdraw statement if theres not enough balance", async () => {
    await expect(
      createStatementUseCase.execute({
        user_id: user.id,
        amount: 900,
        description: "dummy description",
        type: OperationType.WITHDRAW,
      })
    ).rejects.toBeInstanceOf(InsufficientFunds);
  });
});
