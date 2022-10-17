import React, { Component } from 'react';
import Web3 from 'web3';
import NFTcon from '../contracts/neuron.json'
import btnimg from "./images/logo.png"
import dia from "./images/dia.png"
import dia2 from "./images/dia2.png"
import bkgrd from "./images/alt5.png"
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

  async checker(verifyadd) {
    verifyadd = this.input.value.toString()
    let eli = this.state.NFTContract.methods.balanceOf(verifyadd).call()
    let eligibility
    if (eli > 0) {eligibility = false}
    else {eligibility = true}
    this.setState({ eligibility: eligibility})
    }

  constructor(props) {
    super(props)
    this.state = {
      account: '0x0',
      NFTContract: {},
      tokenBalance: '0',
      NFTContractSupply: 0,
      eligibility: true,
      loading: true
    }
  }
  
  render() {
    return (
      <div style={{height: '380vh', margintop: '0', backgroundImage: `url( ${bkgrd} )`,
      backgroundSize: 'contain'}}>
        <NavBar account = {this.state.account} />
        <br></br>
        <br></br>
        <div className="content mt-5 mr-auto ml-auto">
          <div id="content" className="mt-0 mr-auto ml-auto compbox comp-font-sizer">
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
          <br></br>
          <div className='compbox comp-font-sizer mt-3 mr-auto ml-auto' style={{width: '75vw'}}>
            <h1>How it works:</h1>
            <h2>Neuron NFTs are dynamic NFTs that change based on the presence (or absence) of other NFTs.</h2>
            <div style={{textAlign: 'left'}}>
            <p className='mt-4'>For .015 you can mint yourself a Neuron NFT. Before minting you will choose 5 friends by address to be a part of that token's network. You must choose friends with 0 neuron NFTs; you cannot build a network on top of existing connections. Additionally a Neuron NFT cannot be owned by a wallet within its network. </p>
            
            <form onSubmit={(event) => {
              event.preventDefault()
              let verifyadd
              verifyadd = this.input.value.toString()
              this.checker(verifyadd)}}>
              <div className='input-group'>
              <input
                type="text"
                ref={(input) =>  { this.input = input }}
                className="form-control form-control-lg"
                placeholder="0x00  (Enter an Address here to check if it is eligible to be a part of your network.)"
                required />
                <button type="submit" name='verifybtn' className="input-group-append inputbtn" style = {{color: "black"}} >Check</button>
                </div>
            </form>
            {this.state.eligibility === false && <p style={{color: 'red'}}>This address cannot be used.</p>}
            {this.state.eligibility === true && <p style={{color: 'green'}}>This address may be used.</p>}

            <p className='mt-4'>Now you can mint, but this project doesn't stop at minting...</p>
            
            <p className='mt-4'>Upon minting you will see The CELL in your wallet. All Neuron NFTs begin as a CELL, but only some remain as one. Whenevever someone in your token's network gets a neuron NFT in their wallet your neuron NFT will expand its network level and transform into its next form.</p>
            
            <div style={{textAlign: 'center', margin: '40px'}}><img style={{width: '45vw'}} src={dia} alt='diagram 1'/></div>

            <p>A network can't be supported by just one person/wallet, thus only 2 neurons per wallet contribute towards the level rating of the Neurons that have that wallet in their network:</p>

            <div style={{textAlign: 'center', margin: '40px'}}><img style={{width: '40vw'}} src={dia2} alt='diagram 1'/></div>

            <p>Maybe your network will help you reach the top form, or maybe you will be the link that propels others forward. But be careful, to reach the final form you must only hold exactly 1 neuron in your wallet. </p>
            </div>
            <h3>What's in your Network?</h3>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
