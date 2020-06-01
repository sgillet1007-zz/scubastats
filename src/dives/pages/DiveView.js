import React, { useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import './DiveView.css';
import { DiveContext } from '../../shared/context/dive-context';

const DiveView = () => {
  const dContext = useContext(DiveContext);
  const diveId = useParams().diveId;
  useEffect(() => {
    console.log('Testing');
  }, []);

  return <h2>View Dive</h2>;
};

export default DiveView;
