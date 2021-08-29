import {
  AbstractConstructor,
  Constructor,
  ContainerImpl,
  ImplementationType,
  ImplementationTypeWithInjection,
  RegistrationType,
} from 'cheap-di';
import { isStateful, stateful } from './decorators';
import { removeStateful } from './decorators/stateful';

export class ReactContainer extends ContainerImpl {
  rerender: () => void;
  private scope: 'local' | 'global';
  skipParentInstanceOnce: boolean;

  constructor(public parentContainer?: ReactContainer) {
    super();
    this.rerender = () => undefined;
    this.scope = 'global';
    this.skipParentInstanceOnce = false;
  }

  registerType<TInstance>(implementationType: ImplementationType<TInstance>) {
    if (!isStateful(implementationType)) {
      stateful(implementationType);
    }

    const registration = super.registerType(implementationType);
    const superAsSingleton = registration.asSingleton;

    registration.asSingleton = <TBase_1 extends Partial<TInstance>>(type?: RegistrationType<TBase_1>) => {
      removeStateful(implementationType);
      return superAsSingleton(type);
    };

    return registration;
  }

  get rootContainer() {
    return this.findRootContainer();
  }

  sameParent(parentContainer?: ContainerImpl) {
    return this.parentContainer === parentContainer;
  }

  getDependencies() {
    return this.dependencies;
  }

  localScope<Callback extends (container: ReactContainer) => any>(
    callback: Callback,
  ): Callback extends (container: ReactContainer) => infer Result ? Result : void {

    this.scope = 'local';
    const result = callback(this);
    this.scope = 'global';

    return result;
  }

  skipParentInstanceResolvingOnce() {
    this.skipParentInstanceOnce = true;
  }

  getInstance<TInstance>(type: Constructor<TInstance> | AbstractConstructor<TInstance>): ImplementationTypeWithInjection<TInstance> | Object | undefined {
    if (this.instances.has(type)) {
      return this.instances.get(type)!;
    }

    if (this.parentContainer && this.scope === 'global') {
      if (this.skipParentInstanceOnce) {
        this.skipParentInstanceOnce = false;
        return undefined;
      }

      return this.parentContainer.getInstance(type);
    }

    return undefined;
  }

  getImplementation<TInstance>(type: Constructor<TInstance> | AbstractConstructor<TInstance>): ImplementationTypeWithInjection<TInstance> | Object | undefined {
    if (this.dependencies.has(type)) {
      return this.dependencies.get(type)!;
    }

    if (this.parentContainer && this.scope === 'global') {
      return this.parentContainer.getImplementation(type);
    }

    return undefined;
  }

  getSingletons() {
    const rootContainer = this.findRootContainer();
    return rootContainer.singletons;
  }

  private findRootContainer(): ReactContainer {
    if (this.parentContainer) {
      return this.parentContainer.findRootContainer();
    }

    return this;
  }
}
