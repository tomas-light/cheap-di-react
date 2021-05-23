import { User } from './User';

export abstract class UserRepository {
  abstract list(): User[];
  abstract getById(userId: number): User | undefined;
}
