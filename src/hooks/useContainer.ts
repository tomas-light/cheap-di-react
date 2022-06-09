import { useContext, useEffect, useState } from 'react';
import { DiContext, DiContextType } from '../DiContext';
import { ReactContainer } from '../ReactContainer';
import { InternalLogger } from '../utils';

type HookResult = [
  DiContextType,
  () => void,
];

function useContainer(logger: InternalLogger): HookResult {
  const parentContainer = useContext(DiContext).container as ReactContainer;

  const [contextValue, setContextValue] = useState<DiContextType>({ container: undefined });

  useEffect(() => {
    if (!contextValue.container) {
      if (parentContainer) {
        logger.log('create container');
        contextValue.container = new ReactContainer(parentContainer);
      }
      else {
        logger.log('create root container');
        contextValue.container = new ReactContainer();
        contextValue.container.rerender = () => setContextValue({ ...contextValue });
      }

      setContextValue({ container: contextValue.container });
    }

    if (!parentContainer || contextValue.container.sameParent(parentContainer)) {
      return;
    }

    // exceptional case: if by some of reasons parent container will be changed
    // possible, unreachable case

    logger.log('RECREATE container');
    setContextValue({ container: new ReactContainer(parentContainer) });
  }, [parentContainer]);

  const rerender = () => {
    setContextValue({ ...contextValue });
  };

  return [
    contextValue,
    rerender,
  ];
}

export { useContainer };
