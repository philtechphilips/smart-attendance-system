import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { persistStore, persistReducer, PURGE } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "./slice/auth.slice";
import navReducer from "./slice/nav.slice";

const persistConfig = {
  key: "root",
  storage,
};

export const rootReducers = combineReducers({
  auth: authReducer,
  navigation: navReducer,
});
const persistedReducer = persistReducer(persistConfig, rootReducers);
//@ts-ignore
const logoutMiddleware = (store) => (next) => (action) => {
  if (action.type === "auth/logout") {
    persistStore(store, null, () => {
      store.dispatch({ type: "persist/PURGE", result: () => null });
      store.dispatch({
        type: "persist/REHYDRATE",
        payload: {},
        error: null,
      });
    });
  }
  return next(action);
};

export const setupStore = (preloadedState?: Partial<ReducerState>) => {
  return configureStore({
    reducer: persistedReducer,

    devTools: process.env.NODE_ENV === "development",
    //@ts-ignore
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }).concat([logoutMiddleware]),
    //@ts-ignore
    preloadedState,
  });
};
const store = setupStore();

const persistor = persistStore(store);
export { store, persistor, PURGE };
export type RootState = ReturnType<typeof store.getState>;
export type ReducerState = ReturnType<typeof rootReducers>;
export type AppDispatch = typeof store.dispatch;
export type StoreState = typeof store;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
