import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Input from '../../shared/components/FormElements/Input.js';
import Button from '../../shared/components/FormElements/Button';
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MIN,
  VALIDATOR_MAX,
} from '../../shared/utils/validators';
import { useForm } from '../../shared/hooks/form-hook';

import './EditDive.css';

const parseTimeInputValue = (rawVal) => {
  // f.e. format "12:25" => b.e. format 1225
  return parseInt(rawVal.replace(':', ''));
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

const EditDive = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [formState, inputHandler, setFormData] = useForm(
    initialInputState,
    true
  );
  const [dive, setDive] = useState([]);
  const diveId = useParams().diveId;
  let inputChangeStatus = {
    diveSite: false,
    date: false,
    lat: false,
    lng: false,
    timeIn: false,
    timeOut: false,
    maxDepth: false,
  };
  const detectUpdates = (i) => {
    for (let [key, value] of Object.entries(i)) {
      if (key.length && value === true) {
        return true;
      }
    }
    return false;
  };

  useEffect(() => {
    axios({
      method: 'get',
      url: `http://localhost:5000/api/v1/dives/${diveId}`,
      headers: { Authorization: `Bearer ${localStorage.getItem('bt')}` },
    })
      .then((response) => {
        if (response.status === 200) {
          const { data } = response.data;
          setDive(data);
          setFormData(
            {
              diveSite: {
                value: data.diveSite,
                isValid: true,
              },
              date: {
                value: data.date,
                isValid: true,
              },
              timeIn: {
                value: convertTimeVal(data.timeIn),
                isValid: true,
              },
              timeOut: {
                value: convertTimeVal(data.timeOut),
                isValid: true,
              },
              lat: {
                value: data.coords.lat,
                isValid: true,
              },
              lng: {
                value: data.coords.lng,
                isValid: true,
              },
              maxDepth: {
                value: data.maxDepth,
                isValid: true,
              },
            },
            true
          );
          setIsLoading(false);
        }
      })
      .catch((err) => console.log(`Problem fetching dive data. ${err}`));
  }, [diveId, setFormData]);

  const updateDiveSubmitHandler = (e) => {
    e.preventDefault();
    // include only changed fields in request body obj
    let requestBody = {};
    for (let [key, value] of Object.entries(inputChangeStatus)) {
      if (value === true) {
        if (key === 'timeIn' || key === 'timeOut') {
          requestBody[key] = parseTimeInputValue(formState.inputs[key].value);
        } else {
          requestBody[key] = formState.inputs[key].value;
        }
      }
    }
    // TODO - http put request with form data
    axios
      .put(`http://localhost:5000/api/v1/dives/${diveId}`, requestBody, {
        headers: { Authorization: `Bearer ${localStorage.getItem('bt')}` },
      })
      .then((response) => {
        if (response.status === 200) {
          console.log('Dive data updated!');
        }
      })
      .catch((err) => console.log(`Problem updating dive. ${err}`));
  };

  if (isLoading) {
    return (
      <div className='center'>
        <h2>Loading...</h2>
      </div>
    );
  } else {
    inputChangeStatus = {
      diveSite: dive.diveSite !== formState.inputs.diveSite.value,
      date: dive.date !== formState.inputs.date.value,
      lat: dive.coords.lat !== formState.inputs.lat.value,
      lng: dive.coords.lng !== formState.inputs.lng.value,
      timeIn: convertTimeVal(dive.timeIn) !== formState.inputs.timeIn.value,
      timeOut: convertTimeVal(dive.timeOut) !== formState.inputs.timeOut.value,
      maxDepth: dive.maxDepth !== formState.inputs.maxDepth.value,
    };
  }

  return (
    <div>
      <h2>EDIT DIVE DETAILS</h2>
      <form onSubmit={updateDiveSubmitHandler}>
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
          initialValue={formState.inputs.date.value}
          initialValid={true}
        />
        <Input
          id='timeIn'
          element='input'
          type='time'
          label='Time In'
          validators={[VALIDATOR_REQUIRE()]}
          errorText='Please enter a start time for your dive'
          onInput={inputHandler}
          initialValue={formState.inputs.timeIn.value}
          initialValid={true}
        />
        <Input
          id='timeOut'
          element='input'
          type='time'
          label='Time Out'
          validators={[VALIDATOR_REQUIRE()]}
          errorText='Please enter an end time for your dive'
          onInput={inputHandler}
          initialValue={formState.inputs.timeOut.value}
          initialValid={true}
        />
        <Input
          id='maxDepth'
          element='input'
          type='number'
          label='Max Depth'
          validators={[VALIDATOR_REQUIRE()]}
          errorText='Please enter max depth'
          onInput={inputHandler}
          initialValue={formState.inputs.maxDepth.value}
          initialValid={true}
        />
        <Button
          type='submit'
          disabled={!detectUpdates(inputChangeStatus) || !formState.isValid}
        >
          Update Dive
        </Button>
      </form>
    </div>
  );
};

export default EditDive;
