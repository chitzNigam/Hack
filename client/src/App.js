import React, { Component } from "react";
import EtherChatContract from "./contracts/EtherChat.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
  state = { storageValue: 0, web3: null, accounts: null, contract: null, myUsername: '' };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = EtherChatContract.networks[networkId];
      const instance = new web3.eth.Contract(
        EtherChatContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance }, this.runExample);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  _setUsername(){
    this.state.myUsername = this.contract.getUsername(this.accounts[0]);
  }

  runExample = async () => {

     const { accounts, contract } = this.state;
     
    // // Stores a given value, 5 by default.

    // // Get the value from the contract to prove it worked.
    // const response = await contract.methods.get().call();

    // // Update state with the result.
    // this.setState({ storageValue: response });
  };

  addUser(event){
    event.preventDefault()
    var a = async (event) => {
    this.state.contract.addUser(event.target.text[0]);
    console.log(event.target.text[0]);
    };

    a.res
  }


  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        Add username : {this.state.myUsername}<br/>
         <form onSubmit={this.addUser} >
                <input type='text'  placeholder="Enter Username"/>
                <input type='submit' text='Submit' value='Submit'/>
              </form>
      </div>
    );
  }
}

export default App;
