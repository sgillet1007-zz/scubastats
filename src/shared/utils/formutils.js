import { convertTimeVal } from "./transforms";

export const getIntialDiveFormValues = (data) => {
  return {
    date: {
      value: (data && data.date) || "",
      isValid: !!data,
    },
    timeIn: {
      value: (data && data.timeIn && convertTimeVal(data.timeIn)) || "",
      isValid: !!data,
    },
    timeOut: {
      value: (data && data.timeOut && convertTimeVal(data.timeOut)) || "",
      isValid: !!data,
    },
    maxDepth: {
      value: (data && data.maxDepth) || "",
      isValid: !!data,
    },
    psiIn: {
      value: (data && data.psiIn) || 3000,
      isValid: true,
    },
    psiOut: {
      value: (data && data.psiOut) || 500,
      isValid: true,
    },
    gasType: {
      value: (data && data.gasType) || "air",
      isValid: true,
    },
    diveType: {
      value: (data && data.diveType) || "boat",
      isValid: true,
    },
    dayOrNight: {
      value: (data && data.dayOrNight) || "day",
      isValid: true,
    },
    waterTemp: {
      value: (data && data.waterTemp) || 75,
      isValid: true,
    },
    waterType: {
      value: (data && data.waterType) || "salt",
      isValid: true,
    },
    visibility: {
      value: (data && data.visibility) || 40,
      isValid: true,
    },
    current: {
      value: (data && data.current) || "none",
      isValid: true,
    },
    waves: {
      value: (data && data.waves) || "calm",
      isValid: true,
    },
    suitType: {
      value: (data && data.suitType) || "3mm wetsuit",
      isValid: true,
    },
    weightUsed: {
      value: (data && data.weightUsed) || 5,
      isvalid: true,
    },
    diveComputer: {
      value: (data && data.diveComputer) || "console",
      isValid: true,
    },
    buddy: {
      value: (data && data.buddy) || "divemaster",
      isValid: true,
    },
    notes: {
      value: (data && data.notes) || "Another great dive!",
      isValid: true,
    },
  };
};
