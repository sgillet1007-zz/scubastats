import React, {
  useEffect,
  useContext,
  useState,
  useRef,
  useCallback,
} from "react";
import Paper from "@material-ui/core/Paper";
import axios from "axios";
import { icon, Point } from "leaflet";
import { Map, Marker, Tooltip, TileLayer } from "react-leaflet";
import Input from "../../shared/components/FormElements/Input.js";
import Button from "../../shared/components/FormElements/Button";

import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MIN,
  VALIDATOR_MAX,
  VALIDATOR_MAXLENGTH,
} from "../../shared/utils/validators";
import { DiveContext } from "../../shared/context/dive-context";
import { useForm } from "../../shared/hooks/form-hook";
import diveSiteIcon from "../../dive-marker-grey@2x.png";
import pickedSiteIcon from "../../dive-marker@2x.png";

import "./EditDive.css";

// f.e. format "12:25" => b.e. format 1225
const parseTimeInputValue = (rawVal) => {
  return parseInt(rawVal.replace(":", ""));
};

const convertTimeVal = (num) => {
  const timeVal = num.toString();
  switch (timeVal.length) {
    case 4:
      return `${timeVal.slice(0, 2)}:${timeVal.slice(2)}`;
    case 3:
      return `0${timeVal.charAt(0)}:${timeVal.slice(1)}`;
    case 2:
      return `00:${timeVal}`;
    case 1:
      return `00:0${timeVal}`;
    default:
      return timeVal;
  }
};

