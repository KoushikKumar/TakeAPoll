import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getAllPolls, 
		 submitPollByUnauthorizedUser,
		 submitPollByAuthorizedUser,
		 getIpAddress, 
		 getUserRelatedPolls,
		 getUserId } from '../actions';

class Polls extends Component {

	static contextTypes = {
		router: React.PropTypes.object
	}

	constructor(props) {
		super(props);
		this.state = {
			selectedOptions : []
		};
	}

	componentWillMount() {
		const { router } = this.context;

		if(router.isActive('/mypolls')) {
			this.props.getUserRelatedPolls();
		} else {
			this.props.getAllPolls();
		}

		if(this.props.IS_AUTHORIZED) {
			this.props.getUserId();
		} else {
			this.props.getIpAddress();
		}	
	}

	componentWillUpdate(nextProps) {
		if(!nextProps.IS_AUTHORIZED) {
			this.props.getIpAddress();
			this.props.getAllPolls();
		}
	}

	loadPollData() {
		const pollData = this.props.pollData;
		if (pollData) {
			return pollData.map((poll) => {
				return (
					<div key={poll._id}>
						{this.loadPoll(poll)}
					</div>
				);
			});
		}
	}

	loadPoll(poll) {
		const { ipAddress, userId } = this.props;
		let submittedOption = '';
		if(userId) {
			submittedOption = poll.submittedUserIdsAndOptions[userId];
		}else{
			submittedOption = poll.submittedIpAddressesAndOptions[ipAddress];
		}
		const { selectedOptions } = this.state;
		const selectedPollIds = selectedOptions.map(option => option.pollId);
		let isPollSelected = false;
		if (selectedPollIds.indexOf(poll._id) >= 0) {
			isPollSelected = true;
		}
		let selectedOption = "";
		if(isPollSelected){
			selectedOptions.forEach((option) => {
				if(option.pollId === poll._id){
					selectedOption = option.pollOption;
				}
			})		
		}
		let question;
		if(selectedOption) {
			question = poll.question + " - " + selectedOption;
		} else {
			question = poll.question
		}
		return (
	 	 	<div className="container" key= {poll._id}>
	 	 		<div className="panel-group accordion">
	 	 			<div className="panel panel-default">
	 	 				<div className="panel-heading">
	 	 					<h4 className="panel-title">
	 	 						<a className="question" data-toggle="collapse" data-parent=".accordion" href={"#id_" + poll._id}>{question}</a>
	 	 						{this.renderFontAwesomeEllipse(poll)}
	 	 					</h4>
	 	 				</div>
	 	 				<div id={"id_" + poll._id} className="panel-collapse collapse">
	 	 					<ul className="list-group">
								{this.loadOptions(poll, selectedOption, isPollSelected, submittedOption)}
	 	 					</ul>
	 	 				</div>
	 	 				{this.renderEditSharDeleteView(poll)}
	 	 			</div>
	 	 		</div>
	 	 	</div>
	 	);
	}

	renderFontAwesomeEllipse(poll) {
		const { router } = this.context;
		if(router.isActive('/mypolls')) {
			return (<i className="fa fa-ellipsis-h fa-1x font-awesome-ellipse" data-toggle="collapse" data-parent=".accordion" href={"#ellipse_" + poll._id} aria-hidden="true"></i>);
		} 
	}

	renderEditSharDeleteView(poll) {
		const { router } = this.context;
		if(router.isActive('/mypolls')) {
			return (
				<div id={"ellipse_" + poll._id} className="panel-collapse collapse editShareDelete">
					<span className="edit">Edit</span>
					<span className="share">Share</span>
					<span className="delete">Delete</span>
				</div>
			);
		}
	}

	loadOptions(poll, selectedOption, isPollSelected, submittedOption) {
		const options = poll.options;
		let counter = 0;
		const votes = options.map(opt => opt.votes);
		const maxVotes = Math.max(...votes);
		
		return options.map((opt) => {
			counter++;
			let optionBackgroundWidth = {};
			if(maxVotes > 0) {
				optionBackgroundWidth.width = Math.round((500/maxVotes)*opt.votes);
			}	
			
			return (
				<li className="list-group-item" key={counter}>
					<div className="radio">
						<label className="radioLabel">
							{this.renderRadioButton(poll, opt, submittedOption)}
						</label>
						{this.renderRadioOption(poll, selectedOption, optionBackgroundWidth, opt.option, opt.votes)}
					</div>
				</li>
			);
		});
	}

	renderRadioButton(poll, opt, submittedOption) {
		if (submittedOption) {
			if(opt.option === submittedOption) {
				return <input onClick = {() => this.selectOption(poll._id, opt.option)} type="radio" name={"name"+poll._id} checked disabled/>
			} else {
				return <input onClick = {() => this.selectOption(poll._id, opt.option)} type="radio" name={"name"+poll._id} disabled/>
			}
		} else {
			return <input onClick = {() => this.selectOption(poll._id, opt.option)} type="radio" name={"name"+poll._id} />
		}
		
	}

	renderRadioOption(poll, selectedOption, optionBackgroundWidth, option, votes) {
		if(selectedOption && selectedOption === option) {
			optionBackgroundWidth.width = 583;
			return (
				<div className="radioOption radioSelectedOption">
					<div className="selectedOptionBackground" style={optionBackgroundWidth}></div>
					<div onClick = {() => this.submitPoll(poll, selectedOption)} className="option selectedOption">Click Here To Submit</div>
				</div>
			);
		} else {
			return (
				<div className="radioOption">
					<div className="optionBackground" style={optionBackgroundWidth}></div>
					<div className="option">{option}</div>
					<span className="votes">{votes +" Votes"}</span>
				</div>
			);
		}
	}

	selectOption(pollId, pollOption) {
		let { selectedOptions } = this.state;
		let selectOption = {
			pollId,
			pollOption
		}
		let isPollAlreadySelected = false;
		selectedOptions.map((option) => {
			if(option.pollId === pollId) {
				option.pollOption = pollOption;
				isPollAlreadySelected = true;
			}
		})
		if(!isPollAlreadySelected){
			selectedOptions.push(selectOption);
		}
		this.setState({ selectedOptions });
	}

	submitPoll(poll, selectedOption) {
		let { selectedOptions } = this.state;
		let updatedSelectedOptions = selectedOptions.filter((option) => {
			return option.pollId !== poll._id;
		});
		this.setState({ selectedOptions:updatedSelectedOptions });
		if (this.props.ipAddress) {
			this.props.submitPollByUnauthorizedUser(poll, selectedOption, this.props.ipAddress);
		} else {
			this.props.submitPollByAuthorizedUser(poll, selectedOption, this.props.userId);
		}
	}

	render() {
		return (
			<div>
				<p className="bodyHeader"> 
					Select A Poll To See The Results And Vote
				</p>
				<div>
					{this.loadPollData()}
				</div>
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		pollData : state.polls.pollsData, 
		ipAddress : state.user.ipAddress,
		IS_AUTHORIZED : state.auth.authenticated,
		userId : state.user.userId
	}
}

export default connect(mapStateToProps, {getAllPolls, 
										 submitPollByUnauthorizedUser,
										 submitPollByAuthorizedUser, 
										 getIpAddress, 
										 getUserRelatedPolls, 
										 getUserId})(Polls);