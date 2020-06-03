import React from 'react';
import Paper from '@material-ui/core/Paper';
import { icon, Point } from 'leaflet';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import diveIcon from '../../dive-marker.png';

import './DiveMap.css';

const renderCustomMarker = () =>
  new icon({
    iconUrl: diveIcon,
    iconSize: new Point(8, 8),
  });

const DiveMap = (props) => {
  const { dives } = props;
  return (
    <Paper>
      <Map center={[10.505, -165]} zoom={3} scrollWheelZoom={false}>
        <TileLayer
          url='https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_nolabels/{z}/{x}/{y}{r}.png'
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />

        {dives.map((d) => {
          return (
            <Marker
              position={[d.coords.lat, d.coords.lng]}
              icon={renderCustomMarker()}
            >
              <Popup>
                {`${d.diveSite}`}
                <br />
                {`${d.date}`}
              </Popup>
            </Marker>
          );
        })}
      </Map>
    </Paper>
  );
};

export default DiveMap;
