import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  private users = [
    'ibrar',
    'hassan',
    'umair',
    'bilal',
    'zaman',
    'hamza',
    'wasi ul hassan',
  ];
  // get all users
  getAllUsers() {
    return this.users;
  }
  // get user by id
  getUserById(id: number) {
    return this.users[id] || `"User Not Found"`;
  }
  // add user in array
  addUser(name: string): string[] {
    this.users.push(name);
    return this.users;
  }
  // update user by name
  updateuser(id: number, name: string): string[] {
    console.log('id', id);
    if (this.users[id]) {
      this.users[id] = name;
      return this.users;
    }
    return this.users;
  }

  deleteuser(id: number): string[] {
    if (this.users[id]) {
      this.users.splice(id, 2);
      return this.users;
    }
    return this.users;
  }
}
