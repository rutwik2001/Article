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
import contract from '../../../ethereum/article'
class Page extends Component {
  state = {
    loading: false,
    title: '',
    description: '',
    success: false,
    error: false,
    successMessage: "",
    errorMessage: ""
  };
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
        var contractRes = await contract.methods.mintArticle(accounts[0], res.data.IpfsHash).send({from: accounts[0]});
        var tokenId = await web3.utils.hexToNumberString(contractRes.events.Transfer.topics[3])
        this.setState({loading: false, success: true, successMessage: `The article ID is ${tokenId}. Redirecting in 3 seconds.`})
        setTimeout({/*Router.push(/articles/${tokenId}) */}, 3000);
      }
    } catch (error) {
      this.setState({loading: false, error: true, errorMessage: error.message})
    }

  }

  render() {
    return (
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
    )
  }
}

export default Page;


