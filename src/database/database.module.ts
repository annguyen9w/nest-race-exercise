import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { LoggerDatabase } from '../logger/logger.database'
import dbConfig from './database.config'

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [LoggerDatabase],
      useFactory: (loggerDatabase: LoggerDatabase) => Object.assign(dbConfig, { logger: loggerDatabase })
      // type: 'postgres',
      // host: configService.get('POSTGRES_HOST'),
      // port: Number(configService.get('POSTGRES_PORT')),
      // username: configService.get('POSTGRES_USER'),
      // password: configService.get('POSTGRES_PASSWORD'),
      // database: configService.get('POSTGRES_DB'),
      // cli: {
      //   migrationsDir: 'src/database/migration'
      // },
      // ssl: configService.get('NODE_ENV') === 'PROD',
      // logger: loggerDatabase
      // entities: [`${__dirname}/../**/*.entity{.ts,.js}`],
      // autoLoadEntities: true,
      // synchronize: false, // NOTE: should be 'false' to avoid data loss, and to make the migrations work
      // migrationsRun: configService.get<boolean>('RUN_MIGRATIONS') // automatically run migrations
      // migrations: [`${__dirname}/migration/*.{ts,js}`]
    })
  ]
})
export class DatabaseModule {}
