import { FC, useMemo } from 'react';
import { ImplementationType } from 'cheap-di/src';

import { SelfProvider } from './SelfProvider';

interface SelfOneTimeProviderProps {
  dependencies: ImplementationType<Object>[];
}

const SelfOneTimeProvider: FC<SelfOneTimeProviderProps> = props => {
  const {
    dependencies,
    children,
  } = props;

  const registrations = useMemo(() => dependencies, []);
  return (
    <SelfProvider dependencies={registrations}>
      {children}
    </SelfProvider>
  );
};


export { SelfOneTimeProvider };
export type { SelfOneTimeProviderProps };

