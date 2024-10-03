import { FindOptionsSelect, FindOptionsWhere } from 'typeorm';

export interface FindUserParams<T> {
  where?: FindOptionsWhere<T> | FindOptionsWhere<T>[];
  select?: FindOptionsSelect<T>;
  relations?: string[];
  limit?: number;
  page?: number;
}

export type findoOneParams<T> = Omit<FindUserParams<T>, 'limit' | 'page'>;
