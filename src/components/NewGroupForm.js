import React, { Component } from 'react';

export default class NewGroupForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            newGroupName: '',
            error: ''
        }
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleSubmit(e) {
        // prevent form being submitted
        e.preventDefault();

        // validation and input reset
        if(this.state.newGroupName.length === 0) {
            this.setState({ error: 'A group name cannot be empty.' });
            return;
        } else if(this.state.newGroupName.length > 16) {
            this.setState({ error: 'A group name cannot be over 16 characters long.' });
            return;
        }
        this.setState({ newGroupName: '' });

        // push the name to the parent's event designated to build new group and re-send it to the container
        this.props.handleNewGroup(this.state.newGroupName);
    }
    render() {
        return (
            <form action="" onSubmit={this.handleSubmit}>
                <h5 className="title is-5">Create group</h5>
                <div className="field is-grouped">
                    <div className="control">
                        <input placeholder="Group name" className={"input is-hovered".concat(this.state.error.length > 0 ? ' is-danger' : '')} name="newGroupName" onChange={(e) => {this.setState({ newGroupName: e.target.value, error: '' })}} value={this.state.newGroupName}/>
                        {this.state.error.length > 0 && (
                            <p className="help is-danger">{this.state.error}</p>
                        )}  
                    </div>
                    <div className="control">
                        <button className="button is-link">Send</button>
                    </div>
                </div>
            </form>
        );
    }
}