import React, { useEffect, useContext } from "react";
import Paper from "@material-ui/core/Paper";
// import { useParams } from "react-router-dom";
import { icon, Point } from "leaflet";
import { Map, Marker, Popup, TileLayer } from "react-leaflet";
import diveIcon from "../../dive-marker.png";
import Input from "../../shared/components/FormElements/Input.js";
import Button from "../../shared/components/FormElements/Button";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MIN,
  VALIDATOR_MAX,
} from "../../shared/utils/validators";
import { DiveContext } from "../../shared/context/dive-context";
import { useForm } from "../../shared/hooks/form-hook";

import "./EditDive.css";

const renderCustomMarker = () =>
  new icon({
    iconUrl: diveIcon,
    iconSize: new Point(8, 8),
  });

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

// const calculateIfChanged = (current, inputs) => {
//   let isChanged = false;
//   // add logic checks
//   let inputChangeStatus = {
//     diveSite: current.diveSite !== inputs.diveSite.value,
//     date: current.date !== inputs.date.value,
//     lat: current.coords.lat !== inputs.lat.value,
//     lng: current.coords.lng !== inputs.lng.value,
//     timeIn: convertTimeVal(current.timeIn) !== inputs.timeIn.value,
//     timeOut: convertTimeVal(current.timeOut) !== inputs.timeOut.value,
//     maxDepth: current.maxDepth !== inputs.maxDepth.value,
//   };

//   Object.entries(inputChangeStatus).forEach((key, value) => {
//     if ((value = true)) {
//       isChanged = true;
//     }
//   });
//   return isChanged;
// };

const EditDive = () => {
  // const diveId = useParams().diveId;
  const dContext = useContext(DiveContext);
  const { selected } = dContext;

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
    computer: {
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
      diveSite: selected.diveSite !== formState.inputs.diveSite.value,
      date: selected.date !== formState.inputs.date.value,
      lat: selected.coords.lat !== formState.inputs.lat.value,
      lng: selected.coords.lng !== formState.inputs.lng.value,
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
      computer: selected.diveComputer !== formState.inputs.computer.value,
      buddy: selected.buddy !== formState.inputs.buddy.value,
      notes: selected.notes !== formState.inputs.notes.value,
    };
  }

  useEffect(() => {
    if (selected) {
      setFormData(initialInputState, true);
      console.log("initialInputState: ", initialInputState);
    } else {
      console.log("*** SELECTED is not defined after refresh***");
    }
    console.log("inputChangeStatus: ", inputChangeStatus);
  }, []);

  const updateDiveSubmitHandler = (e) => {
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
    dContext.updateDive(selected._id, requestBody);
    inputChangeStatus = initialInputChangeStatus;
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
              <div className="map-container">
                <Map
                  center={[selected.coords.lat, selected.coords.lng]}
                  zoom={5}
                  scrollWheelZoom={false}
                >
                  <TileLayer
                    url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_nolabels/{z}/{x}/{y}{r}.png"
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
              </div>
            </div>
            <div className="right-group">
              <Input
                id="diveSite"
                element="input"
                type="text"
                label="Dive Site"
                validators={[VALIDATOR_REQUIRE()]}
                errorText="Please enter the dive site name"
                onInput={inputHandler}
                initialValue={formState.inputs.diveSite.value}
                initialValid={true}
              />
              <Input
                id="date"
                element="input"
                type="date"
                label="Date"
                validators={[VALIDATOR_REQUIRE()]}
                errorText="Please the date of the dive"
                onInput={inputHandler}
                initialValue={formState.inputs.date.value}
                initialValid={true}
              />
              <Input
                id="lat"
                element="input"
                type="number"
                label="Latitude"
                validators={[VALIDATOR_MIN(-90), VALIDATOR_MAX(90)]}
                errorText="Please enter a latitude between -90 and 90"
                onInput={inputHandler}
                initialValue={formState.inputs.lat.value}
                initialValid={true}
              />
              <Input
                id="lng"
                element="input"
                type="number"
                label="Longitude"
                validators={[VALIDATOR_MIN(-180), VALIDATOR_MAX(180)]}
                errorText="Please enter a longitude between -180 and 180"
                onInput={inputHandler}
                initialValue={formState.inputs.lng.value}
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
                errorText="Please enter a start time for your dive"
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
                errorText="Please enter an end time for your dive"
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
                errorText="Please enter max depth"
                onInput={inputHandler}
                initialValue={formState.inputs.maxDepth.value}
                initialValid={true}
              />
            </div>
            <div className="right-group">
              <Input
                id="airIn"
                element="input"
                type="number"
                label="Air In (psi)"
                validators={[VALIDATOR_MIN(0), VALIDATOR_MAX(4000)]}
                errorText="psi value should be between 0 and 4000"
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
                errorText="psi value should be between 0 and 4000"
                onInput={inputHandler}
                initialValue={formState.inputs.psiOut.value}
                initialValid={true}
              />
              <Input
                id="gasType"
                element="input"
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
                element="input"
                type="text"
                label="Dive Type"
                onInput={inputHandler}
                initialValue={formState.inputs.diveType.value}
                initialValid={true}
              />
              <Input
                id="dayOrNight"
                element="input"
                type="text"
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
                element="input"
                type="text"
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
                element="input"
                type="text"
                label="Current"
                onInput={inputHandler}
                initialValue={formState.inputs.current.value}
                initialValid={true}
              />
              <Input
                id="waves"
                element="input"
                type="text"
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
                element="input"
                type="text"
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
                id="computer"
                element="input"
                type="text"
                label="Dive Computer Type"
                onInput={inputHandler}
                initialValue={formState.inputs.computer.value}
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

  // inputChangeStatus = {
  //   diveSite: currentDive.diveSite !== formState.inputs.diveSite.value,
  //   date: currentDive.date !== formState.inputs.date.value,
  //   lat: currentDive.coords.lat !== formState.inputs.lat.value,
  //   lng: currentDive.coords.lng !== formState.inputs.lng.value,
  //   timeIn:
  //     convertTimeVal(currentDive.timeIn) !== formState.inputs.timeIn.value,
  //   timeOut:
  //     convertTimeVal(currentDive.timeOut) !== formState.inputs.timeOut.value,
  //   maxDepth: currentDive.maxDepth !== formState.inputs.maxDepth.value,
  // };
};

export default EditDive;
