import { useState } from 'react';
import { ConsoleLogger } from './ConsoleLogger';
import { Database } from './Database';
import { FakeUserRepository } from './FakeUserRepository';
import { Logger } from './Logger';
import { Provider } from '../Provider';
import { SelfProvider } from '../SelfProvider';
import { use } from '../use';
import { UserRepository } from './UserRepository';

const RootComponent = () => {
  const [db] = useState(new Database([{ id: 12, name: 'Vasiliy' }]));

  return (
    <Provider
      dependencies={[
        dr => dr.registerType(FakeUserRepository),
        dr => dr.registerType(FakeUserRepository).as(UserRepository),
        dr => dr.registerType(FakeUserRepository).as(UserRepository).with(123),
        dr => dr.registerType(ConsoleLogger).as(Logger),
        dr => dr.registerInstance(db),
        dr => dr.registerInstance(db).as(Database),
      ]}
    >
      <ComponentA/>
    </Provider>
  );
};

const RootComponent2 = () => {
  return (
    <SelfProvider
      dependencies={[FakeUserRepository, ConsoleLogger, Database]}
    >
      <ComponentA/>
    </SelfProvider>
  );
};

const ComponentA = () => (
  <ComponentB/>
);

const ComponentB = () => {
  const userRepository = use(UserRepository);
  const logger = use(Logger);
  const database = use(Database);

  logger.debug('bla-bla-bla');

  return (
    <div>
      <p>
        {userRepository.list()}
      </p>
      <p>
        {database.list()}
      </p>
    </div>
  );
};
