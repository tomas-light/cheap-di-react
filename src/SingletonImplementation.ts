import { Context as ReactContext } from 'react';
import { ImplementationType } from 'cheap-di';

export type SingletonImplementation = ImplementationType<any> & {
  __key: any;
  __value: any;
  __updateContext: () => void;
  __configured: boolean;
  __reactContext: ReactContext<string>;
};
