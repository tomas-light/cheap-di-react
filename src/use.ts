import { useContext } from 'react';
import {
  Constructor,
  AbstractConstructor,
} from 'cheap-di';
import { Context } from './Context';

function use<TInstance>(type: Constructor<TInstance> | AbstractConstructor<TInstance>, ...args: any[]): TInstance {
  const container = useContext(Context);
  if (!container) {
    throw new Error('Container not found. You should use Provider as one of parent nodes of this component');
  }

  const implementation = container.resolve(type, ...args);
  if (!implementation) {
    throw new Error(`Type (${type}) is not registered in cheap-di-react`);
  }

  return implementation;
}

export { use };
