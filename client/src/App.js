import Upload from "./artifacts/contracts/Upload.sol/Upload.json";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import FileUpload from "./components/FileUpload";
import Display from "./components/Display";
import Modal from "./components/Modal";
import "./App.css";

function App() {
  const [account, setAccount] = useState(''); //estoy es solo para settear el account
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(()=>{
    const provider = ((window.ethereum != null)?new ethers.providers.Web3Provider(window.ethereum):ethers.providers.getDefaultProvider());
    const wallet =async ()=>{

      if(provider){
        await provider.send("eth_requestAccounts",[]); //"eth_requestAccounts",[]

        window.ethereum.on("chainChanged",async ()=>{   // esto hace que se cambie de eth net
          window.location.reload();
        });


        window.ethereum.on("accountsChanged",async ()=>{   // esto solo hace que la cuenta de metamask se cambie en automatico
          window.location.reload();
        });

        const signer = provider.getSigner();
        const address = await signer.getAddress();
        console.log(address);
        setAccount(address);

        const contractAddress="0x5FbDB2315678afecb367f032d93F642f64180aa3";
        const contract = new ethers.Contract(
          contractAddress,
          Upload.abi,
          signer
        );
        console.log(contract);
        setContract(contract);
        setProvider(signer);
      }else{
        alert("Metamask is not installed");
      }
    }
    provider && wallet()
  },[])
      
    return (
      <>
      {!modalOpen &&(
        <button className="share" onClick={()=>setModalOpen(true)}>Share</button>
      )}{
        modalOpen &&(
          <Modal setModalOpen={setModalOpen} contract = {contract}></Modal>
        )
      }
      <div className="App">
        <h1 style={{ color: "black" }}>Repositorio de Archivos PYME</h1>
        <div ></div>
        <div ></div>
        <div ></div>
        <p style={{ color: "white" }}>
          Account : {account}
        </p>
        <FileUpload account={account} contract={contract}></FileUpload>
        <Display account={account} contract={contract}></Display>
      </div>
      </>
    );
}
export default App;

// <div class="bg"></div>
// <div class="bg bg2"></div>
// <div class="bg bg2"></div>
