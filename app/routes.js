import React from 'react';
import { Route } from 'react-router';
import Home from './components/Home.jsx';
import App from './app';


export default
  <div>
    <Route path="/" component={Home} />
    <Route component={App}>
    </Route>
  </div>;
