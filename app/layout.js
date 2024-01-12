"use client"
import React from 'react';
import { Container } from 'semantic-ui-react';
import Header from '../components/header';

const Layout = (props) => {
    return(
        <div>
            <Container>
                <body>
                <link
    async
    rel="stylesheet"
    href="https://cdn.jsdelivr.net/npm/semantic-ui@2/dist/semantic.min.css"
  />
  <Header address={null}/>
  
                    {props.children}</body>
            </Container>
        </div>
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