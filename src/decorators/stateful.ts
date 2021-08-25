import { Constructor, ImplementationType } from 'cheap-di';
import { InheritancePreserver } from './InheritancePreserver';

const statefulSymbol = Symbol('cheap-di-react stateful');

interface StatefulImplementation<TClass> extends ImplementationType<TClass> {
  [statefulSymbol]?: boolean;
}

function stateful<TClass extends Constructor>(constructor: TClass): TClass {
  (constructor as any)[statefulSymbol] = true;
  InheritancePreserver.constructorModified(constructor);

  return constructor;
}

function isStateful<TClass extends Constructor>(constructor: TClass): boolean {
  const modifiedConstructor = InheritancePreserver.getModifiedConstructor(constructor);
  return !!modifiedConstructor
    && modifiedConstructor === constructor
    && (constructor as StatefulImplementation<TClass>)[statefulSymbol] === true
  ;
}

export { stateful, isStateful, statefulSymbol };
export type { StatefulImplementation };
