import {
  Route,
  Controller,
  Get,
  Put,
  Post,
  Delete,
  Security,
  Query,
  Body,
  Response,
  Tags
} from "tsoa";

import { ProvideSingleton, inject } from "../ioc";
import { IUserDto, IPaginationDto } from "../services/dto";
import { UserService } from "../services";

@Tags("users")
@Route("users")
@ProvideSingleton(UserController)
export class UserController extends Controller {
  constructor(@inject(UserService) private service: UserService) {
    super();
  }

  /**
   * @summary Retrieves the user by id
   *
   * @param {string} id The id of the user
   */
  @Get("{id}")
  public async getById(id: string): Promise<IUserDto> {
    return this.service.getById(id);
  }

  /**
   * @summary Retrieves a paginated list of users
   *
   * @param {number} page number of pages
   * @param {number} limit pages limit
   * @param {string} sort sort order ASC|DESC
   * @param {string} field field to search for
   * @param {string} filter expression to be used for filter
   */
  @Get()
  public async getPaginated(
    @Query("page") page: number,
    @Query("limit") limit: number,
    @Query("sort") sort?: string,
    @Query("field") field?: string,
    @Query("filter") filter?: string
  ): Promise<IPaginationDto> {
    return this.service.getPaginated({ page, limit, sort, field, filter });
  }

  /**
   * @summary Creates a new user
   *
   * @param {IUserDto} body dto with the new user info
   */
  @Response(400, "Bad request")
  @Security("admin")
  @Post()
  public async create(@Body() body: IUserDto): Promise<IUserDto> {
    return this.service.create(body);
  }

  /**
   * @summary Updates user info
   *
   * @param {string} id The id of the user
   * @param {IUserDto} body dto with the updated user info
   */
  @Response(400, "Bad request")
  @Security("admin")
  @Put("{id}")
  public async update(id: string, @Body() body: IUserDto): Promise<IUserDto> {
    return this.service.update(id, body);
  }

  /**
   * @summary Deletes user from DB
   *
   * @param {string} id The id of the user
   */
  @Security("admin")
  @Delete("{id}")
  public async delete(id: string): Promise<string> {
    return this.service.delete(id);
  }
}
