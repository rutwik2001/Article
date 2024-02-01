"use client"
import React, {Component} from 'react'
import getData from '../../../pinata/getData'
import {
  FormTextArea,
  FormInput,
  FormGroup,
  FormButton,
  Form,
  Message,
  Button
} from 'semantic-ui-react'
import web3 from '../../../ethereum/web3'
import Upload from '../../../pinata/uploadData'
import articleContract from '../../../ethereum/article';
import commentContract from '../../../ethereum/comment';
import DAO from '../../../ethereum/dao'
import { Router } from 'next/router'




class Page extends Component {
  state = {
    address: "",
    powerTokens: 0,
    isVoter: false
  };

  async componentDidMount() {
    try {
      var address = this.props.params.address;
      var powerTokens = await DAO.methods.balanceOf(address).call()
      powerTokens = await web3.utils.fromWei(powerTokens, 'ether');
      var isVoter = await articleContract.methods.isVoter(address).call();
      this.setState({address: address, powerTokens: powerTokens, isVoter: isVoter});
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  Mint = async (event) =>{
    event.preventDefault();
    try { 
      await DAO.methods.mintTokens(this.state.address, 10 * (10 ** 18)).send({from: this.state.address});
    } catch (error) {
      
    }
  }

  Voter = async (event) =>{
    event.preventDefault();
    try { 
      await articleContract.methods.createVoter().send({from: this.state.address});
    } catch (error) {
      
    }
  }


  render() {
    return (

      <main>
        <br/>
        <h1>Address: {this.state.address}</h1>
    <br/>
    <div style={{display: "flex",justifyContent: 'space-between'}}><div><h3>Power Tokens Balance: {this.state.powerTokens} POR</h3> </div><div><Button color='instagram' onClick={this.Mint}>Mint Power Tokens</Button></div></div>
    <br/>
    <div style={{display: "flex",justifyContent: 'space-between'}}><div>{this.state.isVoter? (<h3>You are a voter</h3>):(<h3>You are not a voter</h3>)}</div><div>{this.state.isVoter?(<></>):(<Button visible={!this.state.isVoter} color='instagram' onClick={this.Voter}>Become a Voter</Button>)}</div></div>
    
      </main>
    )
  }
}

export default Page;


