import { FC, useEffect, useState } from 'react';
import { DependencyRegistrator, ImplementationType } from 'cheap-di';

import { Provider } from './Provider';

const mapper =
  (type: ImplementationType<Object>) =>
    (container: DependencyRegistrator) =>
      container.registerType(type) as any as void
;

interface SelfProviderProps {
  dependencies: ImplementationType<Object>[];
}

const SelfProvider: FC<SelfProviderProps> = props => {
  const {
    dependencies,
    children,
  } = props;

  const [registrationFunctions, setRegistrationFunctions] = useState(() => dependencies.map(mapper));

  useEffect(() => {
    const mappedDependencies = dependencies.map(mapper);
    setRegistrationFunctions(mappedDependencies);
  }, [dependencies]);

  return (
    <Provider dependencies={registrationFunctions}>
      {children}
    </Provider>
  );
};


export { SelfProvider };
export type { SelfProviderProps };
