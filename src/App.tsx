import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { GlobalProps } from '.';

interface Props extends GlobalProps {}

interface State {
  greeting: string;
  multiply: number;
}

class App extends Component<Props, Partial<State>> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    this.props.cc
      .greeting()
      .then(result => {
        console.log('result:', result);
        this.setState({ greeting: result });
      })
      .catch(console.error);
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.tsx</code> and save to reload.
          </p>
          <a className="App-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
            Learn React
          </a>
          <p>{this.state.greeting}</p>
        </header>
      </div>
    );
  }
}

export default App;
