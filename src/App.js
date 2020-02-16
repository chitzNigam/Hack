import React, { Component } from 'react'
import SimpleStorageContract from '../build/contracts/SimpleStorage.json'
import getWeb3 from './utils/getWeb3'
import ipfs from './ipfs'
import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'
const crypto = require('crypto');
const key = 'hue3Hb4G9Khe3B4Ghue3Hb4G9Khe3B4G';
const iv = 'hue3Hb4G9Khe3B4G';
// const regx = require('filename-regex');


function decrypt(text) {
 //let iv = Buffer.from(text.iv, 'hex');
 let encryptedText = Buffer.from(text, 'hex');
 let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
 let decrypted = decipher.update(encryptedText);
 decrypted = Buffer.concat([decrypted, decipher.final()]);
 return decrypted.toString();
}


var dict = {};
class App extends Component {

  constructor(props) {
    super(props)

    this.state = {
      ipfsHash: '',
      web3: null,
      buffer: null,
      account: null,
    }
    //this.uploadvid = this.uploadvid.bind(this);
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
          // this.printList();
          this.init();

        } );
        return this.setState({ ipfsHash })
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
              <div id="init">
              <h1>Upload this file on DNetTube</h1>
              </div>
              <div id="init2">
                <ul id="myList" >
                </ul>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  uploadvid(event) {
    console.log("aesfrdthyu");
    event.preventDefault()
    alert('video uploaded successfully')
    var temp = event.target.title
    console.log("Successful "+temp);
    console.log('hash= '+decrypt(dict[temp]))
  }

  submitvid(){
    while(document.getElementById("init").childElementCount > 0){
      var list = document.getElementById("init");
      list.removeChild(list.childNodes[0]);
    }
    // this.clearList();
    // this.printList()
    const videx = new RegExp("^.*\.(avi|AVI|wmv|WMV|flv|FLV|mpg|MPG|mp4|MP4)$")
    for (var key in dict) {
      if(videx.test(key)){
        if (dict.hasOwnProperty(key)) {
          console.log(key + " -> " + decrypt(dict[key]));
          var node = document.createElement("LI");
          var a = document.createElement("a");
          var textnode = document.createTextNode(key);
          a.appendChild(textnode);
          a.title = key;
          a.href = "#"
          a.onclick = (event) => {
            console.log("aesfrdthyu");
            event.preventDefault()
            alert('video uploaded successfully')
            var temp = event.target.title
            console.log("Successful "+temp);
            console.log('hash= '+decrypt(dict[temp]))
          };
          node.appendChild(a);
          document.getElementById("myList").appendChild(node);
        }
      }
    }
  }

  printList() {
    const videx = new RegExp("^.*\.(avi|AVI|wmv|WMV|flv|FLV|mpg|MPG|mp4|MP4)$")
    for (var key in dict) {
      if(videx.test(key)){
        if (dict.hasOwnProperty(key)) {
          console.log(key + " -> " + decrypt(dict[key]));
          var node = document.createElement("LI");
          var a = document.createElement("a");
          var textnode = document.createTextNode(key);
          a.appendChild(textnode);
          a.title = key;
          a.href = "#"
          a.onclick = this.uploadvid;
          node.appendChild(a);
          document.getElementById("myList").appendChild(node);
        }
      }
    }
  }

  clearList() {
    while(document.getElementById("myList").childElementCount > 0){
      var list = document.getElementById("myList");
      list.removeChild(list.childNodes[0]);
    }
  }

  init(){
    var btn = document.createElement("BUTTON");
    btn.onclick = this.submitvid;
    var textnode = document.createTextNode("Upload the video from DNetDrive");
    btn.appendChild(textnode);
    document.getElementById("init").appendChild(btn);
  }

}

export default App
