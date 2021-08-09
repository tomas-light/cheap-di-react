import { createContext, FC, useContext, useEffect, useRef, useState } from 'react';
import { RegistrationType, ImplementationType, DependencyResolver, singletonSymbol } from 'cheap-di';
import { Context } from './Context';
import {
  keySymbol,
  valueSymbol,
  updateContextSymbol,
  configuredSymbol,
  reactContextSymbol,
  SingletonImplementation,
} from './SingletonImplementation';
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
      if (!constructor || !constructor[singletonSymbol]) {
        return;
      }

      const time = new Date().getTime().toString();
      constructor[keySymbol] = time;
      constructor[valueSymbol] = time;

      constructor[updateContextSymbol] = () => {
        constructor[valueSymbol] = new Date().getTime().toString();
        rerender({});
      };

      if (!constructor[configuredSymbol]) {
        reconfigureObject(instance);
        constructor[configuredSymbol] = true;
      }

      constructor[reactContextSymbol] = createContext('');
      constructors.push(constructor);
    });

    return constructors;
  };

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
    const context = constructor[reactContextSymbol];
    return (
      <context.Provider key={constructor[keySymbol]} value={constructor[valueSymbol]}>
        {Tree}
      </context.Provider>
    );
  }, <>{children}</>);

  return tree;
};

export { SingletonStateProvider };
