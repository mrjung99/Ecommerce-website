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
    relations?: string[],
  ): Promise<Paginated<T>> {
    const page = paginationDto.page ?? 1;
    const limit = paginationDto.limit ?? 10;

    const findOptions: FindManyOptions<T> = {
      skip: (page - 1) * limit,
      take: limit,
      where,
      relations,
    };

    const result = await repository.find(findOptions);

    const totalItems = await repository.count();
    const totalPages = Math.ceil(totalItems / limit);
    const currentPage = page;
    const nextPages =
      currentPage === totalPages ? page : (currentPage ?? 1) + 1;
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
        first: `${newUrl.origin}${newUrl.pathname}?limit=${limit}&page=1`,
        last: `${newUrl.origin}${newUrl.pathname}?limit=${limit}&page=${totalPages}`,
        current: `${newUrl.origin}${newUrl.pathname}?limit=${limit}&page=${currentPage}`,
        next: `${newUrl.origin}${newUrl.pathname}?limit=${limit}&page=${nextPages}`,
        previous: `${newUrl.origin}${newUrl.pathname}?limit=${limit}&page=${previousPage}`,
      },
    };

    return response;
  }
}
