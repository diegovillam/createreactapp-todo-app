import React, { Component } from 'react';
import NewGroupForm from './NewGroupForm';
import FlipMove from 'react-flip-move';

export default class Groups extends Component {
    constructor(props) {
        super(props);
        this.handleNewGroup = this.handleNewGroup.bind(this);
    }

    handleNewGroup(name) {
        // Receive the name of the new group from the child form and build a new group from it then send it to the parent
        var group = {
            id: Math.random().toString(36).replace(/[^a-z]+/g, '').substr(2, 10), //this.props.groups.length + 1,
            name: name
        };
        this.props.onCreateGroup(group);
    }

    render() {
        // If the passed active group is the same as any group, that group is the active one
        const active = this.props.groups.find(x => x.id === this.props.group);
        return (
            <div>
                <h5 className="title is-5">{active !== undefined ? active.name : 'Select a group'}</h5>
                <ul>
                    {this.props.groups.length > 0 ? (
                        <FlipMove duration={350} staggerDurationBy={150} easing="ease-in-out">
                            {this.props.groups.map(group => {
                                return (
                                    <li key={group.id}>
                                        <a onClick={() => this.props.onDeleteGroup(group.id)}>
                                            <span className="icon">
                                                <i className="fa fa-trash"></i>
                                            </span>
                                        </a> 
                                        <a onClick={() => this.props.onChangeActiveGroup(group.id)}> {group.name}</a>
                                    </li>
                                )
                            })}
                        </FlipMove>
                    ) : (
                        <li>
                            There are no groups yet.<br/>
                            You can create a new group for your tasks in the input box below.
                        </li>
                    )}
                </ul>
                <br/>
                <div className="container">
                    <NewGroupForm
                        handleNewGroup={this.handleNewGroup}
                    />
                </div>
            </div>
        )
    }
}