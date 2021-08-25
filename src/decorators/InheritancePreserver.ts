import { inheritancePreserveSymbol, Constructor, ImplementationType } from 'cheap-di';

class InheritancePreserver {
  static constructorModified(constructor: Constructor) {
    (constructor as ImplementationType<any>)[inheritancePreserveSymbol] = constructor;
  }

  static getModifiedConstructor(constructor: Constructor) {
    return (constructor as ImplementationType<any>)[inheritancePreserveSymbol];
  }
}

export { InheritancePreserver };
