import { createContext } from 'react';

export const DiveContext = createContext({
  dives: [],
  selected: {},
  deleteDive: () => {},
  selectDive: () => {},
});
