import { Global, Module } from '@nestjs/common'
import { AppConfigService } from '../app.config-service'
import { MzLoggerService } from './logger.service'
import { LoggerDatabase } from './logger.database'

@Global()
@Module({
  providers: [MzLoggerService, LoggerDatabase, AppConfigService],
  exports: [MzLoggerService, LoggerDatabase]
})
export class LoggerModule {}
