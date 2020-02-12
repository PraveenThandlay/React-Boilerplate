/* eslint-disable react/prefer-stateless-function */
/* eslint-disable react/no-array-index-key */
// /* eslint-disable prettier/prettier */
/* eslint-disable-next-line react/no-array-index-key */
/*
 * App.js
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import React, { Component, Fragment } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { routes } from './routes';

// eslint-disable-next-line react/prop-types
const PrivateRoute = ({ component: Component }) => (
  <Route
    render={(props) => props.history.action === 'POP' ? (
      <Redirect to="/" />
    ) : (
      <Component />
    )}
  />
);

class App extends Component {
  render() {
    return (
      <div className="home-bg">
        <div className="home-page">
          <Switch>
            {routes.map((route, i) => (
              <Fragment key={`route-${i}`}>
                {
                  route.isPrivate ? (
                    <PrivateRoute
                      key={`route-${i}`}
                      path={route.path}
                      component={route.component}
                      exact={route.exact}
                    />
                  ) : (
                    <Route
                      key={`route-${i}`}
                      path={route.path}
                      exact={route.exact}
                      render={(prop) => (
                        <>
                          <route.component
                            {...prop}
                          />
                        </>
                      )}
                    />
                  )
                }
              </Fragment>
            ))}
          </Switch>
        </div>
      </div>
    );
  }
}

App.propTypes = {
  history: PropTypes.object,
};

export default App;
