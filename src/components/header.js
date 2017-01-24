import React, {Component} from 'react';
import {connect} from 'react-redux';
import {signInUser ,
		signOutUser,
		getIpAddress,
		getAllPolls } from '../actions';
import { Link } from 'react-router';


class Header extends Component {

	getHeaderLinks() {
		let headerLinks = [];
		headerLinks.push(<Link to="/" className="brandName" key="brandName"><span>TakeAPoll</span></Link>);
		
		if(this.props.IS_AUTHORIZED) {
			headerLinks.push(
				<Link to="/create-poll" key="create" className="create"><span>Create</span></Link>, 
				<Link to="/mypolls" className="mypolls" key="mypolls"><span>MyPolls</span></Link>, 
				<a key="logout" onClick = {this.handleLogout.bind(this)}><span className="logout">Logout</span></a>
				);
		} else {
			headerLinks.push(<a key="login" onClick = {this.handleLogin.bind(this)}><span  className="login">Login</span></a>);
		}


		return headerLinks;
	}

	handleLogin() {
		this.props.signInUser();
	}

	handleLogout() {
		this.props.signOutUser();
		this.props.getIpAddress();
		this.props.getAllPolls();
	}

	render(){
		return(
			<div className="appHeader">
				{this.getHeaderLinks()}
			</div>
			);
	}
}

function mapStateToProps(state) {
	return {
		IS_AUTHORIZED : state.auth.authenticated
	};
}

export default connect(mapStateToProps, {signInUser, signOutUser, getAllPolls, getIpAddress})(Header);