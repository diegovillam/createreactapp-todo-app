import React, { Component } from 'react';
import NewItemForm from './NewItemForm';
import FlipMove from 'react-flip-move';

export default class Todo extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            errors: []
        }
        this.handleNewItemSubmit = this.handleNewItemSubmit.bind(this);
    }
    
    handleNewItemSubmit(data) {

        let errors = [], error = false;
        // For a submit request to be valid, the data received must include all those keys
        var keys = ['name', 'priority', 'deadline'];
        keys.forEach(key => {
            // If no key is found in the data, then that input name wasn't specified (i.e. was blank)
            if(!(key in data)) {
                error = true;
                errors[key] = "Introduce a " + key + ".";
            } else {
                // If this property exists but its length is nil, somehow it passed an empty string
                if(data[key].length === 0) {
                    error = true;
                    errors[key] = "Introduce a " + key + ".";
                }
            }
        });

        // Die if there are errors, and set the state so it will be sent to the form for update
        if(error === true) {
            this.setState({ errors: errors });
            return;
        }

        // At this point there are no errors, just build a new item and increase the auto increment counter
        //var a_i = this.state.a_i;
        var item = {
            id: Math.random().toString(36).replace(/[^a-z]+/g, '').substr(2, 10), //this.props.items.length + 1,
            status: 'Not complete',
            group: this.props.group,
            ...data
        };

        // Invoke parent event that will create the item with this passed data
        this.props.onCreateItem(item);

        // Reset the errors
        this.setState({ errors: {} });
    }

    render() {
        return (
            <div>
                <NewItemForm
                    errors={this.state.errors}
                    handleNewItemSubmit={this.handleNewItemSubmit}
                    enabled={this.props.group !== undefined ? true : false}
                />
                <br/>
            
                {this.props.group !== undefined ? (
                    this.props.items.filter(x => x.group === this.props.group).length > 0 ? (
                        <FlipMove duration={350} staggerDurationBy={150} easing="ease-in-out">
                            {this.props.items.map(item => {
                                {var style = item.status === 'Complete' ? 'complete-task' : 'incomplete-task'}
                                {var icon = item.status === 'Complete' ? 'fa-check' : 'fa-times'}
                                return (
                                    (this.props.group === item.group || this.props.group === undefined) && (
                                        <a onClick={() => this.props.onSetItemStatus(item.id, item.status === 'Complete' ? 'Not complete' : 'Complete')} key={item.id} className={"box ".concat(style)}>

                                            <div className="columns is-gapless is-vcentered">

                                                <div className="column is-2 is-centered has-text-centered">
                                                    <span className="icon">
                                                        <i className={"fa fa-3x ".concat(icon)}></i>
                                                    </span>
                                                </div>
                                                <div className="column is-4">
                                                    {item.name}<br/>
                                                </div>

                                                <div className="column is-4">
                                                    <small>
                                                        DUE: {item.deadline.toUpperCase()}<br/>
                                                        {item.priority.toUpperCase()} PRIORITY
                                                    </small>
                                                </div>
                                                
                                                <div className="column is-2 has-text-centered">
                                                    <small><small>DISCARD</small></small><br/>
                                                    <a className="delete-item-icon" onClick={() => this.props.onDeleteItem(item.id)}>
                                                        <span className="icon">
                                                            <i className="fa fa-2x fa-trash"></i>
                                                        </span>
                                                    </a> 
                                                </div>
                                            </div>
                                        </a>
                                    )
                                )
                            })}
                        </FlipMove>
                    ) : (
                        <h5 className="subtitle is-5">There are no tasks in this group yet.</h5>
                    )
                ) : (
                    <h5 className="subtitle is-5">You must specify a group to create new tasks. Create a new group or select an existing one.</h5>
                )}
            </div>
        );
    }
}