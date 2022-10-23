import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";

let inMemoryUserRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("CreateUserUseCase", () => {
  beforeEach(async () => {
    inMemoryUserRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUserRepository);
  });

  it("should be able to create a user", async () => {
    const user = await createUserUseCase.execute({
      name: "leandro",
      email: "teste@email.com",
      password: "123456",
    });
    expect(user).toHaveProperty("id");
  });

  it("should not be able to create a user that already exists", async () => {
    await createUserUseCase.execute({
      name: "leandro",
      email: "teste@email.com",
      password: "123456",
    });

    await expect(
      createUserUseCase.execute({
        name: "leandro",
        email: "teste@email.com",
        password: "123456",
      })
    ).rejects.toBeInstanceOf(CreateUserError);
  });
});
