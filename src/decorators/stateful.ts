import { Constructor, di, ImplementationType } from 'cheap-di';
import { InheritancePreserver } from './InheritancePreserver';

const statefulSymbol = Symbol('cheap-di-react stateful');

interface StatefulImplementation<TClass> extends ImplementationType<TClass> {
  [statefulSymbol]?: boolean;
}

function stateful<TClass extends Constructor>(constructor: TClass): TClass {
  (constructor as any)[statefulSymbol] = true;
  di(constructor);
  InheritancePreserver.constructorModified(constructor);

  return constructor;
}

function removeStateful<TClass extends Constructor>(constructor: TClass) {
  if (isStateful(constructor)) {
    delete (constructor as any)[statefulSymbol];
  }
}

function isStateful<TClass extends Constructor>(constructor: TClass): boolean {
  const modifiedConstructor = InheritancePreserver.getModifiedConstructor(constructor);
  return !!modifiedConstructor
    && modifiedConstructor === constructor
    && (constructor as StatefulImplementation<TClass>)[statefulSymbol] === true
  ;
}

export { stateful, isStateful, statefulSymbol, removeStateful };
export type { StatefulImplementation };
