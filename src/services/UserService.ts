import { ProvideSingleton } from "../ioc";
import { BaseService } from "./BaseService";
import { IUserDto, PaginationDto } from "./dto";
import { isNil } from "lodash";
import { inject } from "inversify";
import { UserRepository } from "../persistance/repositories/UserRepository";

@ProvideSingleton(UserService)
export class UserService extends BaseService<IUserDto> {
  constructor(@inject(UserRepository) private userRepository: UserRepository) {
    super();
  }

  public async getById(id: string): Promise<IUserDto> {
    return await this.userRepository.findOne(id);
  }

  public async create(entity: IUserDto): Promise<IUserDto> {
    const user = await this.userRepository.create(entity);
    return await this.userRepository.save(user);
  }

  public async getPaginated(args: any): Promise<PaginationDto> {
    let page = args.page >= 0 ? args.page : 0;
    let filter = isNil(args.filter) ? "%" : "%" + args.filter + "%";
    let field = isNil(args.field) ? "user.email" : "user." + args.field;
    let sort = args.sort ? args.sort.toUpperCase() : "ASC";

    const count = await this.userRepository.getCount(field, filter);

    let data = await this.userRepository.getMany(
      page,
      field,
      filter,
      sort,
      args.limit
    );

    return new PaginationDto({
      count: count,
      page: page,
      limit: args.limit,
      sort: sort,
      filter: args.filter,
      totalPages: Math.ceil(count / args.limit),
      docs: data
    });
  }

  public async delete(id: string): Promise<any> {
    return await this.userRepository.delete(id);
  }

  public async update(id: string, entity: IUserDto): Promise<IUserDto> {
    const fieldsToUpdate = JSON.parse(JSON.stringify(entity));

    await this.userRepository.update(id, fieldsToUpdate);
    return await this.userRepository.findOne(id);
  }
}
