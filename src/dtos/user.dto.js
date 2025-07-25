// src/dtos/user.dto.js

export const userDTO = (user) => {
    return {
      name: user.name,
      email: user.email,
      role: user.role,
      address: user.address,
      phone: user.phone
    };
  };
  