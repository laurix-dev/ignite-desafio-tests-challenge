import { User } from "../../../users/entities/User";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { OperationType, Statement } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let inMemoryUserRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let getStatementOperationUseCase: GetStatementOperationUseCase;

describe("GetStatementOperationUseCase", () => {
  let user: User;
  let statement: Statement;
  beforeEach(async () => {
    inMemoryUserRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    getStatementOperationUseCase = new GetStatementOperationUseCase(
      inMemoryUserRepository,
      inMemoryStatementsRepository
    );

    user = await inMemoryUserRepository.create({
      name: "leandro",
      email: "teste@email.com",
      password: "123456",
    });

    statement = await inMemoryStatementsRepository.create({
      user_id: user.id,
      amount: 500,
      description: "dummy description",
      type: OperationType.DEPOSIT,
    });
  });

  it("should be able to get the user statement", async () => {
    const userStatement = await getStatementOperationUseCase.execute({
      user_id: user.id,
      statement_id: statement.id,
    });

    expect(userStatement).toHaveProperty("id");
    expect(userStatement.user_id).toEqual(user.id);
  });

  it("should not be able to get the user statement if the user doesnt exist", async () => {
    await expect(
      getStatementOperationUseCase.execute({
        user_id: "0000000",
        statement_id: statement.id,
      })
    ).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
  });

  it("should not be able to get the user statement if the statement doesnt exist", async () => {
    await expect(
      getStatementOperationUseCase.execute({
        user_id: user.id,
        statement_id: "0000000",
      })
    ).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
  });
});
