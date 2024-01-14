import contract from '../../ethereum/erc721';
import getData from '../../pinata/getData'
async function getArticles() {
    var numberOfTokens = 5//await contract.methods.totalSupply().call() https://portal.thirdweb.com/contracts/build/extensions/erc-721/ERC721Supply https://stackoverflow.com/questions/68810515/totalsupply-is-not-a-function-openzeppelin-contracts
    var data = []
    for(var i=0;i<numberOfTokens;i++){
      var tokenURI = await contract.methods.tokenURI(Number(i)).call();
      data.push(await getData(tokenURI));
    }
    return data
  }
   
  export default async function Page() {
    const datas = await getArticles()   
    return (
    <main><h1>Articles</h1>
    <br/>
    {datas.map((data) => (
      <div key={data.title}>
          <h1>{data.title}</h1>
          <br/>
          <p>{data.description}</p>
          <br/>
          </div>
        ))}
    </main>)
  }

