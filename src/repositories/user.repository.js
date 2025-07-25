// src/repositories/user.repository.js
import { UserDAO } from '../dao/user.dao.js';

const userDAO = new UserDAO();

export class UserRepository {
  async registerUser(userData) {
    return await userDAO.create(userData);
  }

  async getUserByEmail(email) {
    return await userDAO.findByEmail(email);
  }

  async getUserById(id) {
    return await userDAO.findById(id);
  }

  async changePassword(id, newHashedPassword) {
    return await userDAO.updatePassword(id, newHashedPassword);
  }
}
