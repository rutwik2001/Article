import contract from '../../ethereum/article';
import getData from '../../pinata/getData'
async function getArticles() {
  var numberOfTokens = await contract.methods.totalSupply().call() //https://portal.thirdweb.com/contracts/build/extensions/erc-721/ERC721Supply https://stackoverflow.com/questions/68810515/totalsupply-is-not-a-function-openzeppelin-contracts
  var data = []
  for(var i=0;i<numberOfTokens;i++){
    var tokenURI = await contract.methods.tokenURI(Number(i)).call();
    data.push({metadata: await getData(tokenURI), tokenId: i});
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
        <h1>{data.metadata.title}</h1>
        <br/>
        <p>{data.metadata.description.slice(0,100)}... <Link href={`/articles/${data.tokenId}`}>Read More</Link></p>
        <br/>
        </div>
      ))}
  </main>)
}

