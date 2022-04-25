import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  private getConfigValue(key: string, throwOnMissing = true) {
    const configValue = this.configService.get(key)
    if (!configValue && throwOnMissing) {
      throw new Error(`config error - missing env.${key}`)
    }
    return configValue
  }

  get getPort(): string {
    return this.getConfigValue('PORT')
  }

  get getGlobalPrefix(): string {
    return this.getConfigValue('API_PREFIX')
  }

  get getApiVersion(): string {
    return this.getConfigValue('API_VERSION')
  }

  get isProduction(): boolean {
    const nodeEnv = this.getConfigValue('NODE_ENV', false)
    return nodeEnv === 'PROD' || process.env.NODE_ENV === 'production'
  }

  get isTest(): boolean {
    const nodeEnv = this.getConfigValue('NODE_ENV', false)
    return nodeEnv === 'TEST' || process.env.NODE_ENV === 'test'
  }

  get isVerbose(): boolean {
    return this.getConfigValue('VERBOSE', false)
  }

  get showHealthLogs(): boolean {
    return this.getConfigValue('SHOW_HEALTH_LOGS', false)
  }
}
