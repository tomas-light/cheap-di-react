import { ImplementationType } from 'cheap-di';

const updateContextSymbol = Symbol('cheap-di-react update context');
const configuredSymbol = Symbol('cheap-di-react configured');

type StatefulImplementation = ImplementationType<any> & {
  [updateContextSymbol]: () => void;
  [configuredSymbol]: boolean;
};

export {
  updateContextSymbol,
  configuredSymbol,
};
export type {
  StatefulImplementation
};
