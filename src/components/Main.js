import React, { Component } from 'react';
import Todo from './Todo';
import Groups from './Groups';
import 'bulma/css/bulma.css'; // Stylesheets
import 'font-awesome/css/font-awesome.min.css'; // Font Awesome
import Util from './../modules/Util';

export default class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            group: undefined,
            groups: [],
            items: [],
            loaded: false
        }
        // event binding
        this.onChangeActiveGroup = this.onChangeActiveGroup.bind(this);
        this.onSetItemStatus = this.onSetItemStatus.bind(this);
        this.onCreateItem = this.onCreateItem.bind(this);
        this.onCreateGroup = this.onCreateGroup.bind(this);
        this.onDeleteGroup = this.onDeleteGroup.bind(this);
        this.onDeleteItem = this.onDeleteItem.bind(this);
        this.onUpdateGroups = this.onUpdateGroups.bind(this);
        this.onUpdateItems = this.onUpdateItems.bind(this);
    }

    onUpdateGroups(groups) {
        localStorage.setItem('groups', JSON.stringify(groups));
    }

    onUpdateItems(items) {
        // Util contains a keysort method to sort arrays by a key, here we pass the 'status' key
        var sorted = items.sort(Util.keysort('status'));
        // have to re-set the state to the new sorted list
        this.setState({ items: sorted });

        localStorage.setItem('items', JSON.stringify(sorted));
    }

    onChangeActiveGroup(id) {
        this.setState({ group: id });
    }

    onDeleteGroup(id) {
        let idx = 0, groups = this.state.groups;
        // find the array index matching the specified group ID
        for(var i = 0; i < groups.length; i++) {
            if(groups[i].id === id) { 
                idx = i;
                break;
            }
        }
        // now splice it out
        groups.splice(idx, 1);
        // update the groups with the new collection
        this.setState({ groups: groups }, () => {
            // delete all items belonging to this group so there aren't floating items
            var filteredItems = this.state.items.filter(x => x.group !== id);
            this.setState({ groups: groups, items: filteredItems }, () => {
                // make sure to call the onUpdate callbacks for storage processing
                this.onUpdateItems(filteredItems);
                this.onUpdateGroups(groups);
            });
        });
    }

    onDeleteItem(id) {
        let idx = 0, items = this.state.items;
        // find the array index matching this specific item ID
        for(var i = 0; i < items.length; i++) {
            if(items[i].id === id) {
                idx = i;
                break;
            }
        }
        // now splice it out
        items.splice(idx, 1);
        // update the items with the new collection
        this.setState({ items: items }, () => {
            this.onUpdateItems(items);
        });
    }

    onCreateGroup(data) {
        this.setState({ 
            groups: [
                ...this.state.groups,
                data
            ]
        }, () => {
            this.onUpdateGroups(this.state.groups);
        });
    }

    onSetItemStatus(id, status) {
        // find the item matching this ID and set its status in a clone of the state
        var items = this.state.items;
        items.forEach(item => {
            if(item.id === id) {
                item.status = status;
            }
        });
        this.setState({ items: items }, () => { 
            this.onUpdateItems(items);
        });
    }

    onCreateItem(data) {
        this.setState({
            items: [
                ...this.state.items,
                data
            ]
        }, () => {
            this.onUpdateItems(this.state.items);
        });
    }

    componentDidMount() {
        // fetch the data from storage and set it to this state, if it exists, else it's an empty collection (ie. default value)
        this.setState({
            items: localStorage.getItem('items') ? JSON.parse(localStorage.getItem('items')) : [],
            groups: localStorage.getItem('groups') ? JSON.parse(localStorage.getItem('groups')) : []
        }, () => {
            this.setState({ loaded: true });
        })
    }

    render() {
        return (
            this.state.loaded === true && (
                <div className="container" style={{marginTop: '15px'}}>
                    <div className="box">
                        {/* 
                        <button onClick={() => {localStorage.clear('items'); localStorage.clear('groups');}}>Clear all</button>
                        */}
                        <div className="columns is-centered">
                            <div className="column is-4">
                                <Groups 
                                    group={this.state.group}
                                    groups={this.state.groups}
                                    onCreateGroup={this.onCreateGroup}
                                    onDeleteGroup={this.onDeleteGroup}
                                    onChangeActiveGroup={this.onChangeActiveGroup} 
                                />
                            </div>

                            <div className="column is-8">
                                <Todo 
                                    group={this.state.group}
                                    items={this.state.items}
                                    onSetItemStatus={this.onSetItemStatus}
                                    onCreateItem={this.onCreateItem}
                                    onDeleteItem={this.onDeleteItem}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )
        );
    }
}