import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { instanceToPlain } from 'class-transformer'
import { UserService } from '../app/users/users.service'

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findOne(email)
    if (!user) {
      return null
    }
    const isMatchedPassword = await bcrypt.compare(password, user.password)
    return isMatchedPassword ? instanceToPlain(user) : null
  }

  async generateToken(user: { id: string, email: string }) {
    return {
      access_token: this.jwtService.sign({ email: user.email, id: user.id })
    }
  }
}
