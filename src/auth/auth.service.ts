import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { classToPlain } from 'class-transformer'
import { UserService } from '../app/users/user.service'

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userService.findOne(email)
    if (user) {
      const isMatch = await bcrypt.compare(pass, user.password)
      if (isMatch) {
        return classToPlain(user)
      }
    }
    return null
  }

  async login(user: any) {
    const payload = { email: user.email, id: user.id }
    return {
      access_token: this.jwtService.sign(payload)
    }
  }
}
