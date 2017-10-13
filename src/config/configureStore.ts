import { createStore, applyMiddleware, compose, combineReducers, GenericStoreEnhancer, Store, StoreEnhancerStoreCreator, ReducersMapObject } from 'redux';
import thunk from "redux-thunk";
import {routerMiddleware, routerReducer} from "react-router-redux";
import { History } from 'history';

import {ApplicationState, reducers} from "../store/index";
import * as StoreModule from '../store';

export const configureStore = (history: History, initialState?: ApplicationState) => {
  const windowIfDefined = typeof window === 'undefined' ? null : window as any;
  const devToolsExtension = windowIfDefined && windowIfDefined.devToolsExtension as () => GenericStoreEnhancer;
  const createStoreWithMiddleware = compose(
    applyMiddleware(thunk, routerMiddleware(history)),
    devToolsExtension ? devToolsExtension() : <S>(next: StoreEnhancerStoreCreator<S>) => next
  )(createStore);

    const allReducers = buildRootReducer(reducers);
    const store = createStoreWithMiddleware(allReducers, initialState) as Store<ApplicationState>;

    if(module.hot) {
      module.hot.accept('../store', () => {
        const nextRootReducer = require<typeof StoreModule>('../store');
        store.replaceReducer(buildRootReducer(nextRootReducer.reducers));
      });
    }

    return store;
};

const buildRootReducer = (allReducers: ReducersMapObject) => {
  return combineReducers<ApplicationState>({...allReducers, routing: routerReducer});
};
