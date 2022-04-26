import {
  Controller, Post, UseGuards, UsePipes, Res, Req, HttpCode, HttpStatus, Body
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import {
  ApiOkResponse, ApiTags, ApiBody, ApiCreatedResponse
} from '@nestjs/swagger'
import * as Joi from 'joi'
import { Response } from 'express'

import { AuthService } from './auth.service'
import { LocalAuthGuard } from './local-auth.guard'
import { Mapper } from '../app/common/mapper'
import { PublicRoute } from '../app/common/decorators/metadata/public-route.decorator'
import { JoiValidationPipe } from '../app/common/pipes/validation.pipe'
import { CreateUserDto } from '../app/users/dto/create-user.dto'
import { User } from '../app/users/users.entity'
import { UserService } from '../app/users/users.service'

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly mapper: Mapper,
    private readonly configService: ConfigService
  ) {}

  @ApiBody({
    schema: {
      type: 'object',
      required: ['email', 'password'],
      properties: {
        email: { type: 'email', example: 'somebody@hotmail.com' },
        firstName: { type: 'string', example: 'Tom' },
        lastName: { type: 'string', example: 'Cruise' },
        password: { type: 'string', example: 'youknowwhatitis' }
      }
    }
  })
  @ApiCreatedResponse()
  @UsePipes(new JoiValidationPipe({
    body: Joi.object({
      email: Joi.string().email().required(),
      firstName: Joi.string(),
      lastName: Joi.string(),
      password: Joi.string().required()
    })
  }))
  @PublicRoute()
  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    const result = await this.userService.create(this.mapper.map(CreateUserDto, User, createUserDto))
    return result.identifiers[0]
  }

  @ApiBody({
    schema: {
      type: 'object',
      required: ['email', 'password'],
      properties: {
        email: { type: 'email', example: 'somebody@hotmail.com' },
        password: { type: 'string', example: 'youknowwhatitis' }
      }
    }
  })
  @ApiOkResponse({
    schema: {
      type: 'object',
      properties: {
        access_token: { type: 'string', example: 'some_random_access_token' }
      }
    }
  })
  @UseGuards(LocalAuthGuard)
  @UsePipes(new JoiValidationPipe({
    body: Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required()
    })
  }))
  @PublicRoute()
  @Post('login')
  async login(@Req() req, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.generateToken(req.user)
    res.cookie(this.configService.get('AUTH_TOKEN_KEY'), result.access_token, {
      httpOnly: true,
      secure: req.secure || req.headers['x-forwarded-proto'] === 'https'
    })
    res.status(200).json({
      user: req.user,
      access_token: result.access_token
    })
  }
}
