# cheap-di-react
Integration of cheap-di into React via React.context

## How to use

There is simple logger.
`logger.ts`
```ts
export abstract class Logger {
  abstract debug(message: string): void;
}

export class ConsoleLogger extends Logger {
  constructor(private prefix: string) {
    super();
  }

  debug(message: string) {
    console.log(`${this.prefix}: ${message}`);
  }
}

export class AnotherConsoleLogger extends Logger {
  debug(message: string) {
    console.log(message);
  }
}
```

Use it in react

`components.tsx`
```tsx
import {
  Provider,
  OneTimeProvider,
  SelfProvider,
  SelfOneTimeProvider,
} from 'cheap-di-react';
import { Logger, ConsoleLogger } from './logger';

const RootComponent = () => {
  return (
    <>
      <Provider
        // will update dependencies on each render
        dependencies={[
          dr => dr.registerType(ConsoleLogger).as(Logger).with('my message'),
        ]}
      >
        <ComponentA/>
      </Provider>

      <OneTimeProvider
        // will use initial dependecies (it uses useMemo under hood)
        dependencies={[
          dr => dr.registerType(ConsoleLogger).as(Logger).with('my message'),
        ]}
      >
        <ComponentA/>
      </OneTimeProvider>

      {/* shortcut for <Provider dependencies={[ dr => dr.registerType(ConsoleLogger) ]}> ... </Provider> */}
      <SelfProvider
        // will update dependencies on each render
        dependencies={[AnotherConsoleLogger]}
      >
        <ComponentB/>
      </SelfProvider>

      <SelfOneTimeProvider
        // will use initial dependecies (it uses useMemo under hood)
        dependencies={[AnotherConsoleLogger]}
      >
        <ComponentB/>
      </SelfOneTimeProvider>
    </>
  );
};

const ComponentA = () => {
  const logger = use(Logger);
  logger.debug('bla-bla-bla');

  return 'my layout';
};

const ComponentB = () => {
  const logger = use(AnotherConsoleLogger); // because we registered it as self
  logger.debug('bla-bla-bla');

  return 'my layout';
};
```

You can see more examples in `cheap-di-react/src/poc/components.tsx`
