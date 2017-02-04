import { POLLS_DATA, 
		 SUBMIT_POLL, 
		 SUBMIT_POLL_AUTHORIZED_USER, 
		 DELETE_POLL, 
		 POLL_DATA_BY_POLL_ID, 
		 CREATE_POLL,
		 UPDATE_POLL } from '../actions/types';

export default function(state={}, action) {
	switch(action.type) {
		case POLLS_DATA :
			return {...state, pollsData:action.payload};
		case SUBMIT_POLL :
			const submittedPollIdUnAuth = action.payload.poll._id;
			const pollsDataUnAuth = state.pollsData.map((poll) => {
				if(poll._id === submittedPollIdUnAuth) {
					poll = action.payload.poll;
				} 
				return poll;
			});
			return {...state, pollsData:pollsDataUnAuth};
		case SUBMIT_POLL_AUTHORIZED_USER:
			const submittedPollIdAuth = action.payload.poll._id;
			const pollsDataAuth = state.pollsData.map((poll) => {
				if(poll._id === submittedPollIdAuth) {
					poll = action.payload.poll;
				} 
				return poll;
			});
			return {...state, pollsData:pollsDataAuth};
		case DELETE_POLL:
			const updatedPollsData = state.pollsData.filter((poll) => {
				return poll._id !== action.payload;
			});
			return {...state, pollsData:updatedPollsData};

		case POLL_DATA_BY_POLL_ID:
			return {...state, pollsData:[action.payload]};

		case CREATE_POLL:
			return state; //TODO :: see whether you need to add created poll info to the state
		case UPDATE_POLL:
			return state; //TODO :: see whether you need to add edited poll info to the state
	}

	return state;
}