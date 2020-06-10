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
          const diveData = response.data.results.data;
          setDives(
            diveData
              .sort((a, b) => {
                return a.date > b.date ? (a.timeIn > b.timeIn ? 1 : -1) : -1;
              })
              .map((d, i) => {
                return { ...d, diveNumber: i + 1 };
              })
          );
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
          setDives(
            dives
              .filter((d) => d._id !== id)
              .sort((a, b) => {
                return a.date > b.date ? (a.timeIn > b.timeIn ? 1 : -1) : -1;
              })
              .map((d, i) => {
                return { ...d, diveNumber: i + 1 };
              })
          );
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
        getDives: getAllDives,
      }}
    >
      <>
        <section className='stats-section'>
          <DiveStats dives={dives} />
        </section>
        <section className='map-list-section'>
          <div className='table-panel'>
            <DiveTable />
          </div>
          <div className='map-panel'>
            <DiveMap />
          </div>
        </section>
      </>
    </DiveContext.Provider>
  );
};

export default DiveDashboard;
