import React, { useContext } from 'react';
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
  const [formState, inputHandler, setFormData] = useForm(
    initialInputState,
    false
  );
  const auth = useContext(AuthContext);
  const authJsonHeader = {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + auth.token,
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
        console.log('formState: ', formState);
        // TODO - navigate back to dashboard
      })
      .catch((err) => console.log(`Problem adding new dive. ${err}`));
  };

  return (
    <div>
      <h2>ENTER DIVE DETAILS</h2>
      <form onSubmit={addDiveSubmitHandler}>
        <Input
          id='diveSite'
          element='input'
          type='text'
          label='Dive Site'
          validators={[VALIDATOR_REQUIRE()]}
          errorText='Please enter the dive site name'
          onInput={inputHandler}
        />
        <Input
          id='lat'
          element='input'
          type='number'
          label='Latitude'
          validators={[VALIDATOR_MIN(-90), VALIDATOR_MAX(90)]}
          errorText='Please enter a latitude between -90 and 90'
          onInput={inputHandler}
        />
        <Input
          id='lng'
          element='input'
          type='number'
          label='Longitude'
          validators={[VALIDATOR_MIN(-180), VALIDATOR_MAX(180)]}
          errorText='Please enter a longitude between -180 and 180'
          onInput={inputHandler}
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
    </div>
  );
};

export default AddDiveForm;
