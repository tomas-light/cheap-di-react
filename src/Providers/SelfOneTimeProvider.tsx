import { FC, useMemo } from 'react';

import { SelfProvider, SelfProviderProps } from './SelfProvider';

const SelfOneTimeProvider: FC<SelfProviderProps> = props => {
  const {
    dependencies,
    children,
    ...rest
  } = props;

  const registrations = useMemo(() => dependencies, []);
  return (
    <SelfProvider dependencies={registrations} {...rest}>
      {children}
    </SelfProvider>
  );
};


export { SelfOneTimeProvider };
export type { SelfProviderProps as SelfOneTimeProviderProps };

