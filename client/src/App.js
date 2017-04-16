import React, { Component } from 'react';
import Relay from 'react-relay';
import Link from './components/Link';
import createLinkMutation from './mutations/createLinkMutation';
import { debounce } from 'lodash';

class App extends Component {
  constructor(props) {
    super(props);

    this.setLimit = this.setLimit.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.search = debounce(this.search, 300);
  }
  render() {
    const { store } = this.props;
    const links = store.linkConnection.edges.map((edge) => {
      return <Link key={edge.node.id} link={edge.node} />;
    });

    return (
      <div className="App">
        <h2>Welcome to React</h2>
        <form onSubmit={this.handleSubmit}>
          <input type="text" placeholder="Title" ref="newTitle" />
          <input type="text" placeholder="Url" ref="newUrl" />
          <button type="submit">Add</button>
        </form>
        Showing: &nbsp;
        <input type="text" onChange={this.handleSearch} placeholder="Search" />
        <select onChange={this.setLimit} defaultValue="10">
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
        <ul>
          {links}
        </ul>
      </div>
    );
  }

  handleSearch(e) {
    this.search(e.target.value);
  }

  search(query) {
    this.props.relay.setVariables({ query });
  }

  handleSubmit(e) {
    e.preventDefault();

    const onSuccess = () => {
      console.log('Mutation successful!');
    };
    const onFailure = (transaction) => {
      const error = transaction.getError() || new Error('Mutation failed.');
      console.error(error);
    };

    const mutation = new createLinkMutation({
      title: this.refs.newTitle.value,
      url: this.refs.newUrl.value,
      store: this.props.store
    });

    const transaction = Relay.Store.applyUpdate(mutation, { onFailure, onSuccess });
    transaction.commit();

    this.refs.newTitle.value = "";
    this.refs.newUrl.value = "";
  }

  setLimit(e) {
    const newLimit = Number(e.target.value);
    this.props.relay.setVariables({ limit: newLimit });
  }
}

App = Relay.createContainer(App, {
  initialVariables: {
    limit: 100,
    query: '',
  },
  fragments: {
    store: () => Relay.QL`
      fragment on Store {
        id,
        linkConnection(first: $limit, query: $query) {
          edges {
            node {
              id,
              ${Link.getFragment('link')}
            }
          }
        }
      }
    `
  }
});

export default App;
