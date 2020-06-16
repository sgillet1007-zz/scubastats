import React, { useReducer, useEffect } from "react";
import { validate } from "../../utils/validators";
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";

import "./Input.css";

const inputReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE":
      return {
        ...state,
        value: action.val,
        isValid: validate(action.val, action.validators),
      };
    case "TOUCH":
      return {
        ...state,
        isTouched: true,
      };

    default:
      return state;
  }
};

const Input = (props) => {
  const [inputState, dispatch] = useReducer(inputReducer, {
    value: props.initialValue || "",
    isTouched: false,
    isValid: props.initialValid || false,
  });

  const { id, onInput } = props;
  const { value, isValid } = inputState;

  useEffect(() => {
    onInput(id, value, isValid);
  }, [id, value, isValid, onInput]);

  const changeHandler = (e) => {
    console.log("changeHandler called!: ", e.target.value);
    dispatch({
      type: "CHANGE",
      val: e.target.value,
      validators: props.validators || [],
    });
  };

  const touchHandler = () => {
    dispatch({
      type: "TOUCH",
    });
  };

  let element = null;
  switch (props.element) {
    case "input":
      element = (
        <FormControl margin="normal">
          <TextField
            id={props.id}
            variant="filled"
            type={props.type}
            label={props.label}
            value={inputState.value}
            onChange={changeHandler}
            onBlur={touchHandler}
            error={!inputState.isValid}
            helperText={!inputState.isValid ? props.errorText : ""}
          />
        </FormControl>
      );
      break;
    case "textarea":
      element = (
        <FormControl width="100%" margin="normal">
          <TextField
            width="100%"
            id={props.id}
            variant="filled"
            label={props.label}
            value={inputState.value}
            onChange={changeHandler}
            onBlur={touchHandler}
            error={!inputState.isValid}
            helperText={!inputState.isValid ? props.errorText : ""}
            multiline
            rows={4}
            rowsMax={8}
          />
        </FormControl>
      );
      break;
    case "select":
      element = (
        <FormControl margin="normal">
          <InputLabel shrink id={props.id}>
            {props.label}
          </InputLabel>
          <Select
            id={props.id}
            variant="filled"
            label={props.label}
            value={inputState.value}
            onChange={changeHandler}
            onBlur={touchHandler}
          >
            <MenuItem value=""></MenuItem>
            {props.options.map((o) => (
              <MenuItem key={o} value={o}>
                {o}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      );
      break;
    default:
      break;
  }

  return element;
};

export default Input;
