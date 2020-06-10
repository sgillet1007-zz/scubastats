import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

import './DiveStats.css';

const getTotalHours = (dives) => {
  const durationArray = dives.map((d) => d.diveDuration);
  const durationSum = durationArray.reduce((acc, current) => {
    return acc + current;
  }, 0);
  return Math.round(durationSum / 60);
};

const getDeepestDive = (dives) => {
  const depthArray = dives.map((d) => d.maxDepth);
  return Math.max(...depthArray);
};

const getLongest = (dives) => {
  const durationArray = dives.map((d) => d.diveDuration);
  return Math.max(...durationArray);
};

const DiveStats = (props) => {
  return (
    <>
      <Card className='stats-card'>
        <CardContent>
          <Typography variant='h5' component='h2'>
            {props.dives.length}
          </Typography>
          <Typography color='textSecondary' gutterBottom>
            Dives Logged
          </Typography>
        </CardContent>
      </Card>
      <Card className='stats-card'>
        <CardContent>
          <Typography variant='h5' component='h2'>
            {props.dives.length ? getTotalHours(props.dives) : 0}
          </Typography>
          <Typography color='textSecondary' gutterBottom>
            Hours Underwater
          </Typography>
        </CardContent>
      </Card>
      <Card className='stats-card'>
        <CardContent>
          <Typography variant='h5' component='h2'>
            {`${props.dives.length ? getDeepestDive(props.dives) : 0} ft`}
          </Typography>
          <Typography color='textSecondary' gutterBottom>
            Deepest Dive
          </Typography>
        </CardContent>
      </Card>
      <Card className='stats-card'>
        <CardContent>
          <Typography variant='h5' component='h2'>
            {`${props.dives.length ? getLongest(props.dives) : 0} mins`}
          </Typography>
          <Typography color='textSecondary' gutterBottom>
            Longest Dive
          </Typography>
        </CardContent>
      </Card>
    </>
  );
};

export default DiveStats;
