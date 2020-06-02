import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './ViewDive.css';

const ViewDive = () => {
  const [dive, setDive] = useState([]);
  const diveId = useParams().diveId;
  useEffect(() => {
    axios({
      method: 'get',
      url: `http://localhost:5000/api/v1/dives/${diveId}`,
      headers: { Authorization: `Bearer ${localStorage.getItem('bt')}` },
    })
      .then((response) => {
        if (response.status === 200) {
          setDive(response.data.data);
        }
      })
      .catch((err) => console.log(`Problem fetching dive data. ${err}`));
  }, [diveId]);

  return (
    <>
      <h1>VIEWING DIVE</h1>
      <h2>{`${dive.diveSite}, on ${dive.date} @ ${dive.timeIn}`}</h2>
    </>
  );
};

export default ViewDive;
