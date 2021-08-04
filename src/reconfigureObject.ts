import { SingletonImplementation } from './SingletonImplementation';

function reconfigureObject(instance: Object | any) {
  const newConfiguration = Object.keys(instance).reduce((config, property) => {

    config[`_${property}`] = {
      value: instance[property],
      writable: true,
      configurable: false,
      enumerable: false,
    };
    config[property] = {
      configurable: false,
      enumerable: true,
      get() {
        return instance[`_${property}`];
      },
      set(value) {
        instance[`_${property}`] = value;

        const constructor = instance.constructor as SingletonImplementation;
        if (constructor && constructor.__updateContext) {
          constructor.__updateContext();
        }
      }
    };

    return config;
  }, {} as PropertyDescriptorMap);

  Object.defineProperties(instance, newConfiguration);
}

export { reconfigureObject };
