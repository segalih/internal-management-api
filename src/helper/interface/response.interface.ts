export interface ResponseApi<T> {
  statusCode: number;
  message: string;
  data: T | null;
  errors?: any;
}
export interface ResponseApiWithPagination<T> {
  statusCode: number;
  message: string;
  data: T[] | null;
  meta: PaginationMeta;
  errors?: any;
}

export interface PaginationMeta {
  totalCount: number;
  pageSize: number;
  totalPages: number;
  currentPage: number;
}