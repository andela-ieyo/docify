import React from 'react';
import { Router, browserHistory } from 'react-router';
import { render } from 'react-dom';
import routes from './routes';
//  css here

render(
  <Router history={browserHistory} routes={routes} />,
  document.getElementById('app')
);
