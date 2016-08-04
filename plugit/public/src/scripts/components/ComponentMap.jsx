import React, {Component, PropTypes} from 'react';

export default class ComponentMap extends Component {

  render() {

    const {componentMap} = this.props;

    return (
      <div>
        <p>{componentMap.group}</p>
      </div>
    );
  }
}

ComponentMap.propTypes = {
  componentMap: PropTypes.object.isRequired
};