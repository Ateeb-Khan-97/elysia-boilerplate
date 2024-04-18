import { Context } from 'elysia';
import { HttpStatus } from '../../utils/http-status.util';

interface IModifiedResponse {
  status: number;
  message: string;
  data: any;
  success: boolean;
}

interface IMapParams {
  response: any;
  c: Context;
}

export class Response {
  static map({ c, response }: IMapParams) {
    const modifiedResponse: IModifiedResponse = {
      status: HttpStatus.OK,
      message: HttpStatus.OK_MESSAGE,
      data: null,
      success: true,
    };

    switch (typeof response) {
      case 'object':
        if (Array.isArray(response)) {
          modifiedResponse.data = response;
          break;
        }

        if (response.status) {
          modifiedResponse.status = response.status;
          delete response.status;
        }

        if (response.message) {
          modifiedResponse.message = response.message;
          delete response.message;
        }

        if (response.data) {
          modifiedResponse.data = response.data;
        } else {
          modifiedResponse.data = response;
        }

        if (JSON.stringify(modifiedResponse.data) == '{}')
          modifiedResponse.data = null;

        break;
      case 'string':
        modifiedResponse.message = response;
        break;
      default:
        modifiedResponse.data = response;
        break;
    }

    c.set.status = modifiedResponse.status;
    return {
      success:
        modifiedResponse.status >= HttpStatus.OK &&
        modifiedResponse.status < HttpStatus.MULTIPLE_CHOICES,
      status: modifiedResponse.status,
      message: modifiedResponse.message,
      data: modifiedResponse.data,
    };
  }
}
