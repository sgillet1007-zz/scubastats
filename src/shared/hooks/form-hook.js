import { useCallback, useReducer } from "react";
import { convertTimeVal } from "../utils/transforms";

const formReducer = (state, action) => {
  switch (action.type) {
    case "INPUT_CHANGE":
      let formIsValid = true;
      for (const inputId in state.inputs) {
        if (!state.inputs[inputId]) {
          continue;
        }
        if (inputId === action.inputId) {
          // if current input matches the dispatched inputId, update formValidity
          formIsValid = formIsValid && action.isValid;
        } else {
          // otherwise check stored validity for form and input and set form validity
          formIsValid = formIsValid && state.inputs[inputId].isValid;
        }
      }
      return {
        ...state,
        inputs: {
          ...state.inputs,
          [action.inputId]: { value: action.value, isValid: action.isValid },
        },
        isValid: formIsValid,
      };
    case "SET_DATA":
      return {
        inputs: action.inputs,
        isValid: action.formIsValid,
      };
    case "RESET_FORM":
      console.log("RESET FORM CALLED!");
      console.log(
        "returned state after reset action: ",
        JSON.stringify(
          {
            inputs: { ...action.inputs },
            isValid: action.formIsValid,
          },
          null,
          2
        )
      );
      return {
        inputs: action.inputs,
        isValid: action.formIsValid,
      };
    default:
      return state;
  }
};

export const useForm = (initialInputs, initialFormValidity) => {
  const [formState, dispatch] = useReducer(formReducer, {
    inputs: initialInputs,
    isValid: initialFormValidity,
  });
  const inputHandler = useCallback((id, value, isValid) => {
    dispatch({
      type: "INPUT_CHANGE",
      value,
      inputId: id,
      isValid,
    });
  }, []); // need useCallback to avoid ifinite loop if state change triggers re-creation of this function
  const setFormData = useCallback((inputData, formValidity) => {
    dispatch({
      type: "SET_DATA",
      inputs: inputData,
      formIsValid: formValidity,
    });
  }, []);
  const createInitialFormValues = useCallback(
    (data) => ({
      date: {
        value: data.date,
        isValid: true,
      },
      timeIn: {
        value: data.timeIn && convertTimeVal(data.timeIn),
        isValid: true,
      },
      timeOut: {
        value: data.timeOut && convertTimeVal(data.timeOut),
        isValid: true,
      },
      maxDepth: {
        value: data.maxDepth,
        isValid: true,
      },
      psiIn: {
        value: data.psiIn,
        isValid: true,
      },
      psiOut: {
        value: data.psiOut,
        isValid: true,
      },
      gasType: {
        value: data.gasType,
        isValid: true,
      },
      diveType: {
        value: data.diveType,
        isValid: true,
      },
      dayOrNight: {
        value: data.dayOrNight,
        isValid: true,
      },
      waterTemp: {
        value: data.waterTemp,
        isValid: true,
      },
      waterType: {
        value: data.waterType,
        isValid: true,
      },
      visibility: {
        value: data.visibility,
        isValid: true,
      },
      current: {
        value: data.current,
        isValid: true,
      },
      waves: {
        value: data.waves,
        isValid: true,
      },
      suitType: {
        value: data.suitType,
        isValid: true,
      },
      weightUsed: {
        value: data.weightUsed,
        isvalid: true,
      },
      diveComputer: {
        value: data.diveComputer,
        isValid: true,
      },
      buddy: {
        value: data.buddy,
        isValid: true,
      },
      notes: {
        value: data.notes,
        isValid: true,
      },
    }),
    []
  );
  return [formState, inputHandler, setFormData, createInitialFormValues];
};

export default useForm;
