export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
}
