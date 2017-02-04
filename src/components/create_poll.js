import React, { Component } from 'react';
import { connect } from 'react-redux';
import Header from './header';
import { createPoll, getPollDataByPollId, editPoll } from '../actions';

class CreatePoll extends Component {

	static contextTypes = {
		router: React.PropTypes.object
	}

	constructor(props) {
		super(props);
		this.state = { "options": [{"option":""}, {"option":""}], 
					   "question":"", 
					   "isCreateButtonClicked":false, 
					   "isEditable":false,
					   "sumbitButtonText":"",
					   "bodyHeader":"",
					   "submitVerificationText":"" };
	}

	componentWillMount() {
		const { router } = this.context;
		const { pollId } = this.props.params;
		if(router.isActive('/edit/poll/' + pollId)) {
			this.setState({"isEditable":true});
			this.props.getPollDataByPollId(pollId);
		}
		if(!this.state.isEditable){
			this.setState({"sumbitButtonText":"Create", 
						   "bodyHeader":"Create A Poll", 
						   "submitVerificationText":"Click Here to Create"});
		}
	}

	componentWillReceiveProps(nextProps) {
		if(this.state.isEditable){
			const pollData = nextProps.pollData[0];
			let options = [];
			pollData.options.forEach((opt) => {
				options.push(opt);
			});
			this.setState({"question":pollData.question,
						   "options":options,
						   "sumbitButtonText":"Edit", 
						   "bodyHeader":"Edit A Poll",
						   "submitVerificationText":"Click Here to Edit"});
		} 
	}

	renderQuestion() {
		let opts = {};
		if(this.state.isEditable){
			opts["readOnly"] = "readOnly";
		}
		return(
			<div>
				<div className="input-group create-input-group">
		            <span className="input-group-addon">Q</span>
		            <input value={this.state.question} 
		            	   onChange={(event) => this.setQuestionState(event)} 
		            	   type="text" 
		            	   className="form-control create-question" 
		            	   placeholder="Enter the poll" {...opts} />
		            {this.renderCreateOrCancelButton()}
		            {this.renderSelectePollBackground()}
		        </div>
	        </div>
		);
	}

	renderCreateOrCancelButton() {
		if(this.state.isCreateButtonClicked) {
			return (
				<div className="input-group-btn">
	              <button onClick={() => this.handleCancelButton()} className="btn btn-default cancelButton">
	                Cancel
	              </button>
	            </div>
			);
		} else {
			return (
				<div className="input-group-btn">
	              <button onClick={() => this.handleCreateButton()} className="btn btn-default createButton">
	                {this.state.sumbitButtonText}
	              </button>
	            </div>
			);
		}
	}

	renderSelectePollBackground() {
		if(this.state.isCreateButtonClicked) {
			return (
				<div onClick={() => this.updatePoll(this.state.question, this.state.options)} className="selectedPollBackground">
	            	{this.state.submitVerificationText}
	        	</div>
			);
		} 
	}

	updatePoll(question, options) {
		if(this.state.isEditable) {
			this.props.editPoll(question,options,this.props.pollData[0]);
		} else {
			this.props.createPoll(question,options);
		}
	}

	renderOptions() {
		let optionCounter = 0;
		const options = this.state.options;
		const optionsLength = options.length;
		let opts = {};
		return options.map((option) => {
			optionCounter++;
			let thatOptionCounter = optionCounter;
			if(this.state.isEditable && this.props.pollData && thatOptionCounter <= this.props.pollData[0]["options"].length){
				opts["readOnly"] = "readOnly";
			} else {
				opts["readOnly"] = null;
			}
			return (
				<div key={"Option "+ optionCounter}>
					<div className="input-group create-options">
			            <input value={this.state.options[optionCounter-1]["option"]} 
			            	   onChange={(event) => this.setOptionState(event,thatOptionCounter)}
			            	   type="text" 
			            	   className="form-control" 
			            	   placeholder={"Option "+ optionCounter} {...opts} />
			            {this.renderOptionPlusButton(optionsLength, optionCounter)}
			            {this.renderOptionMinusButton(optionsLength, optionCounter)}
			        </div>
		        </div>
			);
		});
	}

	renderOptionPlusButton(optionsLength, optionCounter) {

		if(this.state.isEditable ) {
			if(this.props.pollData && optionCounter >= this.props.pollData[0]["options"].length) {
				return (
					<div className="input-group-btn">
		              <button onClick={() => this.handleOptionPlusButton(optionCounter)} 
		                      className="btn btn-default select-option-plus-button">
		                <i className="fa fa-plus" aria-hidden="true"></i>
		              </button>
		            </div>
				);
			}
		} else if(optionsLength === 2 && optionCounter > 1 || optionsLength > 2) {
			return (
				<div className="input-group-btn">
	              <button onClick={() => this.handleOptionPlusButton(optionCounter)} 
	                      className="btn btn-default select-option-plus-button">
	                <i className="fa fa-plus" aria-hidden="true"></i>
	              </button>
	            </div>
			);
		}
	}

	renderOptionMinusButton(optionsLength, optionCounter) {
		if(this.state.isEditable ) {
			if(this.props.pollData && optionCounter > this.props.pollData[0]["options"].length) {
				return(
					<div className="input-group-btn">
		              <button onClick={() => this.handleOptionMinusButton(optionCounter)} 
		              		  className="btn btn-default select-option-minus-button">
		                <i className="fa fa-minus" aria-hidden="true"></i>
		              </button>
		            </div>
				);
			}
		} else if(optionsLength > 2) {
			return(
				<div className="input-group-btn">
	              <button onClick={() => this.handleOptionMinusButton(optionCounter)} 
	              		  className="btn btn-default select-option-minus-button">
	                <i className="fa fa-minus" aria-hidden="true"></i>
	              </button>
	            </div>
			);
		}
	}

	setQuestionState(event) {
		this.setState({"question":event.target.value});
	}

	setOptionState(event,optionCounter) {
		let {options} = this.state;
		options[optionCounter-1]["option"] = event.target.value;
		this.setState({options});
	}

	handleOptionPlusButton(optionCounter) {
		let { options } = this.state;
		options.splice(optionCounter,0,{"option":""});
		this.setState({...this.state,options});
	}

	handleOptionMinusButton(optionCounter) {
		let { options } = this.state;
		options.splice(optionCounter-1, 1);
		this.setState({...this.state,options});
	}

	handleCreateButton() {
		this.setState({"isCreateButtonClicked":true});
	}

	handleCancelButton() {
		this.setState({"isCreateButtonClicked":false});
	}

  	render() {
	    return (
	    	<div>
	    	  	<Header/>
	    	  	<div>
		    	  	<p className="bodyHeader">
						{this.state.bodyHeader}
					</p>
					<div className="create-form">
				        { this.renderQuestion() }
						{ this.renderOptions() }
					</div>
				</div>
	      	</div>
	    );
	}
}

function mapStateToProps(state) {
	return {
		pollData : state.polls.pollsData
	}
}

export default connect(mapStateToProps, {createPoll, getPollDataByPollId, editPoll})(CreatePoll);