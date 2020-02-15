import React, { Component } from 'react'
import SimpleStorageContract from '../build/contracts/SimpleStorage.json'
import getWeb3 from './utils/getWeb3'
import ipfs from './ipfs'

//import Encryp from 'https://rawcdn.githack.com/mdp/gibberish-aes/a1a10dc8037487e6fb0ecfeae89e14d8c382c2f9/src/gibberish-aes.js'
import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

//var Encrp = require('gibberish-aes.js');
var dict = {};
var fileName = '';
var T = '';

class App extends Component {

  constructor(props) {
    super(props)

    this.state = {
      ipfsHash: '',
      web3: null,
      buffer: null,
      account: null,
    }
    this.captureFile = this.captureFile.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentWillMount() {
    getWeb3
    .then(results => {
      this.setState({
        web3: results.web3
      })
      this.instantiateContract()
    })
    .catch(() => {
      console.log('Error finding web3.')
    })
  }

  instantiateContract() {

    //console.log(Encrp.enc("Hello"));

    const contract = require('truffle-contract')
    const simpleStorage = contract(SimpleStorageContract)
    simpleStorage.setProvider(this.state.web3.currentProvider)

    // Get accounts.
    this.state.web3.eth.getAccounts((error, accounts) => {
      simpleStorage.deployed().then((instance) => {
        this.simpleStorageInstance = instance
        this.setState({ account: accounts[0] })
        // Get the value from the contract to prove it worked.
        return this.simpleStorageInstance.get.call(accounts[0])
      }).then((ipfsHash) => {
        // Update state with the result.
        
        console.log(ipfsHash);
        ipfs.get(ipfsHash).then( (r) =>{
          console.log(typeof r);
          var buf = r[0]['content'];
          console.log(buf);
          dict = JSON.parse(buf.toString());
          this.printList();

        } );
        return this.setState({ ipfsHash })
      })
    })
    
  }

  captureFile(event) {
    event.preventDefault()
    const file = event.target.files[0]

    fileName = file.name;     // uploding file name
    console.log(fileName);

    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)
    reader.onloadend = () => {
      this.setState({ buffer: Buffer(reader.result) })
      console.log(fileName);
      console.log(this.state.buffer)
    }
  }

  onSubmit(event) {
    event.preventDefault()
    ipfs.files.add(this.state.buffer, (error, result) => {
      if(error) {
        console.error(error)
        return
      }
      this.simpleStorageInstance.set(result[0].hash, { from: this.state.account }).then((r) => {

        console.log('ifpsHash', result[0].hash);
        dict[fileName] = result[0].hash;
        this.setState({ ipfsHash: result[0].hash })

        for (var key in dict) {
          if (dict.hasOwnProperty(key)) {
            console.log(key + " -> " + dict[key]);
          }
        }

        // adding json file==
        var buf = Buffer.from(JSON.stringify(dict));
        console.log('printing buffer');
        console.log('buffer  ' , buf);

        console.log('uploading file........');
        ipfs.files.add(buf, (error, result) => {
          if(error) {
            console.error("error in uploading file...");
            return
          }
          this.simpleStorageInstance.set(result[0].hash, { from: this.state.account }).then((r) => {

            console.log('value of r');
            console.log(r.toString());
            console.log('ifpsHash', result[0].hash);
            console.log('uploaded successfully........');
            this.clearList();
            this.printList();
            return this.setState({ ipfsHash: result[0].hash })
          })
        })

      })
    })
    
  }

  render() {
    return (
      <div className="App">
        <nav className="navbar pure-menu pure-menu-horizontal">
          <a href="#" className="pure-menu-heading pure-menu-link">IPFS Drive</a>
        </nav>
        <main className="container">
          <div className="pure-g">
            <div className="pure-u-1-1">
              <h1>Your Data</h1>
              <ul id="myList" onLoad={this.addfile} >
              </ul>

              <h2>Upload File</h2>
              <form onSubmit={this.onSubmit} >
                <input type='file' onChange={this.captureFile} />
                <input type='submit' />
              </form>
            </div>
          </div>
        </main>
      </div>
    );
  }


  async downloadData(){
    // const BufferList = require('bl/BufferList')
    // const cid = T;

    // for  (const file of ipfs.get(cid)) {
    //   console.log(file.path)

    //   const content = new BufferList()
    //   for await (const chunk of file.content) {
    //     content.append(chunk)
    //   }

    //   console.log(content.toString())
    // }
  }

  printList() {
    for (var key in dict) {
      if (dict.hasOwnProperty(key)) {
        var link = `https://ipfs.io/ipfs/${dict[key]}`;
        console.log(key + " -> " + dict[key]);
        var node = document.createElement("LI");
        var a = document.createElement("a");
        var textnode = document.createTextNode(key);
        a.appendChild(textnode);
        a.title = key;
        // a.onclick = this.downloadData;
        a.href = link;
        a.target = '_blank';
        T = dict[key];
        node.appendChild(a);
        document.getElementById("myList").appendChild(node);
      }
    }
  }

  clearList() {
    while(document.getElementById("myList").childElementCount > 0){
      var list = document.getElementById("myList");
      list.removeChild(list.childNodes[0]);
    }
  }

}

export default App
