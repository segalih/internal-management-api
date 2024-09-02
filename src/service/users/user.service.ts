import bcrypt from 'bcrypt';
import Users from '../../database/models/user.model';
import { NotFoundException } from '../../helper/Error/NotFound/NotFoundException';
import { CreateUserDto } from '../../common/dto/auth/CreateUser.dto';
import { LoginDto } from '../../common/dto/auth/login.dto';

import * as jwt from 'jsonwebtoken';
import configConstants from '../../config/constants';

export default class UserService {
  async getById(id: number) {
    const user = await Users.findByPk(id);
    if (!user) throw new NotFoundException('Users not found', {});
    return user;
  }

  async getAll() {
    const users = await Users.findAll();
    return users;
  }

  async create(data: CreateUserDto) {
    const hashPassword = await bcrypt.hash(data.password, 10);
    const user = await Users.create({ ...data, password: hashPassword });
    return user;
  }

  async signIn(data: LoginDto) {
    const user = await Users.findOne({ where: { email: data.email } });
    console.log('user', user);
    if (!user) throw new NotFoundException('Users not found', {});
    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) throw new NotFoundException('Users not found', {});
    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
    };

    const token = jwt.sign(payload, configConstants.JWT_SECRET_ACCESS_TOKEN, {
      expiresIn: configConstants.JWT_EXPIRES_IN,
    });

    return token;
  }
}
