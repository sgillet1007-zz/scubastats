import React, { useContext } from 'react';
import Paper from '@material-ui/core/Paper';
import { icon, Point } from 'leaflet';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import diveIcon from '../../dive-marker.png';
import { DiveContext } from '../../shared/context/dive-context';
import './ViewDive.css';

const renderCustomMarker = () =>
  new icon({
    iconUrl: diveIcon,
    iconSize: new Point(8, 8),
  });
const ViewDive = () => {
  const dContext = useContext(DiveContext);
  const { selected } = dContext;

  return (
    selected && (
      <Paper className='dive-view'>
        <h1>{`DIVE #${selected.diveNumber} - ${selected.diveSite} - ${selected.date}`}</h1>
        <hr />
        <div className='display-group'>
          <div className='left-group'>
            <div style={{ textAlign: 'center', marginBottom: 5 }}>
              <h4>{`Dive Site: ${selected.diveSite}`}</h4>
            </div>
            <div className='map-container'>
              {selected.coords && (
                <Map
                  center={[selected.coords.lat, selected.coords.lng]}
                  zoom={5}
                  scrollWheelZoom={false}
                >
                  <TileLayer
                    url='https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_nolabels/{z}/{x}/{y}{r}.png'
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                  />

                  <Marker
                    position={[selected.coords.lat, selected.coords.lng]}
                    icon={renderCustomMarker()}
                  >
                    <Popup>
                      {`${selected.diveSite}`}
                      <br />
                      {`${selected.date}`}
                    </Popup>
                  </Marker>
                </Map>
              )}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>{`Lat: ${selected.coords && selected.coords.lat}`}</div>
              <div>{`Lng: ${selected.coords && selected.coords.lng}`}</div>
            </div>
          </div>
          <div className='right-group'>
            <h3>{`Date: ${selected.date}`}</h3>
            <h3>{`Time In: ${selected.timeIn}`}</h3>
            <h3>{`Time Out: ${selected.timeOut}`}</h3>
            <h3>{`Max. Depth: ${selected.maxDepth}`}</h3>
          </div>
        </div>
        <hr />
        <div className='display-group'>
          <div className='left-group grey'>
            <h3>{`Time In: ${selected.timeIn}`}</h3>
            <h3>{`Time Out: ${selected.timeOut}`}</h3>
            <h3>{`Max. Depth: ${selected.maxDepth}`}</h3>
          </div>
          <div className='right-group'>
            <h3>{`Air In: ${selected.airIn || 'n/a'}`}</h3>
            <h3>{`Air Out: ${selected.airOut || 'n/a'}`}</h3>
            <h3>{`Gas Type: ${selected.gasType}`}</h3>
          </div>
        </div>
        <hr />
        <div className='display-group'>
          <div className='left-group'>
            <h3>{`Dive Type: ${selected.diveType}`}</h3>
            <h3>{`Day/Night: ${selected.dayOrNight}`}</h3>
            <h3>{`Water Temp. (F): ${selected.waterTemp}`}</h3>
            <h3>{`Water Type: ${selected.waterType}`}</h3>
          </div>
          <div className='right-group'>
            <h3>{`Visibility: ${selected.visibility || 'n/a'}`}</h3>
            <h3>{`Current: ${selected.current}`}</h3>
            <h3>{`Waves: ${selected.waves}`}</h3>
          </div>
        </div>
        <hr />
        <div className='display-group'>
          <div className='left-group'>
            <h3>{`Exposure Suit: ${selected.suitType}`}</h3>
            <h3>{`Weights Used: ${selected.weights || 'n/a'}`}</h3>
            <h3>{`Computer Used: ${selected.computer || 'n/a'}`}</h3>
          </div>
          <div className='right-group'>
            <h3>{`Dive Buddy: ${selected.buddy || 'n/a'}`}</h3>
            <h3>{`Notes:`}</h3>
            <p>{selected.notes || 'Super dive!!!'}</p>
          </div>
        </div>
      </Paper>
    )
  );
};

export default ViewDive;
