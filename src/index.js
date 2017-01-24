import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import {Router, Route, IndexRoute, browserHistory} from 'react-router';
import reduxThunk from 'redux-thunk';
import axios from 'axios';

import requireAuth from './components/hoc/require_authentication';
import App from './components/app';
import CreatePoll from './components/create_poll';
import reducers from './reducers';
import { TOKEN_KEY } from './actions/constants';
import { AUTH_USER, UNAUTH_USER } from './actions/types';
import { VOTING_APP_SERVER__URL } from './actions/uris';

const createStoreWithMiddleware = applyMiddleware(reduxThunk)(createStore);
const store = createStoreWithMiddleware(reducers);
const userData = localStorage.getItem(TOKEN_KEY);

if(userData) {
	axios.post(`${VOTING_APP_SERVER__URL}/test-authorization`,JSON.parse(userData))
		.then(response => {
			if(response.data.is_authorized) {
				store.dispatch({ type:AUTH_USER });
			}
			renderDOM();
		})
		.catch(() => {
			localStorage.removeItem(TOKEN_KEY);
			store.dispatch({ type:UNAUTH_USER });
			renderDOM();
		});
} else {
	renderDOM();
}

function renderDOM() {
	ReactDOM.render(
	  <Provider store={ store }>
	    <Router history={browserHistory}>
	    	<Route path="/" component={App}></Route>
	    	<Route path="/mypolls" component={requireAuth(App)}></Route>
	    	<Route path="/create-poll" component={requireAuth(CreatePoll)}></Route>
	    	<Route path="/poll/:pollId" component={App}></Route>
	    </Router>
	  </Provider>
	, document.querySelector('.app'));
}
