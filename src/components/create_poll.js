import React, { Component } from 'react';
import { connect } from 'react-redux';
import Header from './header';
import { createPoll } from '../actions';

class CreatePoll extends Component {

	constructor(props) {
		super(props);
		this.state = { "options": [{"option":""}, {"option":""}], "question":"", "isCreateButtonClicked":false };
	}

	renderQuestion() {
		return(
			<div>
				<div className="input-group create-input-group">
		            <span className="input-group-addon">Q</span>
		            <input value={this.state.question} 
		            	   onChange={(event) => this.setQuestionState(event)} 
		            	   type="text" 
		            	   className="form-control create-question" 
		            	   placeholder="Enter the poll"/>
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
	                Create
	              </button>
	            </div>
			);
		}
	}

	renderSelectePollBackground() {
		if(this.state.isCreateButtonClicked) {
			return (
				<div onClick={() => this.props.createPoll(this.state.question, this.state.options)} className="selectedPollBackground">
	            	Click Here To Create
	        	</div>
			);
		} 
	}

	renderOptions() {
		let optionCounter = 0;
		const options = this.state.options;
		const optionsLength = options.length;
		return options.map((option) => {
			optionCounter++;
			let thatOptionCounter = optionCounter;
			return (
				<div key={"Option "+ optionCounter}>
					<div className="input-group create-options">
			            <input value={this.state.options[optionCounter-1]["option"]} 
			            	   onChange={(event) => this.setOptionState(event,thatOptionCounter)}
			            	   type="text" 
			            	   className="form-control" 
			            	   placeholder={"Option "+ optionCounter }/>
			            {this.renderOptionPlusButton(optionsLength, optionCounter)}
			            {this.renderOptionMinusButton(optionsLength, optionCounter)}
			        </div>
		        </div>
			);
		});
	}

	renderOptionPlusButton(optionsLength, optionCounter) {
		if (optionsLength === 2 && optionCounter > 1 || optionsLength > 2) {
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
		if(optionsLength > 2) {
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
						Create A Poll
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

export default connect(null, {createPoll})(CreatePoll);