import { User } from "../../../users/entities/User";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let inMemoryUserRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let getBalanceUseCase: GetBalanceUseCase;

describe("GetBalanceUseCase", () => {
  let user: User;
  beforeEach(async () => {
    inMemoryUserRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    getBalanceUseCase = new GetBalanceUseCase(
      inMemoryStatementsRepository,
      inMemoryUserRepository
    );

    user = await inMemoryUserRepository.create({
      name: "leandro",
      email: "teste@email.com",
      password: "123456",
    });
  });

  it("should be able to get the user balance", async () => {
    const balance = await getBalanceUseCase.execute({
      user_id: user.id,
    });

    expect(balance).toHaveProperty("balance");
  });

  it("should not be able to get the user balance if the user doesnt exist", async () => {
    await expect(
      getBalanceUseCase.execute({
        user_id: "00000",
      })
    ).rejects.toBeInstanceOf(GetBalanceError);
  });
});
