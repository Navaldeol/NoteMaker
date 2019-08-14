import React, { Component } from 'react';
import Header from './src/Header.js';
import noteManager from './src/Notes.js';

export default class App extends Component {
    constructor() {
        super();

        this.state = {
            title: 'React Starter',
            description: 'A basic template that consists of the essential elements that are required to start building a React application'
        };
    }
    render() {
        return (
            <div>
                <Header />
                <div className= "container m5-5">
                    <noteManager />
                </div>
            </div>
        )
    }
}