import { FC, useContext, useLayoutEffect, useState } from 'react';
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
  // const [container, setContainer] = useState<ContainerImpl>(() => new ContainerImpl());
  const [container] = useState<ContainerImpl>(() => new ContainerImpl(parentContainer));

  /*useLayoutEffect(() => {
    if (!parentContainer) {
      return;
    }

    const childContainer = new ContainerImpl(parentContainer);
    dependencies.forEach(callback => {
      callback(childContainer);
    });

    setContainer(childContainer);
  }, [parentContainer]);*/

  useLayoutEffect(() => {
    if (dependencies) {
      dependencies.forEach(callback => {
        callback(container);
      });
    }
  }, [dependencies]);

  return (
    <Context.Provider value={container}>
      {children}
    </Context.Provider>
  );
};


export { Provider };
export type { ProviderProps };

