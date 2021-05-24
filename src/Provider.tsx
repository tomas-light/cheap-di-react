import { FC, useContext, useEffect, useState } from 'react';
import {
  ContainerImpl,
  DependencyRegistrator,
} from 'cheap-di';

import { Context } from './Context';

interface ProviderProps {
  dependencies?: ((dependencyRegistrator: DependencyRegistrator) => void)[];
}

const Provider: FC<ProviderProps> = props => {
  const {
    dependencies,
    children,
  } = props;

  const parentContainer = useContext(Context);
  const [container, setContainer] = useState<ContainerImpl>(() => {
    const _container = new ContainerImpl();
    if (dependencies) {
      dependencies.forEach(callback => {
        callback(_container);
      });
    }
    return _container;
  });

  useEffect(() => {
    if (parentContainer) {
      const _container = new ContainerImpl(parentContainer);
      setContainer(_container);
    }
  }, [parentContainer]);

  useEffect(() => {
    if (dependencies) {
      dependencies.forEach(callback => {
        callback(container);
      });
    }
  }, [container, dependencies]);

  return (
    <Context.Provider value={container}>
      {children}
    </Context.Provider>
  );
};


export { Provider };
export type { ProviderProps };

