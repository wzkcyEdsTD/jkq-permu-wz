import React, { Component } from "react";

export default class Layout extends Component {
  render() {
    return (
      <html>
        <head>
          <title>{this.props.title || "温州市经开区亩均论英雄"}</title>
          <meta charSet="utf-8" />
          <meta
            name="viewport"
            content="initial-scale=1, maximum-scale=1, user-scalable=no, minimal-ui"
          />
          {/* https == true 时 加入https头部 */}
          {this.props.apiConfig.https ? (
            <meta
              httpEquiv="Content-Security-Policy"
              content="upgrade-insecure-requests"
            />
          ) : undefined}
          <meta name="keywords" content={this.props.keywords} />
          <meta name="description" content={this.props.description} />
          <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
          <script src="http://cdn.bootcss.com/babel-polyfill/7.0.0-alpha.9/polyfill.min.js"></script>
          {/* eslint-disable react/no-danger */}
          <script
            dangerouslySetInnerHTML={{
              __html: `window.__API_CONFIG__ = ${JSON.stringify(
                this.props.apiConfig
              )}`,
            }}
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `window.__USER_INFO__ = ${JSON.stringify(
                this.props.initialState
              )}`,
            }}
          />
          {/* eslint-enable react/no-danger */}
        </head>
        <body>
          <div id="app">{this.props.children}</div>
        </body>
      </html>
    );
  }
}
