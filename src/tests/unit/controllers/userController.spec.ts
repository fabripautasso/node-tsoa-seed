import { UserController } from "../../../controllers";
import { anything, instance, mock, verify, when } from "ts-mockito";
import { UserService } from "../../../services";
import { generateMockUUID, generateUserModel } from "../../../utils/models";
import { expect } from "chai";

describe("UserController tests", () => {
  let controller: UserController;
  let service: UserService;

  const model = generateUserModel();
  const userId = generateMockUUID();

  before(async () => {
    service = mock(UserService);

    controller = new UserController(instance(service));
  });

  it("should getById without errors", async () => {
    when(service.getById(userId)).thenReturn(Promise.resolve(model));
    const result = await controller.getById(userId);
    expect(result).to.have.property("id");
    expect(result).to.have.property("name");
    expect(result).to.have.property("email");
    expect(result).to.have.property("phone");
    expect(result).to.have.property("skype");
  });

  it("should getPaginated", async () => {
    await controller.getPaginated(0, 0, null, null, "ASC");
    verify(service.getPaginated(anything())).called();
  });

  it("should create", async () => {
    await controller.create(model);
    verify(service.create(anything())).called();
  });

  it("should update", async () => {
    await controller.update(model.id, model);
    verify(service.update(model.id, model)).called();
  });

  it("should delete", async () => {
    await controller.delete(userId);
    verify(service.delete(userId)).called();
  });
});
