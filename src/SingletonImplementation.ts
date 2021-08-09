import { Context as ReactContext } from 'react';
import { ImplementationType } from 'cheap-di';

const keySymbol = Symbol('cheap-di-react key');
const valueSymbol = Symbol('cheap-di-react value');
const updateContextSymbol = Symbol('cheap-di-react update context');
const configuredSymbol = Symbol('cheap-di-react configured');
const reactContextSymbol = Symbol('cheap-di-react react context');

type SingletonImplementation = ImplementationType<any> & {
  [keySymbol]: any;
  [valueSymbol]: any;
  [updateContextSymbol]: () => void;
  [configuredSymbol]: boolean;
  [reactContextSymbol]: ReactContext<string>;
};

export {
  keySymbol,
  valueSymbol,
  updateContextSymbol,
  configuredSymbol,
  reactContextSymbol,
};
export type {
  SingletonImplementation
};
