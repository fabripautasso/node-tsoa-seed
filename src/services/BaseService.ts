import { decorate, injectable } from "inversify";
import { PaginationDto } from "./dto";

export abstract class BaseService<EntityModel> {
  public abstract getById(id: string): Promise<EntityModel>;

  public abstract getPaginated(
    page: number,
    limit: number,
    sort: string,
    field: string,
    filter: string
  ): Promise<PaginationDto>;

  public abstract create(entity: EntityModel): Promise<EntityModel>;

  public abstract update(id: string, entity: EntityModel): Promise<EntityModel>;

  public abstract delete(id: string): Promise<string>;
}

decorate(injectable(), BaseService);
