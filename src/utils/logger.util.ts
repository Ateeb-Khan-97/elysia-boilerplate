import chalk from 'chalk';
import moment from 'moment';

export function LoggerService(serviceName: Readonly<string> = 'Application') {
  const getDate = () => moment().format('DD/MM/YYYY, hh:mm:ss A');
  function messageParser(message: any) {
    if (typeof message != 'string') return JSON.stringify(message);
    return message;
  }

  function log(...props: any[]) {
    console.log(
      chalk.white(getDate()),
      chalk.green('LOG'),
      chalk.yellow(`[${serviceName}]`),
      chalk.green(messageParser(props.join(' '))),
    );
  }
  function error(...props: any[]) {
    console.log(
      chalk.white(getDate()),
      chalk.red('ERR'),
      chalk.yellow(`[${serviceName}]`),
      chalk.red(messageParser(props.join(' '))),
    );
  }

  return { log, error };
}
