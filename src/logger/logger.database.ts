import type { Logger, QueryRunner } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { MzLoggerService } from './logger.service'
import { AppConfigService } from '../app.config-service'

const healthCheckQueryString = 'SELECT 1'

@Injectable()
export class LoggerDatabase implements Logger {
  constructor(
    private loggerService: MzLoggerService,
    private appConfigService: AppConfigService
  ) {
    this.loggerService.setContext('SQL')
  }
  // private readonly loggerService = new MzLogger('SQL')

  logQuery(query: string, parameters?: unknown[], queryRunner?: QueryRunner) {
    if (this.skipLoggingCheck(query, parameters, queryRunner)) {
      return
    }
    this.loggerService.log(`${query} -- Parameters: ${this.stringifyParameters(parameters)}`)
  }

  logQueryError(error: string, query: string, parameters?: unknown[], queryRunner?: QueryRunner) {
    if (this.skipLoggingCheck(query, parameters, queryRunner)) {
      return
    }
    this.loggerService.error(`${query} -- Parameters: ${this.stringifyParameters(parameters)} -- ${error}`)
  }

  logQuerySlow(time: number, query: string, parameters?: unknown[], queryRunner?: QueryRunner) {
    if (this.skipLoggingCheck(query, parameters, queryRunner)) {
      return
    }
    this.loggerService.warn(`Time: ${time} -- Parameters: ${this.stringifyParameters(parameters)} -- ${query}`)
  }

  logMigration(message: string) {
    this.loggerService.log(message)
  }

  logSchemaBuild(message: string) {
    this.loggerService.log(message)
  }

  log(level: 'log' | 'info' | 'warn', message: string, queryRunner?: QueryRunner) {
    if (queryRunner?.data?.isCreatingLogs) {
      return
    }
    if (level === 'log') {
      this.loggerService.log(message)
      return
    }
    if (level === 'info') {
      this.loggerService.debug(message)
      return
    }
    if (level === 'warn') {
      this.loggerService.warn(message)
    }
  }

  private stringifyParameters(parameters?: unknown[]) {
    try {
      return JSON.stringify(parameters)
    } catch {
      return ''
    }
  }

  private skipLoggingCheck(query: string, parameters?: unknown[], queryRunner?: QueryRunner): boolean {
    if (queryRunner?.data?.isCreatingLogs) {
      return true
    }
    if (!this.appConfigService.showHealthLogs && query === healthCheckQueryString) {
      return true
    }
    return false
  }
}
