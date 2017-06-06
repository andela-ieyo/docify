import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from '../reducers';
import client from '../utils/client';


const configureStore = (initialState)  => {
  return createStore(
    rootReducer,
    initialState,
    compose(
      applyMiddleware(
        thunk.withExtraArgument({ client })
      ),
      window.devToolsExtension ? window.devToolsExtension() : f => f
    )
  );
};


export default configureStore();
