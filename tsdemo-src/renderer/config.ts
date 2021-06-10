import { CustomError } from 'ts-custom-error';

export class ErrorConfig extends CustomError {}

type Config = {
  BASE_PATH: string;
};

function throwError(key: string): never {
  throw new ErrorConfig(`Invalid config ${key} variable`);
}

function configFromQueryParams(queryParams: URLSearchParams): Config {
  const config = {};
  config['BASE_PATH'] = queryParams.get('BASE_PATH') ?? throwError('BASE_PATH');
  return config as Config;
}

export default configFromQueryParams;

export type { Config };
