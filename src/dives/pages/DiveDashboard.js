import React, { useContext } from 'react';
import DiveMap from '../components/DiveMap';
import DiveTable from '../components/DiveTable';
import DiveStats from '../components/DiveStats';
import { DiveContext } from '../../shared/context/dive-context';

import './DiveDashboard.css';

const DiveDashboard = () => {
  const dContext = useContext(DiveContext);
  const { dives } = dContext.dives;

  return (
    <>
      <section className='stats-section'>
        <DiveStats dives={dContext.dives} />
      </section>
      <section className='map-list-section'>
        <div className='table-panel'>
          <DiveTable dives={dives} />
        </div>
        <div className='map-panel'>
          <DiveMap dives={dives} />
        </div>
      </section>
    </>
  );
};

export default DiveDashboard;
