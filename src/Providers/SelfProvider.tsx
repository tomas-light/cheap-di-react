import { FC, useEffect, useState } from 'react';
import { DependencyRegistrator, ImplementationType } from 'cheap-di';

import { Provider, ProviderProps } from './Provider';

const mapper =
  (type: ImplementationType<Object>) =>
    (container: DependencyRegistrator) =>
      container.registerType(type) as any as void
;

interface SelfProviderProps extends Omit<ProviderProps, 'dependencies'> {
  dependencies: ImplementationType<Object>[];
}

const SelfProvider: FC<SelfProviderProps> = props => {
  const {
    dependencies,
    children,
    ...rest
  } = props;

  const [registrationFunctions, setRegistrationFunctions] = useState(() => dependencies.map(mapper));

  useEffect(() => {
    const mappedDependencies = dependencies.map(mapper);
    setRegistrationFunctions(mappedDependencies);
  }, [dependencies]);

  return (
    <Provider dependencies={registrationFunctions} {...rest}>
      {children}
    </Provider>
  );
};


export { SelfProvider };
export type { SelfProviderProps };
