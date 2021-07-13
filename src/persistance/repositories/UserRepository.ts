import { ProvideSingleton } from "../../ioc";
import { IUserDto } from "../../services/dto";
import { User } from "../entities/User";
import { EntityRepository, getRepository } from "typeorm";

@ProvideSingleton(UserRepository)
@EntityRepository()
export class UserRepository {
  private repository;
  constructor() {
    this.repository = getRepository(User);
  }
  public async findOne(id: string): Promise<User> {
    return await this.repository.findOne(id);
  }

  public async save(user: User): Promise<User> {
    return await this.repository.save(user);
  }

  public async create(user: IUserDto): Promise<User> {
    return await this.repository.create(user);
  }

  public async update(id: string, entity: IUserDto) {
    return await this.repository.update(id, entity);
  }

  public async delete(id: string): Promise<string> {
    let result = await this.repository.delete(id);
    return JSON.parse(JSON.stringify(result));
  }

  public async getCount(field: string, filter: string): Promise<number> {
    return await this.repository
      .createQueryBuilder("user")
      .where(`${field} like :filter`, { filter: filter })
      .select("DISTINCT(`id`)")
      .getCount();
  }

  public async getMany(
    page: number,
    field: string,
    filter: string,
    sort: "ASC" | "DESC",
    limit: number
  ): Promise<User[]> {
    return await this.repository
      .createQueryBuilder("user")
      .skip(page * limit)
      .take(limit)
      .where(`${field} like :filter`, { filter: filter })
      .orderBy(field, sort)
      .getMany();
  }
}
