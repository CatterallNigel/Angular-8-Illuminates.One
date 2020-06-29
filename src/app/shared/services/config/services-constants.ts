export interface LogLevel {
  debug?: boolean;
  log: boolean;
  error: boolean;
}

export interface Config {
  mode: string;
  log: LogLevel;
}

export type ConfigServices = Config;

export class ServicesConstants {
  public static config: ConfigServices = {
    mode: 'debug',
    log: {
      debug: false,
      log: true,
      error: true,
    },
  };
}
