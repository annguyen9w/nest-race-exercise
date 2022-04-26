import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { classToPlain } from 'class-transformer'
import { UserService } from '../app/users/users.service'

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userService.findOne(email)
    if (!user) {
      return null
    }
    const isMatchedPassword = await bcrypt.compare(pass, user.password)
    if (isMatchedPassword) {
      return classToPlain(user)
    }
    return null
  }

  async generateToken(user: { id: string, email: string }) {
    const payload = { email: user.email, id: user.id }
    return {
      access_token: this.jwtService.sign(payload)
    }
  }
}
