import React from 'react';
import Relay from 'react-relay';
import moment from 'moment';

class Link extends React.Component {
  getDateLabel() {
    const { link, relay } = this.props;
    if (relay.hasOptimisticUpdate(link)) return 'Saving...';
    if (link.createdAt === null) return 'No Date';
    return moment(this.props.link.createdAt).format('L');
  }

  render() {
    const { link } = this.props;
    return (
      <li>
        <span>{this.getDateLabel()} </span>
        <a href={link.url} target="_new">{link.title}</a>
      </li>
    );
  }
}

Link = Relay.createContainer(Link, {
  fragments: {
    link: () => Relay.QL`
      fragment on Link {
        url,
        title,
        createdAt,
      }
    `
  }
});

export default Link;
