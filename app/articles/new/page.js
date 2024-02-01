"use client"
import React, { Component } from 'react'
import {
  FormTextArea,
  FormInput,
  FormGroup,
  FormButton,
  Form,
  Message
} from 'semantic-ui-react'
import web3 from '../../../ethereum/web3'
import Upload from '../../../pinata/uploadData'
import Article from '../../../ethereum/article'
import DAO from '../../../ethereum/dao'

class Page extends Component {
  state = {
    loading: false,
    title: '',
    description: '',
    success: false,
    error: false,
    successMessage: "",
    errorMessage: "",
    isEthereum: false
  };
  
  async componentDidMount() {
    try {
      if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
        if(isEthereum){
          this.setState({isEthereum: true})
        } 
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  onSubmit = async (event) => {
    event.preventDefault();
    this.setState({loading: true});
    try {
      const newArticleJson = {
        title: this.state.title,
        description: this.state.description
      }
      var res = await Upload(newArticleJson)
      if(res.status == 200){
        const accounts = await web3.eth.getAccounts();
        await DAO.methods.approve("0x8A67D81F265A0345DF8135108F2B89a6a0eb20d7", 2 * (10 ** 18)).send({from: accounts[0]});
        var contractRes = await Article.methods.mintArticle(res.data.IpfsHash).send({from: accounts[0]});
        console.log(contractRes)
        //var contractRes = await contract.methods.mintArticle(accounts[0], res.data.IpfsHash).send({from: accounts[0]});
        var tokenId = await web3.utils.hexToNumberString(contractRes.events.Transfer.topics[3])
        this.setState({loading: false, success: true, successMessage: `The article ID is ${tokenId}. Redirecting in 3 seconds.`})
        setTimeout(window.location.replace(`/articles/${tokenId}`), 3000);
      }
    } catch (error) {
      this.setState({loading: false, error: true, errorMessage: error.message})
    }
    
  }

  render() {
    return (

      
      <div>
        {this.state.isEthereum ? (<h3>Please connect to a wallet</h3>):(
      <Form onSubmit={this.onSubmit} loading={this.state.loading} success = {this.state.success} error = {this.state.error}>
        
        <FormGroup widths='equal'>
          <FormInput fluid label='Title' placeholder='Title' onChange={event=>{this.setState({title: event.target.value})}}/>
        </FormGroup>
        <FormTextArea label='Description' placeholder='Tell us more...' onChange={event=>{this.setState({description: event.target.value})}}/>
        {this.state.success ? (<Message
      success
      header='Article Submitted'
      content={this.state.successMessage}
    />): <div></div>}
    
    {this.state.error ? (<Message
      error
      header='Submission failed'
      content={this.state.errorMessage}
    />): <div></div>}
        
        <FormButton type="submit">Submit</FormButton>
      </Form>
      )}
      </div>
    )
  }
}

export default Page;


