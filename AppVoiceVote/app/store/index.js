import { compose, createStore } from "redux";
import createMiddleware from './create-middleware';
import reducers from "./reducers";

const configureStore = function (initialState = {}) {
  return createStore(reducers, initialState, compose(createMiddleware()));
};

export default configureStore;