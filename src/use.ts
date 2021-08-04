import { createContext, useContext } from 'react';
import {
  Constructor,
  AbstractConstructor
} from 'cheap-di';
import { Context } from './Context';
import { SingletonImplementation } from './SingletonImplementation';

const mockContext = createContext('');

function use<TInstance>(type: Constructor<TInstance> | AbstractConstructor<TInstance>, ...args: any[]): TInstance {
  const container = useContext(Context);
  if (!container) {
    throw new Error('Container not found. You should use Provider as one of parent nodes of this component');
  }

  const implementation = container.resolve(type, ...args);
  if (!implementation) {
    throw new Error(`Type (${type}) is not registered in cheap-di-react`);
  }

  const constructor = (implementation as Object).constructor as SingletonImplementation;
  useContext(constructor?.__singleton && constructor.__reactContext ? constructor.__reactContext : mockContext);

  return implementation;
}

export { use };
