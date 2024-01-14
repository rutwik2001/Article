"use client"
import React from 'react'
import { MenuItem, Menu } from 'semantic-ui-react'

const Header = (props) => {
    var address = "Login"
    if(props.address != null){
        address = props.address
    }
    return(
        <Menu style={{marginTop: 30}}>
            <MenuItem >Home</MenuItem>
            <MenuItem >Top</MenuItem>
            <MenuItem position='right' >New Article</MenuItem>
            <MenuItem style={{border: 1}}>{address}</MenuItem>
        </Menu>
    )
}

export default Header;