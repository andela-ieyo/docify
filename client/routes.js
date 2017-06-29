import React from 'react';
import { Route } from 'react-router';
import client from './utils/client';
import Home from './components/Home.jsx';
import SignUp from './components/SignUp.jsx';
import Login from './components/Login.jsx';
import store from './store/configureStore';
import { saveUserSuccess } from './actions/loginActions';
import Dashboard from './components/Dashboard.jsx';
import CreateDocument from './components/CreateDocument.jsx';
import ViewDocument from './components/ViewDocument.jsx';
import EditDocument from './components/EditDocument.jsx';
import UpdateProfile from './components/UpdateProfile.jsx';
import ViewAllUsers from './components/ViewAllUsers.jsx';
import App from './app';


const onEnter = ({ location: { pathname } }, replace, callback) => {
  const { user } = store.getState();

  if (user.id) {
    return callback();
  }

  return client.get('/api/users/current')
    .then(res => {
      console.log(res);
      const currentUser = res.data;
      const success = res.status === 200;
      if (success) {
        store.dispatch(saveUserSuccess(currentUser));
        callback();
      } else {
        replace('/login');
      }
    }, (err) => {
      replace('/');
      callback();
    })
   .catch(err => {
     throw err;
   });
};

export default
  <div>
    <Route path="/" component={Home} />
    <Route path="/signup" component={SignUp} />
    <Route path="/login" component={Login} />
    <Route component={App} onEnter={onEnter}>
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/create-document" component={CreateDocument} />
      <Route path="/documents/view/:id" component={ViewDocument} />
      <Route path="documents/edit/:id" component={EditDocument} />
      <Route path="/users/profile/edit/:id" component={UpdateProfile} />
      <Route path="/users/all" component={ViewAllUsers} />
    </Route>
  </div>;
