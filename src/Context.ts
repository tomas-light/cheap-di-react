import { createContext } from 'react';
import { ContainerImpl } from 'cheap-di';

export const Context = createContext<ContainerImpl>(new ContainerImpl());
