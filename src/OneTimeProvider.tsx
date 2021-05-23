import { FC, useMemo } from 'react';
import { DependencyRegistrator } from 'cheap-di';

import { Provider } from './Provider';

interface OneTimeProviderProps {
  dependencies: ((dependencyRegistrator: DependencyRegistrator) => void)[];
}

const OneTimeProvider: FC<OneTimeProviderProps> = props => {
  const {
    dependencies,
    children,
  } = props;

  const registrations = useMemo(() => dependencies, []);
  return (
    <Provider dependencies={registrations}>
      {children}
    </Provider>
  );
};


export { OneTimeProvider };
export type { OneTimeProviderProps };

