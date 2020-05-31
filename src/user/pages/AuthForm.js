import React, { useState, useContext } from 'react';
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
      let loginResponse = null;
      try {
        loginResponse = await fetch('http://localhost:5000/api/v1/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          }),
        });
        let loginData;
        if (loginResponse.status === 401) {
          console.log('login failed - try again');
          // TODO - reset login form
        } else {
          loginResponse.text().then((result) => {
            if (result.charAt(0) === '{') {
              loginData = { ...JSON.parse(result) };
              localStorage.setItem('bt', loginData.token);
              localStorage.setItem('user', loginData.user);
              auth.login(
                localStorage.getItem('user'),
                localStorage.getItem('bt')
              );
            }
          });
        }
      } catch (errorText) {
        console.log(errorText);
      }
    } else {
      try {
        fetch('http://localhost:5000/api/v1/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: formState.inputs.name.value,
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          }),
        });
        // const responseData = await response;
        // TODO - register new user
      } catch (err) {
        console.log(err);
      }
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
