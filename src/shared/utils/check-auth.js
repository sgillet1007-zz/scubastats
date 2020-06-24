// call auth/user endpoint

export const CheckAuth = async (token) => {
  let isAuthenticated = false;
  try {
    const currentUser = await fetch(
      "https://scuba-logbook-api.herokuapp.com/api/v1/auth/user",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("bt"),
        },
      }
    );
    console.log("currentUser: ", currentUser);
  } catch (err) {
    console.log(err);
  }
  return isAuthenticated;
};
