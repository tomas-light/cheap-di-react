import { FC, useMemo } from 'react';

import { Provider, ProviderProps } from './Provider';

const OneTimeProvider: FC<ProviderProps> = props => {
  const {
    dependencies,
    children,
    ...rest
  } = props;

  const registrations = useMemo(() => dependencies, []);
  return (
    <Provider dependencies={registrations} {...rest}>
      {children}
    </Provider>
  );
};


export { OneTimeProvider };
export type { ProviderProps as OneTimeProviderProps };
