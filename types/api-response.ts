export interface IApiResponse<Data> {
  statusCode: number;
  success: boolean;
  message: string;
  data?: Data;
  error?: string;
}
