import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './common/style/global.css';
import {Provider} from "react-redux";
import {store} from "./store";
import {InitApi} from "./common/api";

const root = ReactDOM.createRoot(document.getElementById('root'));

InitApi()

root.render(
      <Provider store={store}>
          <App />
      </Provider>
);