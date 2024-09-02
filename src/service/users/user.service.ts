import Users from '../../database/models/user.model';
import { NotFoundException } from '../../helper/Error/NotFound/NotFoundException';
import { CreateUserDto } from '../../helper/validator/CreateUser.dto';
import bcrypt from 'bcrypt';

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
    // const user = await Users.create(data);
    const hashPassword = await bcrypt.hash(data.password, 10);
    const user = await Users.create({ ...data, password: hashPassword });
    return user;
  }
}
