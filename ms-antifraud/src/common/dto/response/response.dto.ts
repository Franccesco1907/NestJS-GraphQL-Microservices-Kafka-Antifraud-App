
export class ResponseDto<T> {
  status: number = 200;
  data: T;
  errors: any = null;

  constructor(status: number, data: T, errors: any) {
    this.status = status;
    this.data = data;
    this.errors = errors;
  }
}
