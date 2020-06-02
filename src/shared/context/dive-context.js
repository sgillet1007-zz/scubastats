import { createContext } from 'react';

export const DiveContext = createContext({
  dives: [],
  deleteDive: () => {},
  editDive: () => {},
  viewDive: () => {},
});