const EditDive = () => {
  const dContext = useContext(DiveContext);
  const { selected } = dContext;

  const mapRef = useRef();

  const [diveSites, setDiveSites] = useState([]);
  const [isUpdatedLocation, setIsUpdatedLocation] = useState(false);
  const [pickedSite, setPickedSite] = useState(null);
  const [updatedDive, setUpdatedDive] = useState(null);

  const updateDive = (id, reqBody) => {
    // localStorage.setItem("selected", null);
    axios
      .put(`http://localhost:5000/api/v1/dives/${id}`, reqBody, {
        headers: { Authorization: `Bearer ${localStorage.getItem("bt")}` },
      })
      .then((response) => {
        if (response.status === 200) {
          // localStorage.setItem("selected", JSON.stringify(response.data.data));
          return response.data.data;
        }
      })
      .catch((err) => console.log(`Problem updating dive. ${err}`));
  };

  const initialInputState = selected && {
    diveSite: {
      value: selected.diveSite,
      isValid: true,
    },
    date: {
      value: selected.date,
      isValid: true,
    },
    timeIn: {
      value: selected.timeIn && convertTimeVal(selected.timeIn),
      isValid: true,
    },
    timeOut: {
      value: selected.timeOut && convertTimeVal(selected.timeOut),
      isValid: true,
    },
    lat: {
      value: selected.coords && selected.coords.lat,
      isValid: true,
    },
    lng: {
      value: selected.coords && selected.coords.lng,
      isValid: true,
    },
    maxDepth: {
      value: selected.maxDepth,
      isValid: true,
    },
    psiIn: {
      value: selected.psiIn,
      isValid: true,
    },
    psiOut: {
      value: selected.psiOut,
      isValid: true,
    },
    gasType: {
      value: selected.gasType,
      isValid: true,
    },
    diveType: {
      value: selected.diveType,
      isValid: true,
    },
    dayOrNight: {
      value: selected.dayOrNight,
      isValid: true,
    },
    waterTemp: {
      value: selected.waterTemp,
      isValid: true,
    },
    waterType: {
      value: selected.waterType,
      isValid: true,
    },
    visibility: {
      value: selected.visibility,
      isValid: true,
    },
    current: {
      value: selected.current,
      isValid: true,
    },
    waves: {
      value: selected.waves,
      isValid: true,
    },
    suitType: {
      value: selected.suitType,
      isValid: true,
    },
    weightUsed: {
      value: selected.weightUsed,
      isvalid: true,
    },
    diveComputer: {
      value: selected.diveComputer,
      isValid: true,
    },
    buddy: {
      value: selected.buddy,
      isValid: true,
    },
    notes: {
      value: selected.notes,
      isValid: true,
    },
  };

  const renderCustomMarker = (pickedLocation) =>
    new icon({
      iconUrl: pickedLocation ? pickedSiteIcon : diveSiteIcon,
      iconSize: new Point(8, 8),
    });

  const [formState, inputHandler, setFormData] = useForm(
    initialInputState,
    true
  );

  const initialInputChangeStatus = {
    diveSite: false,
    date: false,
    lat: false,
    lng: false,
    timeIn: false,
    timeOut: false,
    maxDepth: false,
    psiIn: false,
    psiOut: false,
    gasType: false,
    diveType: false,
    dayOrNight: false,
    waterTemp: false,
    waterType: false,
    visibility: false,
    current: false,
    waves: false,
    suitType: false,
    weightUsed: false,
    computer: false,
    buddy: false,
    notes: false,
  };

  let inputChangeStatus = initialInputChangeStatus;

  const detectUpdates = (i) => {
    for (let [key, value] of Object.entries(i)) {
      if (key.length && value === true) {
        return true;
      }
    }
    return false;
  };

  if (selected) {
    inputChangeStatus = {
      diveSite: isUpdatedLocation && pickedSite !== null,
      date: selected.date !== formState.inputs.date.value,
      timeIn: convertTimeVal(selected.timeIn) !== formState.inputs.timeIn.value,
      timeOut:
        convertTimeVal(selected.timeOut) !== formState.inputs.timeOut.value,
      maxDepth: selected.maxDepth !== formState.inputs.maxDepth.value,
      psiIn: selected.psiIn !== formState.inputs.psiIn.value,
      psiOut: selected.psiOut !== formState.inputs.psiOut.value,
      gasType: selected.gasType !== formState.inputs.gasType.value,
      diveType: selected.diveType !== formState.inputs.diveType.value,
      dayOrNight: selected.dayOrNight !== formState.inputs.dayOrNight.value,
      waterTemp: selected.waterTemp !== formState.inputs.waterTemp.value,
      waterType: selected.waterType !== formState.inputs.waterType.value,
      visibility: selected.visibility !== formState.inputs.visibility.value,
      current: selected.current !== formState.inputs.current.value,
      waves: selected.waves !== formState.inputs.waves.value,
      suitType: selected.suitType !== formState.inputs.suitType.value,
      weightUsed: selected.weightUsed !== formState.inputs.weightUsed.value,
      diveComputer:
        selected.diveComputer !== formState.inputs.diveComputer.value,
      buddy: selected.buddy !== formState.inputs.buddy.value,
      notes: selected.notes !== formState.inputs.notes.value,
    };
  } else if (updatedDive) {
    // ...
  }
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

  const fetchAndSetDiveSitesOnMap = useCallback(() => {
    axios
      .get("http://localhost:5000/api/v1/divesites")
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
      .catch((err) => {
        console.log(`Problem fetching divesite location data. ${err}`);
        setDiveSites([]);
      });
  }, []);

  useEffect(() => {
    if (selected) {
      setFormData(initialInputState, formState.isValid);
      setPickedSite({
        siteName: selected.diveSite,
        lat: selected.coords.lat,
        lng: selected.coords.lng,
      });
    } else {
      console.log("*** SELECTED is no longer defined *** ");
      console.log("updated dive: ", updatedDive);
    }
  }, []);

  const updateDiveSubmitHandler = async (e) => {
    e.preventDefault();
    let requestBody = {}; // only includes changed fields (as tracked by inputChangeStatus)
    for (let [key, value] of Object.entries(inputChangeStatus)) {
      if (value === true) {
        if (key === "timeIn" || key === "timeOut") {
          requestBody[key] = parseTimeInputValue(formState.inputs[key].value);
        } else {
          requestBody[key] = formState.inputs[key].value;
        }
      }
    }
    requestBody.siteName = pickedSite.siteName;
    requestBody.coords = { lat: pickedSite.lat, lng: pickedSite.lng };
    const updated = await updateDive(selected._id, requestBody);

    setUpdatedDive(updated);
    // localStorage.setItem("selected", updated);
    // setTimeout(() => {
    //   console.log("localstorage: ", localStorage.getItem("selected"));
    //   console.log("local state: ", updated);
    // }, 2200);
    inputChangeStatus = initialInputChangeStatus;
  };

  const resetLocationHandler = (e) => {
    e.preventDefault();
    setPickedSite(null);
    setIsUpdatedLocation(true);
  };

  return (
    selected && (
      <Paper className="dive-view">
        <h1 style={{ color: "#aaa" }}>
          {`Dive # ${selected.diveNumber} : `}
          <small>Edit details below...</small>
        </h1>
        <hr />
        <form onSubmit={updateDiveSubmitHandler}>
          <div className="display-group">
            <div className="left-group">
              {pickedSite === null && (
                <>
                  <div style={{ margin: "0 auto" }}>PICK A LOCATION</div>
                  <div style={{ margin: "0 auto" }}>
                    Zoom in to load divesite locations
                  </div>
                </>
              )}
              <div className="map-container">
                <Map
                  center={[selected.coords.lat, selected.coords.lng]}
                  zoom={4}
                  scrollWheelZoom={false}
                  ref={mapRef}
                  onmoveend={(e) => {
                    if (mapRef.current.leafletElement.getZoom() > 6) {
                      fetchAndSetDiveSitesOnMap();
                    }
                  }}
                >
                  <TileLayer
                    url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_nolabels/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                  />

                  {diveSites.length &&
                    !pickedSite &&
                    diveSites.map((d) => {
                      return (
                        <Marker
                          position={[d.lat, d.lng]}
                          key={`${d.siteName}${Math.random()}`}
                          icon={renderCustomMarker()}
                          onClick={() => {
                            setFormData(
                              {
                                ...formState.inputs,
                                diveSite: {
                                  value: d.siteName,
                                  isValid: true,
                                },
                                lat: { value: d.lat, isValid: true },
                                lng: { value: d.lng, isValid: true },
                              },
                              formState.isValid
                            );
                            setPickedSite({
                              siteName: d.siteName,
                              lat: d.lat,
                              lng: d.lng,
                            });
                          }}
                        >
                          <Tooltip>{`${d.siteName}`}</Tooltip>
                        </Marker>
                      );
                    })}
                  {pickedSite && pickedSite.lat && (
                    <Marker
                      position={[pickedSite.lat, pickedSite.lng]}
                      icon={renderCustomMarker(true)}
                    ></Marker>
                  )}
                </Map>
              </div>
            </div>
            <div className="right-group">
              <div>
                <b>{`Dive Site: `}</b>
                {`${(pickedSite && pickedSite.siteName) || "not specified"}`}
              </div>

              <div>
                <b>{`Lattitude: `}</b>
                {`${(pickedSite && pickedSite.lat) || "not specified"}`}
              </div>
              <div>
                <b>{`Longitude: `}</b>
                {`${(pickedSite && pickedSite.lng) || "not specified"}`}
              </div>
              <Button onClick={resetLocationHandler}>Clear Location</Button>
              <Input
                id="date"
                element="input"
                type="date"
                label="Date"
                validators={[VALIDATOR_REQUIRE()]}
                errorText="required"
                onInput={inputHandler}
                initialValue={formState.inputs.date.value}
                initialValid={true}
              />
            </div>
          </div>
          <hr />
          <div className="display-group">
            <div className="left-group">
              <Input
                id="timeIn"
                element="input"
                type="time"
                label="Time In"
                validators={[VALIDATOR_REQUIRE()]}
                errorText="required"
                onInput={inputHandler}
                initialValue={formState.inputs.timeIn.value}
                initialValid={true}
              />
              <Input
                id="timeOut"
                element="input"
                type="time"
                label="Time Out"
                validators={[VALIDATOR_REQUIRE()]}
                errorText="required"
                onInput={inputHandler}
                initialValue={formState.inputs.timeOut.value}
                initialValid={true}
              />
              <Input
                id="maxDepth"
                element="input"
                type="number"
                label="Max Depth"
                validators={[VALIDATOR_REQUIRE()]}
                errorText="required"
                onInput={inputHandler}
                initialValue={formState.inputs.maxDepth.value}
                initialValid={true}
              />
            </div>
            <div className="right-group">
              <Input
                id="psiIn"
                element="input"
                type="number"
                label="Air In (psi)"
                validators={[VALIDATOR_MIN(0), VALIDATOR_MAX(4000)]}
                errorText="psi value between 0 and 4000"
                onInput={inputHandler}
                initialValue={formState.inputs.psiIn.value}
                initialValid={true}
              />
              <Input
                id="psiOut"
                element="input"
                type="number"
                label="Air Out (psi)"
                validators={[VALIDATOR_MIN(0), VALIDATOR_MAX(4000)]}
                errorText="psi value between 0 and 4000"
                onInput={inputHandler}
                initialValue={formState.inputs.psiOut.value}
                initialValid={true}
              />
              <Input
                id="gasType"
                element="select"
                options={["air", "nitrox", "trimix", "heliox"]}
                type="text"
                label="Gas Type"
                onInput={inputHandler}
                initialValue={formState.inputs.gasType.value}
                initialValid={true}
              />
            </div>
          </div>
          <hr />
          <div className="display-group">
            <div className="left-group">
              <Input
                id="diveType"
                element="select"
                options={["boat", "shore"]}
                label="Dive Type"
                onInput={inputHandler}
                initialValue={formState.inputs.diveType.value}
                initialValid={true}
              />
              <Input
                id="dayOrNight"
                element="select"
                options={["day", "night"]}
                label="Day/Night"
                onInput={inputHandler}
                initialValue={formState.inputs.dayOrNight.value}
                initialValid={true}
              />
              <Input
                id="waterTemp"
                element="input"
                type="number"
                label="Water Temp. (F)"
                onInput={inputHandler}
                initialValue={formState.inputs.waterTemp.value}
                initialValid={true}
              />
            </div>
            <div className="right-group">
              <Input
                id="waterType"
                element="select"
                options={["fresh", "salt", "brackish"]}
                label="Water Type"
                onInput={inputHandler}
                initialValue={formState.inputs.waterType.value}
                initialValid={true}
              />
              <Input
                id="visibility"
                element="input"
                type="number"
                label="Visibility"
                onInput={inputHandler}
                initialValue={formState.inputs.visibility.value}
                initialValid={true}
              />
              <Input
                id="current"
                element="select"
                options={["strong", "moderate", "gentle", "none"]}
                label="Current"
                onInput={inputHandler}
                initialValue={formState.inputs.current.value}
                initialValid={true}
              />
              <Input
                id="waves"
                element="select"
                options={["large", "moderate", "small", "calm"]}
                label="Waves"
                onInput={inputHandler}
                initialValue={formState.inputs.waves.value}
                initialValid={true}
              />
            </div>
          </div>
          <hr />
          <div className="display-group">
            <div className="left-group">
              <Input
                id="suitType"
                element="select"
                options={[
                  "swimsuit",
                  "dive skin",
                  "shorty",
                  "3mm wetsuit",
                  "5mm wetsuit",
                  "7mm wetsuit",
                  "semi-dry wetsuit",
                  "dry suit",
                ]}
                label="Suit Type"
                onInput={inputHandler}
                initialValue={formState.inputs.suitType.value}
                initialValid={true}
              />
              <Input
                id="weightUsed"
                element="input"
                type="number"
                label="Weights (lbs)"
                onInput={inputHandler}
                initialValue={formState.inputs.weightUsed.value}
                initialValid={true}
              />
              <Input
                id="diveComputer"
                element="select"
                options={["console", "wrist", "watch"]}
                label="Dive Computer Type"
                onInput={inputHandler}
                initialValue={formState.inputs.diveComputer.value}
                initialValid={true}
              />
            </div>
            <div className="right-group">
              <Input
                id="buddy"
                element="input"
                type="text"
                label="Dive Buddy"
                onInput={inputHandler}
                initialValue={formState.inputs.buddy.value}
                initialValid={true}
              />
              <Input
                id="notes"
                element="textarea"
                label="Notes"
                onInput={inputHandler}
                initialValue={formState.inputs.notes.value}
                initialValid={true}
                validators={[VALIDATOR_MAXLENGTH(280)]}
              />
            </div>
          </div>
          <div className="display-group">
            <Button type="submit" disabled={!detectUpdates(inputChangeStatus)}>
              Update Dive
            </Button>
          </div>
        </form>
      </Paper>
    )
  );
};

export default EditDive;
