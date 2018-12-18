import React, { Component } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import Home from './components/home/Home';
import Results from './components/results/Results';

import './App.css';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route path='/' exact={true} component={Home} />
          <Route path='/search' exact={true} component={Results} />
          <Redirect to='/' />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
