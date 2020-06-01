import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DiveMap from '../components/DiveMap';
import DiveTable from '../components/DiveTable';
import DiveStats from '../components/DiveStats';
import { DiveContext } from '../../shared/context/dive-context';

import './DiveDashboard.css';

const authHeader = { Authorization: `Bearer ${localStorage.getItem('bt')}` };
const getDives = (setDives) => {
  axios
    .get('http://localhost:5000/api/v1/dives', {
      headers: authHeader,
    })
    .then((response) => {
      const diveDataArray = response.data.results.data;
      setDives(diveDataArray);
    });
};
const deleteDiveAndFetch = (id, setDives) => {
  axios
    .delete(`http://localhost:5000/api/v1/dives/${id}`, {
      headers: authHeader,
    })
    .then(() => {
      getDives(setDives);
    });
};

const DiveDashboard = () => {
  const [dives, setDives] = useState([]);

  const deleteDive = async (id) => {
    try {
      deleteDiveAndFetch(id, setDives);
    } catch (err) {
      console.log(err);
    }
  };

  const viewDive = (id) => {
    const singleDiveData = dives.filter((d) => d._id === id); // display this
    console.log(singleDiveData);
  };
  const editDive = (id) => {
    const singleDiveData = dives.filter((d) => d._id === id); // initialize form data with this
    console.log(singleDiveData);
  };

  useEffect(() => {
    try {
      axios
        .get('http://localhost:5000/api/v1/dives', {
          headers: authHeader,
        })
        .then((response) => {
          const diveDataArray = response.data.results.data;
          setDives(diveDataArray);
        });
    } catch (err) {
      console.log(err);
    }
  }, []);

  return (
    <DiveContext.Provider
      value={{
        dives: dives,
        deleteDive: deleteDive,
        viewDive: viewDive,
        editDive: editDive,
      }}
    >
      <>
        <section className='stats-section'>
          <DiveStats />
        </section>
        <section className='map-section'>
          <DiveMap />
        </section>
        <section className='table-section'>
          <DiveTable />
        </section>
      </>
    </DiveContext.Provider>
  );
};

export default DiveDashboard;
