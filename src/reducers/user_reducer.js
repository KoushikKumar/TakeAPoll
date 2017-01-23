import { IP_ADDRESS, IP_ADDRESS_NULL, USER_ID } from '../actions/types'; 

export default function(state={}, action) {
	switch(action.type) {
		case IP_ADDRESS :
			return { ...state, ipAddress: action.payload.ipAddress }
		case IP_ADDRESS_NULL:
			return { ...state, ipAddress: null }
		case USER_ID:
			return { ...state, userId: action.payload }
	}
	return state;
}
