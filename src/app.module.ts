import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_FILTER, APP_GUARD } from '@nestjs/core'
import { MulterModule } from '@nestjs/platform-express'
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler'
import * as Joi from 'joi'

import { AppController } from './app.controller'
import { AppService } from './app.service'

// #region Import outside app modules
import { AuthModule } from './auth/auth.module'
import { DatabaseModule } from './database/database.module'
import { HealthModule } from './health/health.module'
import { LoggerModule } from './logger/logger.module'

import { JwtAuthGuard } from './auth/jwt-auth.guard'
import { LoggerMiddleware } from './logger/logger.middleware'
import { AllExceptionFilter } from './app/common/exceptions/all-exception.filter'
// #endregion Import outside app modules

// #region Import inside app modules

// #endregion Import inside app modules

@Module({
  imports: [
    // Library Module
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('DEV', 'PROD', 'TEST').default('DEV'),
        PORT: Joi.number().default(3000),
        API_VERSION: Joi.string().default('1.0'),
        API_PREFIX: Joi.string().default('api'),
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),
        RUN_MIGRATIONS: Joi.boolean().default(false),
        VERBOSE: Joi.boolean().default(false),
        SHOW_HEALTH_LOGS: Joi.boolean().default(false),
        CLIENT_URL: Joi.string().required(),
        JWT_SECRET: Joi.string().required()
      })
    }),
    MulterModule.register(),
    ThrottlerModule.forRoot({
      ttl: 60, // retry after 60 seconds
      limit: 3 // limit to 3 requests per 60 seconds
    }),

    // Custom Module
    AuthModule,
    DatabaseModule,
    HealthModule,
    LoggerModule

    // App Module
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionFilter
    }
  ]
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .exclude({ path: 'health', method: RequestMethod.GET })
      .forRoutes('*')
  }
}
