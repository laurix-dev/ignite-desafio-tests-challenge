import { User } from "modules/users/entities/User";

import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let inMemoryUserRepository: InMemoryUsersRepository;
let showUserProfileUseCase: ShowUserProfileUseCase;
let createUserUseCase: CreateUserUseCase;

describe("ShowUserProfileUseCase", () => {
  let user: User;
  beforeEach(async () => {
    inMemoryUserRepository = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUserRepository);
    createUserUseCase = new CreateUserUseCase(inMemoryUserRepository);

    user = await createUserUseCase.execute({
      name: "leandro",
      email: "teste@email.com",
      password: "123456",
    });
  });

  it("should be able to show a user profile given its id", async () => {
    const res = await showUserProfileUseCase.execute(user.id);
    expect(res).toHaveProperty("id");
  });

  it("should not be able show a user profile if the user doesnt exist", async () => {
    await expect(
      showUserProfileUseCase.execute("000000")
    ).rejects.toBeInstanceOf(ShowUserProfileError);
  });
});
