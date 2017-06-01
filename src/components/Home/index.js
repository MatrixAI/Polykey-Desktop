// home component
// this component will import the Render component
// however the build system will choose a specific render depending on the target platform

import Render from 'components/Home/render';

import { Component } from 'react';

class Home extends Component {
  render () {
    return Render.call(this, this.props, this.state);
  }
}

export default Home;
