import React, { Component } from 'react';

import Header from './header';
import Polls from './polls';

export default class PollById extends Component {
  render() {
  	const { pollId } = this.props.params;
    return (
    	<div>
    	  <Header/>
    	  <Polls pollId={pollId}/>
      	</div>
    );
  }
}