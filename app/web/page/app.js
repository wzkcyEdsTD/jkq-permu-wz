import "styles/pages/home.less";
// 国际化
import { ConfigProvider } from "antd";
import zh_CN from "antd/lib/locale-provider/zh_CN";
import "moment/locale/zh-cn";

import React, { Component } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, StaticRouter } from "react-router-dom";
import { matchRoutes, renderRoutes } from "react-router-config";
import { AppContainer } from "react-hot-loader";
import { Provider } from "mobx-react";

//  common
import Layout from "framework/layout.jsx";
import MainContainer from "components/MainContainer";
import UserStore from "stores/console/UserStore";
//  控制台
import User from "components/console/UserManagement";
import Group from "components/console/GroupManagement";
import GroupStore from "stores/console/GroupStore";
import Menu from "components/console/MenuManagement";
import MenuStore from "stores/console/MenuStore";
//  亩均评价
import CompanyData from "components/mj/CompanyData";
import CompanyDataStore from "stores/mj/CompanyDataStore";
import CompanyUpload from "components/mj/CompanyUpload";
import CompanyUploadStore from "stores/mj/CompanyUploadStore";
import CompanyProgress from "components/mj/CompanyProgress";
import CompanyProgressStore from "stores/mj/CompanyProgressStore";
import CompanyElecmeter from "components/mj/CompanyElecmeter";
import CompanyElecmeterStore from "stores/mj/CompanyElecmeterStore";

//  亩均评价日志
import CompanyLogStore from "stores/mjLog/CompanyLogStore";
import CompanyLELog from "components/mjLog/CompanyLELog";
import LoginLog from "components/mjLog/LoginLog";

const createStores = (ctx, state, userinfoState) => ({
  userStore: new UserStore(ctx, state, userinfoState),
  groupStore: new GroupStore(ctx, state),
  menuStore: new MenuStore(ctx, state),
  companyDataStore: new CompanyDataStore(ctx, state),
  companyUploadStore: new CompanyUploadStore(ctx, state),
  companyProgressStore: new CompanyProgressStore(ctx, state),
  companyElecmeterStore: new CompanyElecmeterStore(ctx, state),
  companyLogStore: new CompanyLogStore(ctx, state),
});

const routes = [
  {
    path: "/",
    component: MainContainer,
    routes: [
      //  console
      {
        path: "/home/user",
        component: User,
      },
      {
        path: "/home/group",
        component: Group,
      },
      {
        path: "/home/menu",
        component: Menu,
      },
      //  company
      {
        path: "/home/companyProgress",
        component: CompanyProgress,
      },
      {
        path: "/home/companyData",
        component: CompanyData,
      },
      {
        path: "/home/companyUpload",
        component: CompanyUpload,
      },
      {
        path: "/home/companyElecmeter",
        component: CompanyElecmeter,
      },
      //  company log
      {
        path: "/home/companyELLog",
        component: CompanyLELog,
      },
      {
        path: "/home/loginLog",
        component: LoginLog,
      },
    ],
  },
];

const clientRender = () => {
  const stores = createStores(
    null,
    window.__INITIAL_STATE__,
    window.__USER_INFO__
  );
  const Entry = () => (
    <Provider {...stores}>
      <BrowserRouter>{renderRoutes(routes)}</BrowserRouter>
    </Provider>
  );
  const render = App => {
    ReactDOM.hydrate(
      EASY_ENV_IS_DEV ? (
        <AppContainer>
          <ConfigProvider locale={zh_CN}>
            <App />
          </ConfigProvider>
        </AppContainer>
      ) : (
        <ConfigProvider locale={zh_CN}>
          <App />
        </ConfigProvider>
      ),
      document.getElementById("app")
    );
  };
  if (EASY_ENV_IS_DEV && module.hot) {
    module.hot.accept();
  }
  render(Entry);
};

const serverRender = async locals => {
  const { ctx, apiConfig } = locals.state;
  const { url } = ctx;
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
  return () => (
    <ConfigProvider locale={zh_CN}>
      <Layout apiConfig={apiConfig} initialState={initialState}>
        <Provider {...stores}>
          <StaticRouter location={url} context={{}}>
            {renderRoutes(routes)}
          </StaticRouter>
        </Provider>
      </Layout>
    </ConfigProvider>
  );
};

serverRender.isWrapped = true;

export default EASY_ENV_IS_NODE ? serverRender : clientRender();
