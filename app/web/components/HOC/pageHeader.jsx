import React, { Component, PureComponent } from "react";

function getDisplayName(component) {
  return component.displayName || component.name || "Component";
}

export default obj => WrappedComponent =>
  class HOC extends PureComponent {
    static displayName = `HOC(${getDisplayName(WrappedComponent)})`;

    UNSAFE_componentWillMount() {
      console.log(`[OPEN]: ${getDisplayName(WrappedComponent)}`);
    }

    /**
     * 周期结束,销毁存储数据
     */
    componentWillUnmount() {
      const { store } = this.props;
      store && store.reset && store.reset();
      // console.log(`[CLOSE]: ${getDisplayName(WrappedComponent)}`);
    }

    render() {
      return (
        <div className={obj.className}>
          {obj.name && <div className="title">{obj.name}</div>}
          <div
            className={[
              "main-content",
              obj.ftable ? "main-content-ftable" : "",
            ].join(" ")}
          >
            <WrappedComponent {...this.props} />
          </div>
        </div>
      );
    }
  };
