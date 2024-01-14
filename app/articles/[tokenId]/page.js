import React from 'react'
import contract from '../../../ethereum/article'
import getData from '../../../pinata/getData'
async function getArticles(tokenId) {
    var tokenURI = await contract.methods.tokenURI(Number(tokenId)).call()
    console.log(tokenURI)
    var res = await getData(tokenURI);
    return res
  }
     
export default async function Page({ params }) {
    const data = await getArticles(params.tokenId)   
    return (
    <main><h1>{data.title}</h1>
    <br/>
    <p>{data.description}</p></main>)
  }