import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import DiveMap from '../components/DiveMap';
import DiveTable from '../components/DiveTable';
import DiveStats from '../components/DiveStats';
import { DiveContext } from '../../shared/context/dive-context';

import './DiveDashboard.css';

const DiveDashboard = () => {
  const [dives, setDives] = useState([]);

  const getAllDives = useCallback(() => {
    axios({
      method: 'get',
      url: 'http://localhost:5000/api/v1/dives',
      headers: { Authorization: `Bearer ${localStorage.getItem('bt')}` },
    })
      .then((response) => {
        if (response.status === 200) {
          setDives(response.data.results.data);
        }
      })
      .catch((err) => console.log(`Problem fetching dive data. ${err}`));
  }, []);

  const deleteDive = (id) => {
    axios
      .delete(`http://localhost:5000/api/v1/dives/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('bt')}` },
      })
      .then((response) => {
        if (response.status === 200) {
          setDives(dives.filter((d) => d._id !== id));
        }
      })
      .catch((err) =>
        console.log(`Problem deleting the requested dive. ${err}`)
      );
  };

  useEffect(() => {
    getAllDives();
  }, [getAllDives]);

  return (
    <DiveContext.Provider
      value={{
        dives: dives,
        deleteDive: deleteDive,
        editDive: () => {},
        viewDive: () => {},
      }}
    >
      <>
        <section className='stats-section'>
          <DiveStats dives={dives} />
        </section>
        <section className='table-section'>
          <DiveTable />
        </section>
        <section className='map-section'>
          <DiveMap />
        </section>
      </>
    </DiveContext.Provider>
  );
};

export default DiveDashboard;
