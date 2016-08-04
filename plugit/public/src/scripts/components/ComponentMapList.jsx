import React, {Component, PropTypes} from 'react';
import ComponentMap from './ComponentMap';

export default class ComponentMapList extends Component {

  componentWillMount() {
    this.props.fetchComponentMaps();
  }

  render() {

    const {componentMaps, error, loading} = this.props;

    return (
      <ul>
        {componentMaps.map(componentMap => {
          return <ComponentMap key={componentMap._id} componentMap={componentMap} />;
        }) }
      </ul>
    );
  }
}

ComponentMapList.propTypes = {
  componentMaps: PropTypes.array.isRequired,
  fetchComponentMaps: PropTypes.func.isRequired
};