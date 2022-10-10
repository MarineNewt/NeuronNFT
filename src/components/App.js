import React, { Component } from 'react';
import Web3 from 'web3';
import NFTcon from '../contracts/neuron.json'
import btnimg from "./images/logo.png"
import bkgrd from "./images/backgrd.png"
import NavBar from './NavBar.js';
import './App.css';

class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadWeb3(){
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-ethereum browser detected. Metamask install is recommended.')
    }
  }

  
  async loadBlockchainData() {
    const web3 = window.web3
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    const networkId = await web3.eth.net.getId() 
    const NFTContractData = NFTcon.networks[networkId]
    if(NFTContractData) {
      const NFTContract = new web3.eth.Contract(NFTcon.abi, NFTContractData.address)
      this.setState({ NFTContract })
      let NFTContractBalance = await NFTContract.methods.balanceOf(this.state.account).call()
      this.setState({ NFTContractBalance: NFTContractBalance.toNumber() })
      let NFTContractSupply = await NFTContract.methods.supplyMinted().call()
      this.setState({ NFTContractSupply: NFTContractSupply.toNumber() })
      }
    else {
      window.alert('Please switch to the Ethereum Network ')
      }

    this.setState({ loading: false })
  }

  mint = (adone, adtwo, adthree, adfour, adfive) => {
    const web3 = window.web3
    let addone = adone.toString()
    let addtwo = adtwo.toString()
    let addthree = adthree.toString()
    let addfour = adfour.toString()
    let addfive = adfive.toString()
    this.setState({loading: true})
    this.state.NFTContract.methods.mint(addone,addtwo,addthree,addfour,addfive).send({ from: this.state.account, value: web3.utils.toWei('0.015') }).on('transactionHash', (hash) => {
    this.setState({ loading: false })
  })}

  constructor(props) {
    super(props)
    this.state = {
      account: '0x0',
      NFTContract: {},
      tokenBalance: '0',
      NFTContractSupply: 0,
      loading: true
    }
  }
  
  render() {
    return (
      <div style={{height: '250vh', margintop: '0', backgroundImage: `url( ${bkgrd} )`,
      backgroundSize: 'contain'}}>
        <NavBar account = {this.state.account} />
        <br></br>
        <div style={{left: '29vw', top: 'calc(30vh - 5vw)', position: 'absolute'}}>
          <div id="content" className="mt-3 compbox comp-font-sizer">
            <h1 class="comp-head-sizer">Neuron Network</h1>
            <p>Neurons Minted: {this.state.NFTContractSupply}/1000</p>
            <p className=''>CLICK TO MINT A NEURON:</p>
            <form onSubmit={(event) => {
            event.preventDefault()
            let addone
            let addtwo
            let addthree
            let addfour
            let addfive
            addone = this.input1.value.toString()
            addtwo = this.input2.value.toString()
            addthree = this.input3.value.toString()
            addfour = this.input4.value.toString()
            addfive = this.input5.value.toString()
            this.mint(addone,addtwo,addthree,addfour,addfive)}}>
            <input type="image" src={btnimg} alt="" style={{height: "8vw", borderRadius: "13px"}} name="saveForm" class="btTxt submit" id="saveForm" />
            <p className="mt-0"> 0.015 Eth</p>
            <div>
              <h2 className="float-left mt-4"  style = {{color: "white", fontSize: "2vw"}} >Enter the 5 Addresses below that your token Network will be connected to:</h2>
              <br></br>
              <div className='input-group'>
              <input
                type="text"
                ref={(input) =>  { this.input1 = input }}
                className="form-control form-control-lg"
                placeholder="0x00"
                required
                style={{height: "3vw"}} />
              <input
                type="text"
                ref={(input) =>  { this.input2 = input }}
                className="form-control form-control-lg"
                placeholder="0x00"
                required
                style={{height: "3vw"}} />
              <input
                type="text"
                ref={(input) =>  { this.input3 = input }}
                className="form-control form-control-lg"
                placeholder="0x00"
                required
                style={{height: "3vw"}} />
              <input
                type="text"
                ref={(input) =>  { this.input4 = input }}
                className="form-control form-control-lg"
                placeholder="0x00"
                required
                style={{height: "3vw"}} />
              <input
                type="text"
                ref={(input) =>  { this.input5 = input }}
                className="form-control form-control-lg"
                placeholder="0x00"
                required
                style={{height: "3vw"}} />

              </div>
            </div>
          </form>

          </div>
        </div>
      </div>
    );
  }
}

export default App;
