"use client"
import React, {Component} from 'react'
import getData from '../../../pinata/getData'
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
import articleContract from '../../../ethereum/article';
import commentContract from '../../../ethereum/comment';




class Page extends Component {
  state = {
    loading: false,
    title: '',
    description: '',
    success: false,
    error: false,
    successMessage: "",
    errorMessage: "",
    comments: [],
    data: {},

  };

  async componentDidMount() {
    try {
      var tokenId = this.props.params.tokenId
      var tokenURI = await articleContract.methods.tokenURI(Number(tokenId)).call()
    var data = await getData(tokenURI);

    const commentContractAddress = await articleContract.methods.getCommentsAddress(Number(tokenId)).call()
    const commentContractInstance = await commentContract(commentContractAddress)
    const tokenCount = await commentContractInstance.methods.totalSupply().call();
    var comments = []
    for(var i=0;i<tokenCount;i++){
      var tokenURI = await commentContractInstance.methods.tokenURI(Number(i)).call();
      var comment = await getData(tokenURI)
      comments.push(comment);
    }
      this.setState({
        data: data,
        comments: comments,
      });
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
        const commentContractAddress = await articleContract.methods.getCommentsAddress(Number(this.props.params.tokenId)).call()
        const commentContractInstance = await commentContract(commentContractAddress)
        var contractRes = await commentContractInstance.methods.mintComment(accounts[0], res.data.IpfsHash).send({from: accounts[0]});
        var tokenId = await web3.utils.hexToNumberString(contractRes.events.Transfer.topics[3])
        this.setState({loading: false, success: true, successMessage: `The article ID is ${tokenId}. Redirecting in 3 seconds.`})
      }
    } catch (error) {
      this.setState({loading: false, error: true, errorMessage: error.message})
    }

  }

  getArticle = async (tokenId) => {
    var tokenURI = await articleContract.methods.tokenURI(Number(tokenId)).call()
    var res = await getData(tokenURI);
    return res
  }
  getComments = async (tokenId) => {
    const commentContractAddress = await articleContract.methods.getCommentsAddress(Number(tokenId)).call()
    const commentContractInstance = await commentContract(commentContractAddress)
    const tokenCount = await commentContractInstance.methods.totalSupply().call();
    var comments = []
    for(var i=0;i<tokenCount;i++){
      var tokenURI = await commentContractInstance.methods.tokenURI(Number(i)).call();
      var comment = await getData(tokenURI)
      comments.push(comment);
    }
    return comments
  }

  render() {
    return (

      <main>
        <h1>{this.state.data.title}</h1>
    <br/>
    <p>{this.state.data.description}</p>
    <br/>
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
      <br/>
      <h1>Comments</h1>
      {this.state.comments.map((comment) => (
      <div key={comment.title}>
          <h1>{comment.title}</h1>
          <br/>
          <p>{comment.description}</p>
          <br/>
          </div>
        ))}
      
      </main>
    )
  }
}

export default Page;


