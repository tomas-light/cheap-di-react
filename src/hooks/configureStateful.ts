import { InternalLogger, reconfigureObject } from '../utils';
import {
  configuredSymbol,
  StatefulImplementation,
  updateContextSymbol,
} from '../StatefulImplementation';

function configureStateful(
  instance: Object,
  rerender: () => void,
  logger: InternalLogger
) {
  const configurationInstance = instance as StatefulImplementation;
  if (isConfigured(configurationInstance)) {
    return;
  }

  configurationInstance[updateContextSymbol] = rerender;
  reconfigureObject(instance, logger);
  configurationInstance[configuredSymbol] = true;

  logger.log('instance', instance, 'configured');
}

function isConfigured(constructor: StatefulImplementation) {
  return constructor[configuredSymbol] === true;
}

export { configureStateful, isConfigured };
