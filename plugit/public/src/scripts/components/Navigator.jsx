import React, {Component} from 'react';
import Navigation from 'react-toolbox/lib/navigation';
import Link from 'react-toolbox/lib/link';

const actions = [
  { label: 'Alarm', raised: true, icon: 'access_alarm' },
  { label: 'Location', raised: true, accent: true, icon: 'room' }
];

class Navigator extends Component {
  render() {
    return (
      <div>
        <Navigation type='horizontal' actions={actions} />
      </div>
    );
  }
}

export default Navigator;