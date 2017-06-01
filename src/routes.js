// router stuff

import React from 'react';

import { HashRouter, Switch, Route } from 'react-router-dom';

import Home from 'components/Home';

const Routes = () => {
  return (
    <Switch>
      <Route exact path='/' component={Home} />
    </Switch>
  );
};

export default Routes;
