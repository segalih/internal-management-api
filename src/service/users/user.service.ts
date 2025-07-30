import bcrypt from 'bcrypt';
import { LoginDto } from '../../common/dto/auth/login.dto';
import Users from '../../database/models/user.model';
import { NotFoundException } from '../../helper/Error/NotFound/NotFoundException';

import { CreateUserDto } from '../../common/dto/user/CreateUser.dto';
import JWTService from '../jwt/jwt.service';
import { BadRequestException } from '../../helper/Error/BadRequestException/BadRequestException';

export default class UserService {
  private jwtService: JWTService;
  constructor() {
    this.jwtService = new JWTService();
  }
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
    const isExist = await Users.findOne({ where: { email: data.email } });
    if (isExist) throw new BadRequestException('Email already exists', {});
    const user = await Users.create({ ...data, password: hashPassword });
    return user;
  }

  async signIn(data: LoginDto) {
    const user = await Users.findOne({ where: { email: data.email } });
    if (!user) throw new NotFoundException('Users not found', {});
    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) throw new NotFoundException('Users not found', {});
    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
    };
    const token = await this.jwtService.generateToken(payload);
    const result = {
      access_token: token,
      payload: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };

    return result;
  }
}
