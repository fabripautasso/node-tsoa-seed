export interface IPaginationDto { /** tsoa doesn't like generics */
  count: number;
  page: number;
  limit: number;
  sort: string;
  filter: string;
  totalPages: number;
  docs: any[];
}

export class PaginationDto implements IPaginationDto {
  public count: number;
  public page: number;
  public limit: number;
  public totalPages: number;
  public docs: any[];
  public filter: string;
  public sort: string;

  constructor(args: IPaginationDto) {
    Object.assign(this, args);
  }
}
