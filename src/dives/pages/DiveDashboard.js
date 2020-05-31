import React, { useEffect, useState } from 'react';
import DiveMap from '../components/DiveMap';
import DiveTable from '../components/DiveTable';
import DiveStats from '../components/DiveStats';
import { DiveContext } from '../../shared/context/dive-context';

import './DiveDashboard.css';

const DiveDashboard = () => {
  const [dives, setDives] = useState([]);

  useEffect(() => {
    try {
      async function fetchDives() {
        const userDives = await fetch('http://localhost:5000/api/v1/dives', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + localStorage.getItem('bt'),
          },
        });
        let diveData;
        userDives.text().then((result) => {
          diveData = { ...JSON.parse(result) }.results.data;
          setDives(diveData);
        });
      }
      fetchDives();
    } catch (err) {
      console.log(err);
    }
  }, []);

  return (
    <DiveContext.Provider value={{ dives: dives }}>
      <>
        <section className='stats-section'>
          <DiveStats />
        </section>
        <section className='map-section'>
          <DiveMap dives={dives} />
        </section>
        <section className='table-section'>
          <DiveTable />
        </section>
      </>
    </DiveContext.Provider>
  );
};

export default DiveDashboard;
