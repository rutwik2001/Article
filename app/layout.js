"use client"
import React from 'react';
import { Container } from 'semantic-ui-react';
import Header from '../components/header';
const Layout = (props) => {
    return(
        <html lang="en">
      <body>
      <link
    async
    rel="stylesheet"
    href="https://cdn.jsdelivr.net/npm/semantic-ui@2/dist/semantic.min.css"
  />
  <Header address={null}/>
      <Container>
      
        {props.children}
        
        </Container></body>
    </html>
       
            
    )
}
export default Layout;

// export default function RootLayout({ children }) {
//     return (
//       <html lang="en">
//         <body>{children}</body>
//       </html>
//     )
//   }