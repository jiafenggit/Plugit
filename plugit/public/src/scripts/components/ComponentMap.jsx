import React, {Component, PropTypes} from 'react';

import { Button } from 'react-toolbox/lib/button';

export default class ComponentMap extends Component {

  render() {

    const {componentMap} = this.props;

    return (
      <div>
        <h2>{componentMap.group}</h2>
        <Button label="Hello!" />
      </div>
    );
  }
}

ComponentMap.propTypes = {
  componentMap: PropTypes.object.isRequired
};