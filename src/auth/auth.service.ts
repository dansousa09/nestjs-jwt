import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compareSync } from 'bcrypt';
import { UserEntity } from '../app/users/users.entity';
import { UsersService } from '../app/users/users.service';


@Injectable()
export class AuthService {

  constructor(private readonly usersService: UsersService, private readonly jwtService: JwtService) { }

  async validateUser(email: string, password: string): Promise<any> {
    let user: UserEntity;
    try {
      user = await this.usersService.findOneOrFail({ where: { email } });
    } catch (err) {
      return null;
    }

    const isPasswordValid = compareSync(password, user.password);

    if (!isPasswordValid) return null;
    
    return user;
  } 

  async login(user: UserEntity): Promise<any> {
    const payload = { sub: user.id, email: user.email }
    
    return {
      token: this.jwtService.sign(payload),
    };
  }
}
