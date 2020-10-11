import React, { Component } from 'react';
import {
    Container,
  } from 'semantic-ui-react'

class Clock extends Component {

    constructor(props){
        super(props);
        this.state = {
            time: new Date().toLocaleString()
        };
    }

    componentDidMount() {
        this.intervalID = setInterval(
          () => this.tick(),
          1000
        );
      }

      componentWillUnmount() {
        clearInterval(this.intervalID);
      }

      tick() {
        this.setState({
          time: new Date().toLocaleString()
        });
      }
      render() {
        return (
          <div className="App-clock" style={{fontSize: 15}}>
            <b>{this.state.time}</b>
          </div>
        );
      }
}

export default Clock;