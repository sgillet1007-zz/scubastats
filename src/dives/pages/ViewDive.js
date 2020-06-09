import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import { icon, Point } from 'leaflet';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import diveIcon from '../../dive-marker.png';
import axios from 'axios';
import './ViewDive.css';

const renderCustomMarker = () =>
  new icon({
    iconUrl: diveIcon,
    iconSize: new Point(8, 8),
  });
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
    <Paper className='dive-view'>
      <h1>DIVE DETAILS</h1>
      <hr />
      <div className='display-group'>
        <div className='left-group'>
          <h3>{`Dive Site: ${dive.diveSite}`}</h3>
          <h3>{`Date: ${dive.date}`}</h3>
          <h3>{`Lat: ${dive.coords && dive.coords.lat}`}</h3>
          <h3>{`Lng: ${dive.coords && dive.coords.lng}`}</h3>
        </div>
        <div className='right-group'>
          <div className='map-container'>
            {' '}
            {dive.coords && (
              <Map
                center={[dive.coords.lat, dive.coords.lng]}
                zoom={5}
                scrollWheelZoom={false}
              >
                <TileLayer
                  url='https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_nolabels/{z}/{x}/{y}{r}.png'
                  attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />

                <Marker
                  position={[dive.coords.lat, dive.coords.lng]}
                  icon={renderCustomMarker()}
                >
                  <Popup>
                    {`${dive.diveSite}`}
                    <br />
                    {`${dive.date}`}
                  </Popup>
                </Marker>
              </Map>
            )}
          </div>
        </div>
      </div>
      <hr />
      <div className='display-group'>
        <div className='left-group grey'>
          <h3>{`Time In: ${dive.timeIn}`}</h3>
          <h3>{`Time Out: ${dive.timeOut}`}</h3>
          <h3>{`Max. Depth: ${dive.maxDepth}`}</h3>
        </div>
        <div className='right-group'>
          <h3>{`Air In: ${dive.airIn || 'n/a'}`}</h3>
          <h3>{`Air Out: ${dive.airOut || 'n/a'}`}</h3>
          <h3>{`Gas Type: ${dive.gasType}`}</h3>
        </div>
      </div>
      <hr />
      <div className='display-group'>
        <div className='left-group'>
          <h3>{`Dive Type: ${dive.diveType}`}</h3>
          <h3>{`Day/Night: ${dive.dayOrNight}`}</h3>
          <h3>{`Water Temp. (F): ${dive.waterTemp}`}</h3>
          <h3>{`Water Type: ${dive.waterType}`}</h3>
        </div>
        <div className='right-group'>
          <h3>{`Visibility: ${dive.visibility || 'n/a'}`}</h3>
          <h3>{`Current: ${dive.current}`}</h3>
          <h3>{`Waves: ${dive.waves}`}</h3>
        </div>
      </div>
      <hr />
      <div className='display-group'>
        <div className='left-group'>
          <h3>{`Exposure Suit: ${dive.suitType}`}</h3>
          <h3>{`Weights Used: ${dive.weights || 'n/a'}`}</h3>
          <h3>{`Computer Used: ${dive.computer || 'n/a'}`}</h3>
        </div>
        <div className='right-group'>
          <h3>{`Dive Buddy: ${dive.buddy || 'n/a'}`}</h3>
          <h3>{`Notes:`}</h3>
          <p>{dive.notes || 'Super dive!!!'}</p>
        </div>
      </div>
    </Paper>
  );
};

export default ViewDive;
