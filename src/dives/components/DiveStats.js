import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

import './DiveStats.css';

const DiveStats = (props) => {
  return (
    <>
      <Card className='stats-card'>
        <CardContent>
          <Typography variant='h5' component='h2'>
            93
          </Typography>
          <Typography color='textSecondary' gutterBottom>
            Dives Logged
          </Typography>
        </CardContent>
      </Card>
      <Card className='stats-card'>
        <CardContent>
          <Typography variant='h5' component='h2'>
            253
          </Typography>
          <Typography color='textSecondary' gutterBottom>
            Hours Underwater
          </Typography>
        </CardContent>
      </Card>
      <Card className='stats-card'>
        <CardContent>
          <Typography variant='h5' component='h2'>
            125 ft
          </Typography>
          <Typography color='textSecondary' gutterBottom>
            Deepest Dive
          </Typography>
        </CardContent>
      </Card>
      <Card className='stats-card'>
        <CardContent>
          <Typography variant='h5' component='h2'>
            93 mins
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
