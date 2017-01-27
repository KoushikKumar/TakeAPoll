import React, { Component } from 'react';

import Header from './header';

export default class CreatePoll extends Component {

	constructor(props) {
		super(props);
		this.state = { "options": [{"option":""}, {"option":""}], "question":"", "question-help-text":"" };
	}

	renderQuestion() {
		return(
			<div>
				<div className="input-group">
		            <span className="input-group-addon">Q</span>
		            <input value={this.state.question} 
		            	   onChange={(event) => this.setQuestionState(event)} 
		            	   type="text" 
		            	   className="form-control create-question" 
		            	   placeholder="Enter the poll"/>

		            <div className="input-group-btn">
		              <button onClick={() => this.validatePoll()} className="btn btn-default">
		                Create
		              </button>
		            </div>
		        </div>
		        {this.renderQuestionHelpBlock()}
	        </div>
		);
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

	renderQuestionHelpBlock() {
		if(this.state["question-help-text"]){
			return (
				<span className="help-block">{this.state["question-help-text"]}</span>
			);
		}
	}

	setQuestionState(event) {
		this.setState({"question":event.target.value});
		this.validatePoll();
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

	validatePoll() {
		this.validateQuestion();
		this.validateOptions();
	}

	validateQuestion() {
		if(!this.state.question) {
			this.setState({"question-help-text":"You need to fill the poll"})
		} else {
			this.setState({"question-help-text":""})	
		}	
	}

	validateOptions() {
		
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