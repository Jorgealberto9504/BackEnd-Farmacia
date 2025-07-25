// src/dao/user.dao.js
import { User } from '../models/user.model.js';

export class UserDAO {
  async create(userData) {
    return await User.create(userData);
  }

  async findByEmail(email) {
    return await User.findOne({ email });
  }

  async findById(id) {
    return await User.findById(id);
  }

  async updatePassword(id, hashedPassword) {
    return await User.findByIdAndUpdate(id, { password: hashedPassword }, { new: true });
  }
}
