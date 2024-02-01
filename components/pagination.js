"use client"
import React, {Component} from 'react'
import { MenuItem, Menu, Segment } from 'semantic-ui-react'
import Link from 'next/link'
import web3 from '../ethereum/web3'

class Header extends Component {
    state = {
        address: "Login",
        isConnected: false
    };

  // handleItemClick = (e, { name }) => this.setState({ activeItem: name })
  
    async componentDidMount() {
      try {
        const accounts = await web3.eth.getAccounts();
    var address = "Login"
    if(accounts.length != 0){
        address = accounts[0]
        this.setState({address: accounts[0]});
    }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    
    render() {
      // const { activeItem } = this.state
      return(
        <Segment inverted style={{margin: "0", padding: "20px", borderRadius: "0"}}>
        <Menu inverted pointing secondary>
          <MenuItem style={{marginLeft: "70px;",}}
          ><Link href="/">Home</Link></MenuItem>
          {/* <MenuItem 
          ><Link href="/">Top</Link></MenuItem> */}
          {this.state.address == "Login"? (<></>): (<MenuItem  position='right'><Link href={`/articles/new`}>New Article</Link></MenuItem>)}
           {this.state.address == "Login"? (<MenuItem position='right' style={{marginRight: "70px"}} ><Link href={`/login`}>Conect Wallet</Link></MenuItem>): (<MenuItem  style={{marginRight: "70px"}}><Link href={`/author/${this.state.address}`}>{this.state.address.slice(0,7)}...{this.state.address.slice(27,32)}</Link></MenuItem>)}
        </Menu>
      </Segment>

    )
    }
  }
  
  export default Header;


  
