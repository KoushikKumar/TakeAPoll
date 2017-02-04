import React, { Component } from 'react';

import Header from './header';
import Polls from './polls';

export default class App extends Component {
  render() {
    return (
    	<div>
    	  <Header/>
    	  <Polls/>
      	</div>
    );
  }
}
