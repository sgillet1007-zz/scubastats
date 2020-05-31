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
  return (
    <Paper>
      <Map center={[20.505, -79.09]} zoom={5} scrollWheelZoom={false}>
        <TileLayer
          url='https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_nolabels/{z}/{x}/{y}{r}.png'
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={[20.505, -79.09]} icon={renderCustomMarker()}>
          <Popup>
            A pretty CSS3 popup.
            <br />
            Easily customizable.
          </Popup>
        </Marker>
      </Map>
    </Paper>
  );
};

export default DiveMap;
