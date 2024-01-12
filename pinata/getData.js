export default async function getData(tokenURI){
    const response = await fetch(`https://ipfs.io/ipfs/${tokenURI}`);
    const data = await response.json();
    return data;
}