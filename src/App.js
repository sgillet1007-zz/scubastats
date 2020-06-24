import React, { useState, useCallback, useEffect } from "react";
import axios from "axios";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";
import { AuthContext } from "./shared/context/auth-context";
import CircularProgress from "@material-ui/core/CircularProgress";

import MainNavigation from "./shared/components/Navigation/MainNavigation";
import AuthForm from "./user/pages/AuthForm";
import DiveDashboard from "./dives/pages/DiveDashboard";
import AddDiveForm from "./dives/pages/AddDiveForm";
import ViewDive from "./dives/pages/ViewDive";
import EditDive from "./dives/pages/EditDive";
import { DiveContext } from "./shared/context/dive-context";

import "./App.css";

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("bt") || "");
  const [user, setUser] = useState(localStorage.getItem("user") || "");
  const [dives, setDives] = useState([]);
  const [isLoadingDives, setIsLoadingDives] = useState(false);

  const getAllDives = useCallback(() => {
    // default pagination limit on api is 200 dives
    setIsLoadingDives(true);
    axios({
      method: "get",
      url: "http://localhost:5000/api/v1/dives",
      headers: { Authorization: `Bearer ${localStorage.getItem("bt")}` },
    })
      .then((response) => {
        if (response.status === 200) {
          const diveData = response.data.results.data;
          setDives(
            diveData
              .sort((a, b) => {
                return a.date > b.date ? (a.timeIn > b.timeIn ? 1 : -1) : -1;
              })
              .map((d, i) => {
                return {
                  ...d,
                  diveNumber: i + 1,
                  diveDuration: calcDiveDuration(d.timeIn, d.timeOut),
                };
              })
          );
          setIsLoadingDives(false);
        }
      })
      .catch((err) => {
        setIsLoadingDives(false);
        console.log(`Problem fetching dive data. ${err}`);
      });
  }, []);

  const login = useCallback(
    (user, token) => {
      setToken(token);
      setUser(user);
      localStorage.setItem("bt", token);
      localStorage.setItem("user", user);
      getAllDives();
    },
    [getAllDives]
  );

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("bt");
    localStorage.removeItem("user");
  }, []);

  const calcDiveDuration = (timeIn, timeOut) => {
    const inHour = Math.floor(timeIn / 100);
    const outHour = Math.floor(timeOut / 100);
    const inMins = timeIn % 100;
    const outMins = timeOut % 100;
    let diveDuration = 0;

    if (inHour === outHour) {
      diveDuration = outMins - inMins;
    } else if (inHour !== outHour) {
      let divedMinutes = 0;
      divedMinutes += 60 - inMins + outMins;
      if (outHour - inHour === 2) {
        divedMinutes += 60;
      } else if (outHour - inHour === 3) {
        divedMinutes += 120;
      }
      diveDuration = divedMinutes;
    }
    return diveDuration;
  };

  const deleteDive = (id) => {
    axios
      .delete(`http://localhost:5000/api/v1/dives/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("bt")}` },
      })
      .then((response) => {
        if (response.status === 200) {
          setDives(
            dives
              .filter((d) => d._id !== id)
              .sort((a, b) => {
                return a.date > b.date ? (a.timeIn > b.timeIn ? 1 : -1) : -1;
              })
              .map((d, i) => {
                return { ...d, diveNumber: i + 1 };
              })
          );
        }
      })
      .catch((err) =>
        console.log(`Problem deleting the requested dive. ${err}`)
      );
  };

  let routes;

  if (token && user) {
    // isLoadingDives
    routes = isLoadingDives ? (
      <div className="loading-container">
        <CircularProgress />
      </div>
    ) : (
      <DiveContext.Provider
        value={{
          dives: dives,
          refreshContextDives: getAllDives,
          refreshDiveData: getAllDives,
          deleteDive: deleteDive,
        }}
      >
        <Switch>
          <Route path="/" exact>
            <main>
              <DiveDashboard />
            </main>
          </Route>
          <Route path="/dives/add" exact>
            <main>
              <AddDiveForm />
            </main>
          </Route>
          <Route path="/dives/:diveId/view" exact>
            <main>
              <ViewDive />
            </main>
          </Route>
          <Route path="/dives/:diveId/edit" exact>
            <main>
              <EditDive />
            </main>
          </Route>
          <Redirect to="/" />
        </Switch>
      </DiveContext.Provider>
    );
  } else {
    routes = (
      <Switch>
        <Route path="/" exact>
          <main>
            <AuthForm />
          </main>
        </Route>
        <Redirect to="/" />
      </Switch>
    );
  }

  useEffect(() => {
    if (token && user) {
      axios({
        method: "get",
        url: "http://localhost:5000/api/v1/dives",
        headers: { Authorization: `Bearer ${localStorage.getItem("bt")}` },
      })
        .then((response) => {
          if (response.status === 200) {
            const diveData = response.data.results.data;
            setDives(
              diveData
                .sort((a, b) => {
                  return a.date > b.date ? (a.timeIn > b.timeIn ? 1 : -1) : -1;
                })
                .map((d, i) => {
                  return {
                    ...d,
                    diveNumber: i + 1,
                    diveDuration: calcDiveDuration(d.timeIn, d.timeOut),
                  };
                })
            );
          }
        })
        .catch((err) => console.log(`Problem fetching dive data. ${err}`));
    }
  }, [token, user]);

  return (
    <AuthContext.Provider
      value={{ token: token, user: user, login: login, logout: logout }}
    >
      <Router>
        <MainNavigation />
        {routes}
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
