import { ReactContainer } from './ReactContainer';
import { dependencies, singleton } from 'cheap-di';

const metadata = <T>(constructor: T): T => constructor;

describe('singletons', () => {
  test('with decorator', () => {
    @singleton
    class Service {
    }

    const container = new ReactContainer();
    container.registerType(Service);
    const entity1 = container.resolve(Service);
    const entity2 = container.resolve(Service);
    expect(entity1).toBe(entity2);
  });

  test('with decorator', () => {
    @metadata
    class Service {
    }

    const container = new ReactContainer();
    container.registerType(Service).asSingleton();
    const entity1 = container.resolve(Service);
    const entity2 = container.resolve(Service);
    expect(entity1).toBe(entity2);
  });
});

describe('nested containers', () => {
  abstract class Service {
    abstract some(): string;
  }

  class Service1 extends Service {
    some(): string {
      return 'service 1';
    }
  }

  class Service2 extends Service {
    some(): string {
      return 'service 2';
    }
  }

  @dependencies(Service)
  class Consumer {
    constructor(private service: Service) {
    }

    do() {
      return this.service.some();
    }
  }

  const container1 = new ReactContainer();
  const container2 = new ReactContainer(container1);
  const container3 = new ReactContainer(container2);

  container1.registerType(Service1).as(Service);

  test('container 1 -> 3', () => {
    const consumer = container3.resolve(Consumer);
    expect(consumer instanceof Consumer).toBe(true);
    expect(consumer!.do()).toBe('service 1');
  });

  test('container 2 overrides container 1', () => {
    container2.registerType(Service2).as(Service);
    const consumer = container3.resolve(Consumer);
    expect(consumer instanceof Consumer).toBe(true);
    expect(consumer!.do()).toBe('service 2');
  });

  test('singleton resolving', () => {
    @singleton
    class Database {
      readonly entities: string[];

      constructor() {
        this.entities = ['entity 1', 'entity 2'];
      }
    }

    @dependencies(Database)
    class Repository {
      private db: Database;

      constructor(db: Database) {
        this.db = db;
      }

      list() {
        return this.db.entities;
      }
    }

    @dependencies(Repository)
    class Service {
      private repository: Repository;

      constructor(repository: Repository) {
        this.repository = repository;
      }

      myList() {
        const entities = this.repository.list();
        return entities.concat('service entity');
      }
    }

    const container = new ReactContainer();
    const service = container.resolve(Service)!;
    const list = service.myList();
    expect(list).toEqual([
      'entity 1',
      'entity 2',
      'service entity',
    ]);
  });
});
