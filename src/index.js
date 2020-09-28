import "./index.css";
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import "./runtime"

import { getContext } from "kea";
import App from "./App";

import { AppContainer } from 'react-hot-loader';


import './api/server'

import * as serviceWorker from './serviceWorker';

import usersLogic from './features/users/usersLogic'

import './api/server'

usersLogic.mount()
usersLogic.actions.fetchUsers()

const rootElement = document.getElementById("root");
const render = () => {
    ReactDOM.render(
        <AppContainer>
            <Provider store={getContext().store}>
                <App/>
            </Provider>
        </AppContainer>,
        rootElement
    );
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

// Render once
render();

// Webpack Hot Module Replacement API
if (module.hot) {
    module.hot.accept('./App', () => {
        render();
    });
}