import React, { useState, useCallback } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from 'react-router-dom';
import AuthForm from './user/pages/AuthForm';
import DiveDashboard from './dives/pages/DiveDashboard';
import DiveView from './dives/pages/DiveView';
import DiveEdit from './dives/pages/DiveEdit';
import MainNavigation from './shared/components/Navigation/MainNavigation';
import { AuthContext } from './shared/context/auth-context';

import './App.css';
import NewDiveForm from './dives/pages/NewDiveForm';

function App() {
  const [token, setToken] = useState(localStorage.getItem('bt'));
  const [user, setUser] = useState(localStorage.getItem('user'));

  const login = useCallback((user, token) => {
    localStorage.setItem('bt', token);
    setToken(token);
    localStorage.setItem('user', user);
    setUser(user);
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    localStorage.removeItem('bt');
    setUser(null);
    localStorage.removeItem('user');
  }, []);

  let routes;

  if (token) {
    routes = (
      <Switch>
        <Route path='/' exact>
          <main>
            <DiveDashboard />
          </main>
        </Route>
        <Route path='/dives/new' exact>
          <main>
            <NewDiveForm />
          </main>
        </Route>
        <Route path='/dives/view/:diveId' exact>
          <main>
            <DiveView />
          </main>
        </Route>
        <Route path='/dives/edit/:diveId' exact>
          <main>
            <DiveEdit />
          </main>
        </Route>
        <Redirect to='/' />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route path='/' exact>
          <main>
            <AuthForm />
          </main>
        </Route>
        <Redirect to='/' />
      </Switch>
    );
  }

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
}

export default App;
