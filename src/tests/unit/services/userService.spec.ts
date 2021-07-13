import { generateMockUUID, generateUserModel } from "../../../utils/models";
import { UserService } from "../../../services";
import { UserRepository } from "../../../persistance/repositories/UserRepository";
import { anything, instance, mock, verify, when } from "ts-mockito";
import { expect } from "chai";

describe("UserService tests", () => {
  let service: UserService;
  let repository: UserRepository;

  const userId = generateMockUUID();

  before(async () => {
    repository = mock(UserRepository);
    service = new UserService(instance(repository));
  });

  it("should create", async () => {
    const model = generateUserModel();
    when(repository.create(model)).thenReturn(anything());
    when(repository.save(anything())).thenReturn(Promise.resolve(model));

    await service.create(model);

    verify(repository.save(anything())).called();
  });

  it("should update", async () => {
    await service.update(userId, generateUserModel());
    verify(repository.update(userId, anything())).called();
    verify(repository.findOne(userId)).called();
  });

  it("should getPaginated", async () => {
    let page = 0;
    let field = null;
    let filter = null;

    await service.getPaginated({
      page: page,
      field: field,
      filter: filter,
      sort: "ASC"
    });
    verify(repository.getCount("user.email", "%")).called();
    verify(repository.getMany(page, "user.email", "%", "ASC", anything()));
  });

  it("should getPaginated and replace bad parameters", async () => {
    let page = -1;
    let field = "phone";
    let filter = "skype";
    await service.getPaginated({
      page: page,
      field: field,
      filter: filter
    });
    verify(repository.getCount("user.phone", "%skype%")).called();
    verify(repository.getMany(0, "user.phone", "%skype%", "ASC", anything()));
  });

  it("should getById", async () => {
    const userModel = generateUserModel();
    when(repository.findOne(userId)).thenReturn(Promise.resolve(userModel));
    const result = await service.getById(userId);
    verify(repository.findOne(userId)).called();
    expect(result).to.equal(userModel);
  });

  it("should delete", async () => {
    await service.delete(userId);
    verify(repository.delete(userId)).called();
  });
});
