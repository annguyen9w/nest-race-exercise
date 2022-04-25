import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { User } from './user.entity'
import { UserController } from './user.controller'
import { UserService } from './user.service'
import { Mapper } from '../common/mapper'

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService, Mapper],
  exports: [UserService]
})
export class UserModule {}
