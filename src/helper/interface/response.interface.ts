export interface ResponseApi<T> {
  statusCode: number;
  message: string;
  data: T | null;
  errors?: any;
}