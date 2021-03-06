import axios from 'axios';
import { browserHistory } from 'react-router';
import { VOTING_APP_SERVER__URL, 
		 GET_ALL_POLLS_URI, 
		 GET_USER_RELATED_POLLS_URI, 
		 GET_IP_ADDRESS, 
		 DELETE_POLL_URI,
		 GET_POLL_DATA_BY_POLL_ID,
		 CREATE_POLL_URI,
		 UPDATE_POLL_URI } from './uris';
import { AUTH_USER, 
		 UNAUTH_USER, 
		 POLLS_DATA, 
		 SUBMIT_POLL, 
		 SUBMIT_POLL_AUTHORIZED_USER, 
		 IP_ADDRESS, 
		 IP_ADDRESS_NULL, 
		 USER_ID, 
		 DELETE_POLL,
		 POLL_DATA_BY_POLL_ID,
		 CREATE_POLL,
		 UPDATE_POLL } from './types';
import { TOKEN_KEY } from './constants';

export function signInUser() {
	return function(dispatch) {
		window.open(`${VOTING_APP_SERVER__URL}/generate-token`,"_blank", 'width=600,height=600');
		axios.get(`${VOTING_APP_SERVER__URL}/get-oauth-token`)
			.then(response => {
				dispatch({ type:AUTH_USER });
				localStorage.setItem(TOKEN_KEY,JSON.stringify(response.data));
				dispatch({ type:IP_ADDRESS_NULL });
				browserHistory.push('/mypolls');
			})
			.catch(() => {
				//TODO
			});
	}
}

export function signOutUser() {
	return function(dispatch) {
		localStorage.removeItem(TOKEN_KEY);
		browserHistory.push('/');
		dispatch({type: UNAUTH_USER});
		dispatch({ type:USER_ID, payload:null });
	}
}

export function getAllPolls() {
	return function(dispatch) {
		axios.get(GET_ALL_POLLS_URI) 
			.then(response => {
				dispatch({ type:POLLS_DATA, payload:response.data});
			})
			.catch(() => {
				//TODO
			})
	}
} 

export function getUserRelatedPolls() {
	const userId = JSON.parse(localStorage.getItem(TOKEN_KEY))["user_id"];
	return function(dispatch) {
		axios.get(GET_USER_RELATED_POLLS_URI + userId)
			.then(response => {
				dispatch({ type:POLLS_DATA, payload:response.data});
			})
			.catch(() => {
				//TODO
			})
	}
}

export function submitPollByUnauthorizedUser(poll, selectedOption, ipAddress) {

	poll.options.forEach((opt) => {
		if(opt.option === selectedOption) {
			opt.votes = opt.votes + 1;
		}
	});
	poll.submittedIpAddressesAndOptions[ipAddress] = selectedOption;
	return function(dispatch) {
		axios.post(UPDATE_POLL_URI, poll)
			.then(response => {
				dispatch({
					type : SUBMIT_POLL,
					payload : {
						poll
					}
				});
			})
			.catch(() => {
				//TODO
			});
	}
}

export function submitPollByAuthorizedUser(poll, selectedOption, userId) {
	poll.options.forEach((opt) => {
		if(opt.option === selectedOption) {
			opt.votes = opt.votes + 1;
		}
	});
	poll.submittedUserIdsAndOptions[userId] = selectedOption;
	return function(dispatch) {
		axios.post(UPDATE_POLL_URI, poll)
			.then(response => {
				dispatch({
					type : SUBMIT_POLL_AUTHORIZED_USER,
					payload : {
						poll
					}
				});
			})
			.catch(() => {
				//TODO
			});
	}
}

export function getIpAddress() {
	return function(dispatch) {
		axios.get(GET_IP_ADDRESS) //TODO replace URI with actual backend URI
			.then(response => {
				dispatch({ type:IP_ADDRESS, payload: response.data })
			})
			.catch(() => {
				//TODO
			})
	}
}

export function getUserId() {
	return function(dispatch) {
		const userId = JSON.parse(localStorage.getItem(TOKEN_KEY))["user_id"];
		dispatch({ type:USER_ID, payload:userId });
	}
}

export function deletePoll(pollId) {	
	return function(dispatch) {
		axios.delete(DELETE_POLL_URI + pollId)
			.then(response => {
				dispatch({ type:DELETE_POLL, payload:pollId});
			})
			.catch(() => {
				//TODO
			})
	}
}

export function getPollDataByPollId(pollId) {
	return function(dispatch) {
		axios.get(GET_POLL_DATA_BY_POLL_ID + pollId)
		.then(response => {
			dispatch({ type:POLL_DATA_BY_POLL_ID , payload: response.data })
		})
		.catch(() => {
				//TODO
		})
	}
}

export function createPoll(question, options) {
	let poll = {};
	poll.question = question;
	poll.options = options.map((opt) => {
		return {"option":opt.option, "votes":0};
	});
	poll.submittedIpAddressesAndOptions = {};
	poll.submittedUserIdsAndOptions = {};
	poll.createdBy = JSON.parse(localStorage.getItem(TOKEN_KEY))["user_id"];
	return function(dispatch) {
		axios.post(CREATE_POLL_URI, poll)
			.then(response => {
				dispatch({ type:CREATE_POLL })
				browserHistory.push('/mypolls');
			})
			.catch(() => {
					//TODO
			})
	}
}

export function editPoll(question, options, poll) {
	poll.options = options.map((opt) => {
		if(opt.votes) {
			return opt;
		} else {
			return {"option":opt.option, "votes":0};
		}
	});
	return function(dispatch) {
		axios.post(UPDATE_POLL_URI, poll) //TODO replace URI with actual backend URI
		.then(response => {
			dispatch({ type:UPDATE_POLL })
			browserHistory.push('/mypolls');
		})
		.catch(() => {
				//TODO
		})
	}
}