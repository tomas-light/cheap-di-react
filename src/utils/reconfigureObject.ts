import { StatefulImplementation, updateContextSymbol } from '../StatefulImplementation';
import { InternalLogger } from './InternalLogger';

function reconfigureObject(instance: Object | any, logger: InternalLogger) {
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

        const statefulInstance = instance as StatefulImplementation;
        if (statefulInstance[updateContextSymbol]) {
          statefulInstance[updateContextSymbol]();

          if (logger) {
            logger.log('CHANGE:', 'instance', instance, 'property', property);
          }
        }
      }
    };

    return config;
  }, {} as PropertyDescriptorMap);

  Object.defineProperties(instance, newConfiguration);
}

export { reconfigureObject };
