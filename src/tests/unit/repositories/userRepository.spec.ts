import { expect } from "chai";
import { UserRepository } from "../../../persistance/repositories/UserRepository";
import { DataType, newDb } from "pg-mem";
import { User } from "../../../persistance/entities/User";
import v4 = require("uuid/v4");

describe("UserRepository tests", () => {
  let repository;
  let userId;

  let db = newDb({ autoCreateForeignKeyIndices: true });
  let backup;
  let orm;
  before(async () => {
    if (orm) await orm.close;
    orm = await db.adapters.createTypeormConnection({
      type: "postgres",
      entities: [User]
    });
    db.public.registerFunction({
      name: "uuid_generate_v4",
      returns: DataType.uuid,
      implementation: v4
    });
    if (!backup) {
      await orm.synchronize();

      backup = db.backup();
    } else {
      backup.restore();
    }

    repository = new UserRepository();
  });

  it("should create and save", async () => {
    const createResult = await repository.create({
      email: "test@mail.com",
      name: "name",
      phone: "1234",
      skype: "test.skype"
    });
    const result = await repository.save(createResult);
    expect(result).to.have.property("id");
    expect(result).to.have.property("email");
    expect(result).to.have.property("name");
    expect(result).to.have.property("phone");
    expect(result).to.have.property("skype");
    userId = result.id;
  });

  it("should find by one by id", async () => {
    await repository.findOne(userId);
  });

  it("should update", async () => {
    const result = await repository.update(userId, { skype: "skype.test" });
    expect(result != null).eq(true);
  });

  it("should get count", async () => {
    const result = await repository.getCount("email", "test@mail.com");
    expect(result != null).eq(true);
  });

  it("should get many", async () => {
    const result = await repository.getMany(1, "user.name", "name", "ASC", 1);
    expect(result != null).eq(true);
  });

  it("should delete", async () => {
    await repository.delete(userId);
  });
});
