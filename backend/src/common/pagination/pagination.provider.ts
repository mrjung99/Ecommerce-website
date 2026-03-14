import { Inject, Injectable } from '@nestjs/common';
import { PaginationDto } from './dto/pagination-query.dto';
import {
  FindManyOptions,
  FindOptionsWhere,
  ObjectLiteral,
  Repository,
} from 'typeorm';
import type { Request } from 'express';
import { REQUEST } from '@nestjs/core';
import { Paginated } from './pagination.interface';

@Injectable()
export class PaginationProvider {
  constructor(
    @Inject(REQUEST)
    private readonly request: Request,
  ) {}

  public async paginationQuery<T extends ObjectLiteral>(
    paginationDto: PaginationDto,
    repository: Repository<T>,
    where?: FindOptionsWhere<T>,
  ): Promise<Paginated<T>> {
    const findOptions: FindManyOptions<T> = {
      skip: ((paginationDto.page ?? 1) - 1) * (paginationDto.limit ?? 10),
      take: paginationDto.limit ?? 10,
    };

    if (where) {
      findOptions.where = where;
    }
    const result = await repository.find(findOptions);

    const totalItems = await repository.count();
    const totalPages = Math.ceil(totalItems / (paginationDto.limit ?? 10));
    const currentPage = paginationDto.page;
    const nextPages =
      currentPage === totalPages ? paginationDto.page : (currentPage ?? 1) + 1;
    const previousPage =
      currentPage === 1 ? currentPage : (currentPage ?? 1) - 1;
    const baseUrl =
      this.request.protocol + '://' + this.request.headers.host + '/';
    const newUrl = new URL(this.request.url, baseUrl);

    const response: Paginated<T> = {
      data: result,
      meta: {
        itemsPerPage: paginationDto.limit ?? 10,
        totalItems: totalItems,
        totalPage: totalPages,
      },
      links: {
        first: `${newUrl.origin}+${newUrl.pathname}?limit=${paginationDto.limit}&page=1`,
        last: `${newUrl.origin}+${newUrl.pathname}?limit=${paginationDto.limit}&page=${totalPages}`,
        current: `${newUrl.origin}+${newUrl.pathname}?limit=${paginationDto.limit}&page=${currentPage}`,
        next: `${newUrl.origin}+${newUrl.pathname}?limit=${paginationDto.limit}&page=${nextPages}`,
        previous: `${newUrl.origin}+${newUrl.pathname}?limit=${paginationDto.limit}&page=${previousPage}`,
      },
    };

    return response;
  }
}
