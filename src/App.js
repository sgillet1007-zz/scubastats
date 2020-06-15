import React, { useState, useCallback, useEffect } from "react";
import axios from "axios";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";
import { AuthContext } from "./shared/context/auth-context";

import MainNavigation from "./shared/components/Navigation/MainNavigation";
import AuthForm from "./user/pages/AuthForm";
import DiveDashboard from "./dives/pages/DiveDashboard";
import AddDiveForm from "./dives/pages/AddDiveForm";
import ViewDive from "./dives/pages/ViewDive";
import EditDive from "./dives/pages/EditDive";
import { DiveContext } from "./shared/context/dive-context";

import "./App.css";

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("bt"));
  const [user, setUser] = useState(localStorage.getItem("user"));
  const [dives, setDives] = useState([]);

  const login = useCallback((user, token) => {
    localStorage.setItem("bt", token);
    setToken(token);
    localStorage.setItem("user", user);
    setUser(user);
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    localStorage.removeItem("bt");
    setUser(null);
    localStorage.removeItem("user");
  }, []);

  const getDive = useCallback(
    (id) => {
      const diveFromState = dives.filter((d) => d._id === id);
      if (diveFromState.length) {
        return diveFromState;
      }

      axios({
        method: "get",
        url: `http://localhost:5000/api/v1/dives/${id}`,
        headers: { Authorization: `Bearer ${localStorage.getItem("bt")}` },
      }).then((response) => {
        if (response.status === 200) {
          console.log("axios fetch dive data: ", response.data.data);
          return response.data.data;
        }
      });
    },
    [dives]
  );

  const getAllDives = useCallback(() => {
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
                return { ...d, diveNumber: i + 1 };
              })
          );
        }
      })
      .catch((err) => console.log(`Problem fetching dive data. ${err}`));
  }, []);

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
  const selectDive = (id, dives) => {
    const diveObj = dives.find((d) => d._id === id);
    return diveObj;
  };

  const updateDive = (id, reqBody) => {
    axios
      .put(`http://localhost:5000/api/v1/dives/${id}`, reqBody, {
        headers: { Authorization: `Bearer ${localStorage.getItem("bt")}` },
      })
      .then((response) => {
        if (response.status === 200) {
          console.log("Dive data updated!");
          getAllDives();
          selectDive(id, dives);
          return true;
        }
      })
      .catch((err) => console.log(`Problem updating dive. ${err}`));
  };

  let routes;

  if (token) {
    routes = (
      <DiveContext.Provider
        value={{
          dives: dives,
          selected: null,
          deleteDive: deleteDive,
          selectDive: selectDive,
          updateDive: updateDive,
          getDive: getDive,
        }}
      >
        <Switch>
          <Route path="/" exact>
            <main>
              <DiveDashboard />
            </main>
          </Route>
          <Route path="/dives/new" exact>
            <main>
              <AddDiveForm />
            </main>
          </Route>
          <Route path="/dives/view/:diveId" exact>
            <main>
              <ViewDive />
            </main>
          </Route>
          <Route path="/dives/edit/:diveId" exact>
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
    getAllDives();
  }, [getAllDives]);

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
