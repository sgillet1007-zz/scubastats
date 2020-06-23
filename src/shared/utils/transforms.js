export const parseTimeInputValue = (rawVal) => {
  return parseInt(rawVal.replace(":", ""));
};

export const convertTimeVal = (num) => {
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
