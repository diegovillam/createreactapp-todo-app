import React, { Component } from 'react';

export default class NewItemForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            item: {}
        }
        this.handleInput = this.handleInput.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    // This is a group of controlled inputs, so handle inputs for each input
    handleInput(e) {
        const field = e.target.name, item = this.state.item;
        item[field] = e.target.value;
        this.setState({ item });
    }
    
    // On submit, simply send the data back to the parent for validation
    // This means this component acts as the responsible for the form, and the parent is responsible
    // for validation
    handleSubmit(e) {
        e.preventDefault(); 

        if(this.props.enabled === false) {
            return; 
            // just abort if this is disabled
            // this happens when no groups are selected
        }

        // handle the submit through the parent's events sending this form's data
        this.props.handleNewItemSubmit(this.state.item);
    }

    render() {

        return (
            <form action="" onSubmit={this.handleSubmit}>
                <h5 className="title is-5">Create a new task</h5>
                <div className="field is-horizontal is-grouped">
                    <div className="control">
                        <input placeholder="Name" disabled={this.props.enabled === false} className={"input is-hovered".concat('name' in this.props.errors ? ' is-danger' : '')} value={this.state.item.name || ''} onChange={this.handleInput} type="text" name="name"/>
                        {'name' in this.props.errors && (
                            <p className="help is-danger">{this.props.errors.name}</p>
                        )}
                    </div>
                    
                    <div className="control">
                        <div className={"select".concat('priority' in this.props.errors ? ' is-danger' : '').concat(' is-fullwidth')}>
                            <select disabled={this.props.enabled === false} onChange={this.handleInput} value={this.state.item.priority || 'None'} name="priority">
                                <option disabled value="None">Select a priority</option>
                                <option value="Minor">Minor</option>
                                <option value="Medium">Medium</option>
                                <option value="Major">Major</option>
                            </select>
                        </div>
                        {'priority' in this.props.errors && (
                            <p className="help is-danger">{this.props.errors.priority}</p>
                        )}
                    </div>

                    <div className="control">
                        <input type="date" placeholder="Deadline" disabled={this.props.enabled === false} className={"input is-hovered".concat('deadline' in this.props.errors ? ' is-danger' : '')} value={this.state.item.deadline || ''} onChange={this.handleInput} name="deadline"/>
                        {'deadline' in this.props.errors && (
                            <p className="help is-danger">{this.props.errors.deadline}</p>
                        )}
                    </div>
                    
                    <div className="control">
                        <button disabled={this.props.enabled === false} className="button is-link">Send</button>
                    </div>
                </div>
            </form>
        );
    }
}