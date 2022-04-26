import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { User } from './users.entity'
import { UserController } from './users.controller'
import { UserService } from './users.service'
import { Mapper } from '../common/mapper'

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService, Mapper],
  exports: [UserService]
})
export class UserModule {}
