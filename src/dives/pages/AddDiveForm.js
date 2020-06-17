import React, {
  useRef,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import axios from "axios";
import Input from "../../shared/components/FormElements/Input.js";
import Button from "../../shared/components/FormElements/Button";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MIN,
  VALIDATOR_MAX,
  VALIDATOR_MAXLENGTH,
} from "../../shared/utils/validators";
import { AuthContext } from "../../shared/context/auth-context";
import { useForm } from "../../shared/hooks/form-hook";
import Paper from "@material-ui/core/Paper";
import { icon, Point } from "leaflet";
import { Map, Marker, Tooltip, TileLayer } from "react-leaflet";
import "./AddDiveForm.css";
import diveSiteIcon from "../../dive-marker-grey@2x.png";
import pickedSiteIcon from "../../dive-marker@2x.png";

const parseTimeInputValue = (rawVal) => {
  // f.e. format "12:25" => b.e. format 1225
  return parseInt(rawVal.replace(":", ""));
};

const renderCustomMarker = (pickedLocation) =>
  new icon({
    iconUrl: pickedLocation ? pickedSiteIcon : diveSiteIcon,
    iconSize: new Point(8, 8),
  });

const initialInputState = {
  diveSite: {
    value: "",
    isValid: false,
  },
  date: {
    value: "",
    isValid: false,
  },
  timeIn: {
    value: "",
    isValid: false,
  },
  timeOut: {
    value: "",
    isValid: false,
  },
  lat: {
    value: "",
    isValid: false,
  },
  lng: {
    value: "",
    isValid: false,
  },
  maxDepth: {
    value: "",
    isValid: false,
  },
  psiIn: {
    value: 3000,
    isValid: true,
  },
  psiOut: {
    value: 500,
    isValid: true,
  },
  gasType: {
    value: "air",
    isValid: true,
  },
  diveType: {
    value: "boat",
    isValid: true,
  },
  dayOrNight: {
    value: "day",
    isValid: true,
  },
  waterTemp: {
    value: 75,
    isValid: true,
  },
  waterType: {
    value: "salt",
    isValid: true,
  },
  visibility: {
    value: 40,
    isValid: true,
  },
  current: {
    value: "none",
    isValid: true,
  },
  waves: {
    value: "calm",
    isValid: true,
  },
  suitType: {
    value: "3mm wetsuit",
    isValid: true,
  },
  weightUsed: {
    value: 5,
    isvalid: true,
  },
  diveComputer: {
    value: "console",
    isValid: true,
  },
  buddy: {
    value: "divemaster",
    isValid: true,
  },
  notes: {
    value: "Another great dive!",
    isValid: true,
  },
};

const AddDiveForm = () => {
  const auth = useContext(AuthContext);
  const authJsonHeader = {
    "Content-Type": "application/json",
    Authorization: "Bearer " + auth.token,
  };

  const mapRef = useRef();

  const [diveSites, setDiveSites] = useState([]);
  const [pickedSite, setPickedSite] = useState({});

  const [formState, inputHandler, setFormData] = useForm(
    initialInputState,
    false
  );

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
    setFormData(initialInputState, false);
  }, [setFormData]);

  const addDiveSubmitHandler = (e) => {
    e.preventDefault();
    const parsedTimeIn = parseTimeInputValue(formState.inputs.timeIn.value);
    const parsedTimeOut = parseTimeInputValue(formState.inputs.timeOut.value);
    axios
      .post(
        "http://localhost:5000/api/v1/dives",
        {
          diveSite: pickedSite.siteName,
          date: formState.inputs.date.value,
          timeIn: parsedTimeIn,
          timeOut: parsedTimeOut,
          maxDepth: parseInt(formState.inputs.maxDepth.value),
          user: auth.user,
          coords: {
            lat: parseFloat(pickedSite.lat),
            lng: parseFloat(pickedSite.lng),
          },
        },
        {
          headers: authJsonHeader,
        }
      )
      .then(() => {
        setFormData(initialInputState, false);
        // TODO - navigate back to dashboard or reset form
      })
      .catch((err) => console.log(`Problem adding new dive. ${err}`));
  };

  return (
    <Paper className="dive-view">
      <h1 style={{ color: "#aaa" }}>
        {`Add Dive Details `}
        <small>{"(below)"}</small>
      </h1>
      <hr />
      {formState.inputs.psiIn.value === 3000 && (
        <form onSubmit={addDiveSubmitHandler}>
          <div className="display-group">
            <div className="left-group">
              {!pickedSite.siteName && (
                <>
                  <div style={{ margin: "0 auto" }}>PICK A LOCATION</div>
                  <div style={{ margin: "0 auto" }}>
                    Zoom in to load divesite locations
                  </div>
                </>
              )}
              <div className="map-container">
                <Map
                  center={[20.3553, -87.0291]}
                  zoom={4}
                  scrollWheelZoom={true}
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
                  {pickedSite.siteName && (
                    <Marker
                      position={[pickedSite.lat, pickedSite.lng]}
                      key={`${pickedSite.siteName}${Math.random()}`}
                      icon={renderCustomMarker(true)}
                    ></Marker>
                  )}
                </Map>
              </div>
            </div>
            <div className="right-group">
              <div>
                <b>{`Dive Site: `}</b>
                {`${pickedSite.siteName || "not specified"}`}
              </div>

              <div>
                <b>{`Lattitude: `}</b>
                {`${pickedSite.lat || "not specified"}`}
              </div>
              <div>
                <b>{`Longitude: `}</b>
                {`${pickedSite.lng || "not specified"}`}
              </div>
              <Input
                id="date"
                element="input"
                type="date"
                label="Date"
                validators={[VALIDATOR_REQUIRE()]}
                errorText="required"
                onInput={inputHandler}
                initialValue={formState.inputs.date.value}
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
                initialValid={false}
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
                initialValid={false}
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
                initialValid={false}
              />
            </div>
            <div className="right-group">
              <Input
                id="airIn"
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
                id="airOut"
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
            <Button
              type="submit"
              disabled={!pickedSite.siteName && !formState.isValid}
            >
              Log it!
            </Button>
          </div>
        </form>
      )}
    </Paper>
  );
};

export default AddDiveForm;
