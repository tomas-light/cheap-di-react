import { User } from './User';

export class Database {
  users: User[];

  constructor(users: User[] = []) {
    this.users = users;
  }

  add(user: User) {
    this.users.push(user);
  }

  list() {
    return this.users;
  }
}
