export class ApiResponse {
  body: unknown;
  success: boolean;

  constructor(success: boolean, body: unknown) {
    this.success = success;
    this.body = body;
  }
}
