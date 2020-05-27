/*
 * @Author: eds
 * @Date: 2020-04-27 08:50:23
 * @LastEditTime: 2020-05-27 16:17:52
 * @LastEditors: eds
 * @Description: 
 * @FilePath: \jkq-permu-wz\app\web\page\login.js
 */ 
import "styles/pages/login.less";

import React, { Component } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, StaticRouter } from "react-router-dom";
import { matchRoutes, renderRoutes } from "react-router-config";
import { AppContainer } from "react-hot-loader";
import { Provider } from "mobx-react";

import LoginPage from "components/LoginPage";
import Layout from "framework/layout.jsx";
import UserStore from "stores/console/UserStore";
//  短信机
import NormalRegisteStore from "stores/login/NormalRegisteStore";
const routes = [
  {
    path: "/",
    component: LoginPage,
  },
];

const createStores = (ctx, state) => ({
  userStore: new UserStore(ctx, state),
  normalRegisteStore: new NormalRegisteStore(ctx, state),
});

const clientRender = () => {
  const stores = createStores(null, window.__INITIAL_STATE__);
  const Entry = () => (
    <Provider {...stores}>
      <BrowserRouter>{renderRoutes(routes)}</BrowserRouter>
    </Provider>
  );
  const render = (App) => {
    const RootComponent = EASY_ENV_IS_DEV ? (
      <AppContainer>
        <App />
      </AppContainer>
    ) : (
      <App />
    );
    ReactDOM.hydrate(RootComponent, document.getElementById("app"));
  };
  if (EASY_ENV_IS_DEV && module.hot) {
    module.hot.accept();
  }
  render(Entry);
};

const serverRender = async (locals) => {
  const { ctx, apiConfig } = locals.state;
  const { url, service } = ctx;
  const stores = createStores(ctx);
  const branch = matchRoutes(routes, url);
  const promises = branch.map(({ route }) => {
    const { fetch } = route.component;
    return fetch instanceof Function ? fetch(stores) : Promise.resolve(null);
  });

  const results = await Promise.all(promises);
  const initialState = await results.reduce((state, result) => {
    Object.assign(state, result);
    return state;
  }, {});
  locals.state = initialState;

  return () => (
    <Layout apiConfig={apiConfig}>
      <Provider {...stores}>
        <StaticRouter location={url} context={{}}>
          {renderRoutes(routes)}
        </StaticRouter>
      </Provider>
    </Layout>
  );
};

serverRender.isWrapped = true;

export default EASY_ENV_IS_NODE ? serverRender : clientRender();
