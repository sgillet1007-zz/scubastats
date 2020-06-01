import React, { useState, useContext } from 'react';
import axios from 'axios';
import Input from '../../shared/components/FormElements/Input.js';
import Button from '../../shared/components/FormElements/Button';
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_EMAIL,
  VALIDATOR_REQUIRE,
} from '../../shared/utils/validators';
import { useForm } from '../../shared/hooks/form-hook';
import { AuthContext } from '../../shared/context/auth-context';
import Card from '../../shared/components/UIElements/Card';
import './AuthForm.css';

const AuthForm = () => {
  const auth = useContext(AuthContext);
  const [isLoginMode, setIsLoginMode] = useState(true);

  const [formState, inputHandler, setFormData] = useForm({
    email: {
      value: '',
      isValid: false,
    },
    password: {
      value: '',
      isValid: false,
    },
  });

  const switchModeHandler = () => {
    if (!isLoginMode) {
      setFormData(
        { ...formState.inputs, name: undefined },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      setFormData(
        {
          ...formState.inputs,
          name: {
            value: '',
            isValid: false,
          },
        },
        false
      );
    }
    setIsLoginMode((prevMode) => !prevMode);
  };

  const authSubmitHandler = async (e) => {
    e.preventDefault();
    if (isLoginMode) {
      axios
        .post('http://localhost:5000/api/v1/auth/login', {
          email: formState.inputs.email.value,
          password: formState.inputs.password.value,
        })
        .then((response) => {
          if (response.status === 200) {
            const token = response.data.token;
            const user = response.data.user;
            localStorage.setItem('bt', token);
            localStorage.setItem('user', user);
            auth.login(user, token);
          }
        })
        .catch(
          (err) => console.log(`Invalid credentials.  Please try again. ${err}`)
          // TODO - trigger alert message and clear form
        );
    } else if (!isLoginMode) {
      axios
        .post('http://localhost:5000/api/v1/auth/register', {
          name: formState.inputs.name.value,
          email: formState.inputs.email.value,
          password: formState.inputs.password.value,
        })
        .then((response) => {
          if (response.status === 200) {
            const token = response.data.token;
            const user = response.data.user;
            localStorage.setItem('bt', token);
            localStorage.setItem('user', user);
            auth.login(user, token);
          }
        })
        .catch(
          (err) => console.log(`Invalid credentials.  Please try again. ${err}`)
          // TODO - trigger alert message and clear form
        );
    }
  };

  return (
    <Card className='authentication'>
      <h2>{isLoginMode ? 'Please Login' : 'New Account'}</h2>
      <hr />
      <form onSubmit={authSubmitHandler}>
        {!isLoginMode && (
          <Input
            id='name'
            element='input'
            type='text'
            label='Your Name'
            validators={[VALIDATOR_REQUIRE()]}
            errorText='Please enter your name'
            onInput={inputHandler}
          />
        )}
        <Input
          id='email'
          element='input'
          type='text'
          label='Email'
          validators={[VALIDATOR_EMAIL()]}
          errorText='Please enter a valid email'
          onInput={inputHandler}
        />
        <Input
          id='password'
          element='input'
          type='password'
          label='Password'
          validators={[VALIDATOR_MINLENGTH(6)]}
          errorText='Please enter a valid password (at least 6 characters)'
          onInput={inputHandler}
        />
        <br />
        <Button type='submit' disabled={!formState.isValid}>
          {isLoginMode ? 'Login' : 'Sign Up'}
        </Button>
      </form>
      <Button inverse onClick={switchModeHandler}>
        {isLoginMode ? 'Switch to Sign Up Mode' : 'Switch to Log In Mode'}
      </Button>
    </Card>
  );
};

export default AuthForm;
