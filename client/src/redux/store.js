import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer from "./user/userSlice";
import {persistReducer, persistStore} from 'redux-persist';
import storage from 'redux-persist/lib/storage'

// Combining all the reducers
const rootReducer = combineReducers({ user: userReducer });

// Creating a basic configuration for persistor
const persistConfig = {
  key : 'root',
  storage,
  version : 1,
}

// Creating a persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Adding a persist reducer to the store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Exporting the persitor
export const persistor = persistStore(store);

