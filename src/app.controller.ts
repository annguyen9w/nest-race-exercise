import {
  Controller, Get, Post, UseGuards, Request, UsePipes, BadRequestException, UseInterceptors, UploadedFile, Req
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { ApiOkResponse, ApiTags, ApiBody } from '@nestjs/swagger'
import { diskStorage } from 'multer'
import * as Joi from 'joi'
import * as path from 'path'

import { AppService } from './app.service'
import { AuthService } from './auth/auth.service'
import { LocalAuthGuard } from './auth/local-auth.guard'
import { MzPublic } from './app/common/decorator/public.decorator'
import { JoiValidationPipe } from './app/common/validation.pipe'

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly authService: AuthService
  ) {}

  @MzPublic()
  @ApiTags()
  @Get('hello')
  async getHello() {
    try {
      return this.appService.getHello()
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  @ApiTags('authen')
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
  @UsePipes(new JoiValidationPipe({
    body: Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required()
    })
  }))
  @UseGuards(LocalAuthGuard)
  @MzPublic()
  @Post('auth/login')
  login(@Request() req) {
    try {
      return this.authService.login(req.user)
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  @MzPublic()
  @Post('upload')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const fileExt: string = path.extname(file.originalname)
        const fileName: string = path.basename(file.originalname, fileExt)
        cb(null, path.join(`${fileName}_${Date.now().toString()}${fileExt}`))
      }
    }),
    fileFilter: (req, file, cb) => {
      if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        req.fileValidationError = 'Only support image files'
        return cb(null, false)
      }
      return cb(null, true)
    },
    limits: { fileSize: 1024 * 1024 } // 1MB
  }))
  uploadfile(@Req() req, @UploadedFile() file: Express.Multer.File) {
    if (req.fileValidationError) {
      throw new BadRequestException(req.fileValidationError)
    }
    if (!file) {
      throw new BadRequestException('invalid file')
    }
    return file
  }
}
