import React from 'react';
import { routes } from '../routes';
import { Router } from 'react-router';
import createBrowserHistory from 'history/lib/createBrowserHistory';

export default function () {
  return <Router routes={routes} history={createBrowserHistory()} />;
}
