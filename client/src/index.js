import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Relay from 'react-relay';

Relay.injectNetworkLayer(
  new Relay.DefaultNetworkLayer('http://localhost:4000/graphql')
);

class HomeRoute extends Relay.Route {
  static routeName = 'Home';
  static queries = {
    store: (Component) => Relay.QL`
      query MainQuery {
        store { ${Component.getFragment('store')} }
      }
    `
  }
}

ReactDOM.render(
  <Relay.RootContainer
    Component={App}
    route={new HomeRoute()}
  />,
  document.getElementById('root')
);
