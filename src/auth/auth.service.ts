import bcrypt from 'bcrypt'
import { Injectable } from '@nestjs/common';
import { UserEntity } from '../app/users/users.entity';
import { UsersService } from '../app/users/users.service';


@Injectable()
export class AuthService {

  constructor(private readonly usersService: UsersService) { }

  async validateUser(email: string, password: string): Promise<any> {
    let user: UserEntity;
    try {
      user = await this.usersService.findOneOrFail({ where: { email } });
    } catch (err) {
      return null;
    }

    const isPasswordValid = bcrypt.compareSync(password, user.password);

    if (!isPasswordValid) return null;
    
    return user;
  }
}
