import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let inMemoryUserRepository: InMemoryUsersRepository;
let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;

describe("AuthenticateUserUseCase", () => {
  beforeEach(async () => {
    inMemoryUserRepository = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(
      inMemoryUserRepository
    );
    createUserUseCase = new CreateUserUseCase(inMemoryUserRepository);

    await createUserUseCase.execute({
      name: "leandro",
      email: "teste@email.com",
      password: "123456",
    });
  });

  it("should be able to authenticate a user", async () => {
    const user = await authenticateUserUseCase.execute({
      email: "teste@email.com",
      password: "123456",
    });
    expect(user).toHaveProperty("token");
  });

  it("should not be able to authenticate a user if the password is wrong", async () => {
    await expect(
      authenticateUserUseCase.execute({
        email: "teste@email.com",
        password: "1234567",
      })
    ).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

  it("should not be able to authenticate a user if the user doesnt exist", async () => {
    await expect(
      authenticateUserUseCase.execute({
        email: "teste2@email.com",
        password: "123456",
      })
    ).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });
});
