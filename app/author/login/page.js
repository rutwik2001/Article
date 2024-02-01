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
    hidden: true,
    yourVote: ''
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

  Approve = async (event) => {
    event.preventDefault();
    this.setState({yourVote: true})
  };

  Disapprove = async (event) => {
    event.preventDefault();
    this.setState({yourVote: false})
  };

  onSubmit = async (event) => {
    event.preventDefault();
    this.setState({loading: true});
    try {
      if(this.state.yourVote != ''){
        if(this.state.title != ""&& this.state.description != ""){
          const newArticleJson = {
            title: this.state.title,
            description: this.state.description
          }
          var res = await Upload(newArticleJson)
          if(res.status == 200){
            const accounts = await web3.eth.getAccounts();
            const DaoRes = await DAO.methods.approve("0x8A67D81F265A0345DF8135108F2B89a6a0eb20d7", 1 * (10 ** 18)).send({from: accounts[0]});
            var contractRes = await articleContract.methods.vote(Number(this.props.params.tokenId), this.state.yourVote, res.data.IpfsHash).send({from: accounts[0]});
            //const contractRes = await DAO.methods.vote(Number(this.props.params.tokenId), res.data.IpfsHash, this.state.yourVote).send({from: accounts[0]});
            var tokenId = await web3.utils.hexToNumberString(contractRes.events.Transfer.topics[3])
            this.setState({loading: false, success: true, successMessage: `Your vote is submitted. The comment ID is ${tokenId}`})
          }
        } else{
          const accounts = await web3.eth.getAccounts();
          const DaoRes = await DAO.methods.approve("0x8A67D81F265A0345DF8135108F2B89a6a0eb20d7", 1 * (10 ** 18)).send({from: accounts[0]});
          var contractRes = await articleContract.methods.vote(Number(this.props.params.tokenId), this.state.yourVote, "").send({from: accounts[0]});
          this.setState({loading: false, success: true, successMessage: `Your vote is submitted`})
        }
      } else{
        this.setState({hidden: false, loading: false, success: true, successMessage: `Plaes cast your vote`})
      }
    } catch (error) {
      this.setState({loading: false, error: true, errorMessage: error.message})
    }

  }
  onClick = async (event) =>{
    event.preventDefault();
    this.setState({hidden: false});
  }


  render() {
    return (

      <main>
        <br/>
        <h1>{this.state.data.title}</h1>
    <br/>
    <p>{this.state.data.description}</p>
    <br/>
    <br/>
      <Form onSubmit={this.onSubmit} loading={this.state.loading} success = {this.state.success} error = {this.state.error}>
      <div style={{display: "flex",justifyContent: 'space-between'}}><div><h1>You are invited to vote</h1></div><div style={{marginLeft:"400px"}}><Button  onClick={this.Approve} color='green'>Approve</Button></div><div><Button onClick={this.Disapprove} color='red'>Disapprove</Button></div><FormButton color='primary' type="submit">Submit</FormButton></div>
      <br/>
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
        
        
      </Form>
  
      
      
      <h1>Comments</h1>
      <br/>
      {this.state.comments.map((comment) => (
      <div key={comment.title}>
          <h1>{comment.title}</h1>
          
          <p>{comment.description}</p>
          <br/>
          </div>
        ))}
      
      </main>
    )
  }
}

export default Page;


