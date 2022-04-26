import {
  Controller, Get, Post, BadRequestException, UseInterceptors, UploadedFile, Req
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { ApiTags } from '@nestjs/swagger'
import { diskStorage } from 'multer'
import * as path from 'path'

import { AppService } from './app.service'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiTags()
  @Get('hello')
  async getHello() {
    try {
      return this.appService.getHello()
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

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
  @Post('upload')
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
