import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from './entities/user.entity';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.userModel.findOne({
      email: createUserDto.email,
    });
    if (existingUser) {
      throw new BadRequestException('Email Alreadt in use.');
    }

    const hashPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = new this.userModel({
      ...createUserDto,
      password: hashPassword,
    });

    return user.save();
  }

  async findAll(page: number = 1, limit: number = 10) {
    const users = await this.userModel
      .find({}, { password: 0 }) // Exclude sensitive fields like 'password'
      .skip((page - 1) * limit) // Skip records for pagination
      .limit(limit) // Limit the number of results
      .lean(); // Convert to plain JavaScript objects for better performance

    return users;
  }

  findOne(id: number) {
    const user = this.userModel.findById(id);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    const user = this.userModel.findByIdAndUpdate(
      id,
      { name: updateUserDto.name },
      { new: true },
    );
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  remove(id: number) {
    this.userModel.findByIdAndDelete(id);
  }
}
