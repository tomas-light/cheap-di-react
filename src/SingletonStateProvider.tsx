import { createContext, FC, useContext, useEffect, useRef, useState } from 'react';
import { RegistrationType, ImplementationType, DependencyResolver } from 'cheap-di';
import { Context } from './Context';
import { SingletonImplementation } from './SingletonImplementation';
import { reconfigureObject } from './reconfigureObject';

type InternalContainer = DependencyResolver & {
  dependencies: Map<RegistrationType<any>, ImplementationType<any>>;
}

const SingletonStateProvider: FC = ({ children }) => {
  const container = useContext(Context) as any as InternalContainer;
  const [, rerender] = useState<any>();

  const getConstructors = () => {
    const constructors: SingletonImplementation[] = [];

    container.dependencies.forEach((impl, reg) => {
      const instance = container.resolve(reg);
      const constructor = (instance as Object).constructor as SingletonImplementation;
      if (!constructor?.__singleton) {
        return;
      }

      const time = new Date().getTime().toString();
      constructor.__key = time;
      constructor.__value = time;

      constructor.__updateContext = () => {
        constructor.__value = new Date().getTime().toString();
        rerender({});
      };

      if (!constructor.__configured) {
        reconfigureObject(instance);
        constructor.__configured = true;
      }

      constructor.__reactContext = createContext('');
      constructors.push(constructor);
    });

    return constructors;
  }

  const ref = useRef({ firstRender: true });
  const [singletonConstructors, setSingletonConstructors] = useState<SingletonImplementation[]>(
    () => getConstructors()
  );

  useEffect(() => {
    if (ref.current?.firstRender) {
      ref.current.firstRender = false;
    }
    else {
      const constructors = getConstructors();
      setSingletonConstructors(constructors);
    }
  }, [container.dependencies]);

  const tree = singletonConstructors.reduce((Tree, constructor) => {
    return (
      <constructor.__reactContext.Provider key={constructor.__key} value={constructor.__value}>
        {Tree}
      </constructor.__reactContext.Provider>
    );
  }, <>{children}</>)

  return tree;
};

export { SingletonStateProvider };
