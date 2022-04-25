import { VersioningType } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'

import { AppModule } from './app.module'
import { AppConfigService } from './app.config-service'
import { MzLoggerService } from './logger/logger.service'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true })
  const appConfigService = app.get<AppConfigService>(AppConfigService)

  const loggerService = new MzLoggerService(appConfigService)
  loggerService.setContext('BOOTSTRAP')
  app.useLogger(appConfigService.isVerbose ? loggerService : false)

  app.setGlobalPrefix(appConfigService.getGlobalPrefix) // http://localhost:3000/api/...
  app.enableVersioning({ // http://localhost:3000/api/v1.0/...
    type: VersioningType.URI,
    defaultVersion: appConfigService.getApiVersion
  })

  loggerService.debug(`isProduction: ${appConfigService.isProduction} --- isVerbose: ${appConfigService.isVerbose} --- showHealthLogs: ${appConfigService.showHealthLogs}`)
  if (!appConfigService.isProduction) {
    const document = SwaggerModule.createDocument(app, new DocumentBuilder()
      .setTitle('Mazi API')
      .setDescription('Mazi API\'s documentation')
      .setVersion(appConfigService.getApiVersion)
      .addBearerAuth()
      .build())
    SwaggerModule.setup('api', app, document) // NOTE: access the Swagger documentation at "/api"
  }

  app.enableCors()
  loggerService.debug(`Application is running on port: ${appConfigService.getPort}`)
  await app.listen(appConfigService.getPort)
}
bootstrap()
