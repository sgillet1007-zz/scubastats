import React, { useRef, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import Input from '../../shared/components/FormElements/Input.js';
import Button from '../../shared/components/FormElements/Button';
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MIN,
  VALIDATOR_MAX,
} from '../../shared/utils/validators';
import { AuthContext } from '../../shared/context/auth-context';
import { useForm } from '../../shared/hooks/form-hook';
import Paper from '@material-ui/core/Paper';
import { icon, Point } from 'leaflet';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import './AddDiveForm.css';

const parseTimeInputValue = (rawVal) => {
  // f.e. format "12:25" => b.e. format 1225
  return parseInt(rawVal.replace(':', ''));
};

const initialInputState = {
  diveSite: {
    value: '',
    isValid: false,
  },
  date: {
    value: '',
    isValid: false,
  },
  timeIn: {
    value: '',
    isValid: false,
  },
  timeOut: {
    value: '',
    isValid: false,
  },
  lat: {
    value: '',
    isValid: false,
  },
  lng: {
    value: '',
    isValid: false,
  },
  maxDepth: {
    value: '',
    isValid: false,
  },
};

const AddDiveForm = () => {
  const mapRef = useRef();
  const [diveSites, setDiveSites] = useState([]);
  const [currentZoom, setCurrentZoom] = useState(3);
  const [pickedSite, setPickedSite] = useState({
    name: '',
    lat: null,
    lng: null,
  });
  // const [locationMapMode, setLocationMapMode] = useState(true);
  const [formState, inputHandler, setFormData] = useForm(
    initialInputState,
    false
  );
  const auth = useContext(AuthContext);
  const authJsonHeader = {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + auth.token,
  };

  const getMapBoundCoords = () => {
    const mapBounds = mapRef.current.leafletElement.getBounds();
    let lats = [mapBounds._southWest.lat, mapBounds._northEast.lat];
    let lngs = [mapBounds._southWest.lng, mapBounds._northEast.lng];

    const maxLat = Math.max(...lats);
    const maxLng = Math.max(...lngs);
    const minLat = Math.min(...lats);
    const minLng = Math.min(...lngs);

    return { maxLat, minLat, maxLng, minLng };
  };
  const fetchSetCurrentMapZoom = () => {
    const currentZoom = mapRef.current.leafletElement.getZoom();
    setCurrentZoom(currentZoom);
  };

  const fetchAndSetDiveSitesOnMap = () => {
    if (currentZoom >= 8) {
      axios
        .get('http://localhost:5000/api/v1/divesites')
        .then((response) => {
          if (response.status === 200) {
            let sitesWithinMapBounds = response.data.results.filter((ds) => {
              let isWithinMapView = false;
              const mapCoords = getMapBoundCoords();
              if (ds.lat > mapCoords.minLat && ds.lat < mapCoords.maxLat) {
                if (ds.lng > mapCoords.minLng && ds.lng < mapCoords.maxLng) {
                  isWithinMapView = true;
                }
              }
              return isWithinMapView;
            });
            setDiveSites(sitesWithinMapBounds);
          }
        })
        .catch((err) =>
          console.log(`Problem fetching divesite location data. ${err}`)
        );
    } else {
      setDiveSites([]);
    }
  };

  useEffect(() => {
    fetchAndSetDiveSitesOnMap();
  }, []);

  let pickedDivesite = {
    name: '',
    lat: null,
    lng: null,
  };
  const addDiveSubmitHandler = (e) => {
    e.preventDefault();
    const parsedTimeIn = parseTimeInputValue(formState.inputs.timeIn.value);
    const parsedTimeOut = parseTimeInputValue(formState.inputs.timeOut.value);
    axios
      .post(
        'http://localhost:5000/api/v1/dives',
        {
          diveSite: formState.inputs.diveSite.value,
          date: formState.inputs.date.value,
          timeIn: parsedTimeIn,
          timeOut: parsedTimeOut,
          maxDepth: parseInt(formState.inputs.maxDepth.value),
          user: auth.user,
          coords: {
            lat: parseFloat(formState.inputs.lat.value),
            lng: parseFloat(formState.inputs.lng.value),
          },
        },
        {
          headers: authJsonHeader,
        }
      )
      .then(() => {
        setFormData(initialInputState, false);
        // TODO - navigate back to dashboard
      })
      .catch((err) => console.log(`Problem adding new dive. ${err}`));
  };

  return (
    <div>
      {pickedSite.name.length === 0 && (
        <>
          <h2>
            {diveSites.length
              ? 'Click on dive sites until you find your dive loaction'
              : 'Zoom in to show known dive sites on the map'}
          </h2>
          <Paper className='map-container'>
            <Map
              center={[25, -75]}
              zoom={3}
              scrollWheelZoom={true}
              ref={mapRef}
              onmoveend={(e) => {
                fetchSetCurrentMapZoom();
                fetchAndSetDiveSitesOnMap();
              }}
            >
              <TileLayer
                url='https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_nolabels/{z}/{x}/{y}{r}.png'
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              />
              {diveSites.length &&
                diveSites.map((d) => {
                  return (
                    <Marker
                      position={[d.lat, d.lng]}
                      key={`${d.siteName}${Math.random()}`}
                    >
                      <Popup>
                        {`${d.siteName}`}
                        <br />
                        <button
                          onClick={() => {
                            setPickedSite({
                              name: d.siteName,
                              lat: d.lat,
                              lng: d.lng,
                            });
                            setFormData(
                              {
                                ...initialInputState,
                                diveSite: {
                                  value: d.siteName,
                                  isValid: true,
                                },
                                lat: {
                                  value: d.lat,
                                  isValid: true,
                                },
                                lng: {
                                  value: d.lng,
                                  isValid: true,
                                },
                              },
                              false
                            );
                            setDiveSites({
                              _id: d._id,
                              siteName: d.siteName,
                              lat: d.lat,
                              lng: d.lng,
                            });
                          }}
                        >
                          Pick This Site
                        </button>
                      </Popup>
                    </Marker>
                  );
                })}
            </Map>
          </Paper>
        </>
      )}
      {pickedSite.name !== '' && (
        <form onSubmit={addDiveSubmitHandler}>
          <Input
            id='diveSite'
            element='input'
            type='text'
            label='Dive Site'
            validators={[VALIDATOR_REQUIRE()]}
            errorText='Please enter the dive site name'
            onInput={inputHandler}
            initialValue={formState.inputs.diveSite.value}
            initialValid={true}
          />
          <Input
            id='lat'
            element='input'
            type='number'
            label='Latitude'
            validators={[VALIDATOR_MIN(-90), VALIDATOR_MAX(90)]}
            errorText='Please enter a latitude between -90 and 90'
            onInput={inputHandler}
            initialValue={formState.inputs.lat.value}
            initialValid={true}
          />
          <Input
            id='lng'
            element='input'
            type='number'
            label='Longitude'
            validators={[VALIDATOR_MIN(-180), VALIDATOR_MAX(180)]}
            errorText='Please enter a longitude between -180 and 180'
            onInput={inputHandler}
            initialValue={formState.inputs.lng.value}
            initialValid={true}
          />
          <Input
            id='date'
            element='input'
            type='date'
            label='Date'
            validators={[VALIDATOR_REQUIRE()]}
            errorText='Please the date of the dive'
            onInput={inputHandler}
          />
          <Input
            id='timeIn'
            element='input'
            type='time'
            label='Time In'
            validators={[VALIDATOR_REQUIRE()]}
            errorText='Please enter a start time for your dive'
            onInput={inputHandler}
          />
          <Input
            id='timeOut'
            element='input'
            type='time'
            label='Time Out'
            validators={[VALIDATOR_REQUIRE()]}
            errorText='Please enter an end time for your dive'
            onInput={inputHandler}
          />
          <Input
            id='maxDepth'
            element='input'
            type='number'
            label='Max Depth'
            validators={[VALIDATOR_REQUIRE()]}
            errorText='Please enter max depth'
            onInput={inputHandler}
          />
          <Button
            type='submit'
            disabled={!formState.isValid}
            onClick={() => window.location.reload()} // TODO - clear inputs without page reload
          >
            Log it!
          </Button>
        </form>
      )}
    </div>
  );
};

export default AddDiveForm;
