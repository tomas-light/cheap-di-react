import { FC, useContext, useEffect, useState, memo } from 'react';
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
  const [container, setContainer] = useState<ContainerImpl>(() => new ContainerImpl(parentContainer));

  useEffect(() => {
    if (container.sameParent(parentContainer)) {
      return;
    }

    setContainer(new ContainerImpl(parentContainer));
  }, [parentContainer]);

  dependencies?.forEach(callback => callback(container));

  return (
    <Context.Provider value={container}>
      {children}
    </Context.Provider>
  );
};

const memoizedComponent = memo(Provider) as FC<ProviderProps>;
export { memoizedComponent as Provider };
export type { ProviderProps };

