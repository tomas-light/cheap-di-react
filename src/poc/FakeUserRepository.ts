import { User } from './User';
import { UserRepository } from './UserRepository';

export class FakeUserRepository extends UserRepository {
  private users: User[];

  constructor() {
    super();

    this.users = [
      {
        id: 1,
        name: 'user-1'
      },
      {
        id: 2,
        name: 'user-2'
      },
    ];
  }

  list() {
    return this.users;
  }

  getById(userId: number) {
    return this.users.find(user => user.id === userId);
  }
}
