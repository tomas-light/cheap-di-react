import { Constructor, DependencyRegistrator, isSingleton, } from 'cheap-di';
import { FC, Fragment, memo, ReactNode, useEffect, useRef, useState } from 'react';
import { isStateful } from '../decorators';

import { DiContext } from '../DiContext';
import { useContainer } from '../hooks';
import { configureStateful } from '../hooks/configureStateful';
import { InternalLogger } from '../utils';

interface ProviderProps {
  dependencies?: ((dependencyRegistrator: DependencyRegistrator) => void)[];
  /** if it is provided, logging will be enabled */
  debugName?: string;
  children: ReactNode;
}

const Provider: FC<ProviderProps> = props => {
  const {
    dependencies,
    debugName,
    children,
  } = props;

  const [logger] = useState(() => new InternalLogger(debugName));
  const [initialized, setInitialized] = useState(false);
  const timerRef = useRef<any>(null);
  const [contextValue, rerender] = useContainer(logger);
  const container = contextValue.container;

  useEffect(() => {
    if (!container || !dependencies) {
      return;
    }

    container.clear();
    logger.log('dependency registrations');

    const singletonsSizeBeforeDependenciesUpdate = container?.getSingletons().size ?? 0;
    dependencies.forEach(callback => callback(container));

    logger.log('singleton and stateful configurations');

    for (const [type] of container.getDependencies()) {
      const constructor = container.localScope(_container => _container.getImplementation(type));
      if (!constructor) {
        return;
      }

      if (isSingleton(constructor as Constructor)) {
        logger.log('singleton', constructor, 'founded');

        const instance = container.resolve(type);
        configureStateful(instance, container.rootContainer.rerender, logger);
      }

      if (isStateful(constructor as Constructor)) {
        logger.log('stateful', constructor, 'founded');

        container.skipParentInstanceResolvingOnce(); // target instance should be instantiated from zero
        const instance = container.resolve(type);

        container.registerInstance(instance).as(type);
        configureStateful(instance, rerender, logger);
      }
    }

    if (container.parentContainer && singletonsSizeBeforeDependenciesUpdate !== container.getSingletons().size) {
      logger.log('singletons size changed, trigger root rerender');
      timerRef.current = setTimeout(() => {
        container.rootContainer.rerender();
      });
    }

    setInitialized(true);
  }, [container, dependencies]);

  useEffect(() => {
    return () => {
      if(timerRef.current) {
        clearTimeout(timerRef.current);
      }

      container?.clear();
    };
  }, []);

  if (!initialized) {
    return null;
  }

  return (
    <DiContext.Provider value={contextValue}>
      <MemoizedChildren>
        {children}
      </MemoizedChildren>
    </DiContext.Provider>
  );
};

const MemoizedChildren: FC<{ children: ReactNode }> = memo(({children}) => <Fragment>{children}</Fragment>);

const memoizedComponent = memo(Provider) as FC<ProviderProps>;
export { memoizedComponent as Provider };
export type { ProviderProps };

