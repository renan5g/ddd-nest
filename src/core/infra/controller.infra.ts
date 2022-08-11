import { HttpResponse } from './http-response.infra';

export interface Controller<T = any> {
  handle: (request: T) => Promise<HttpResponse>;
}
