import Upload from "./artifacts/contracts/Upload.sol/Upload.json";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import FileUpload from "./components/FileUpload";
import Display from "./components/Display";
import Modal from "./components/Modal";
import "./App.css";

function App() {
  // Mantenemos la lógica de conexión intacta
  const [account, setAccount] = useState('');
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const provider = window.ethereum
      ? new ethers.providers.Web3Provider(window.ethereum)
      : ethers.providers.getDefaultProvider();

    const wallet = async () => {
      if (provider) {
        await provider.send("eth_requestAccounts", []);
        window.ethereum.on("chainChanged", async () => {
          window.location.reload();
        });

        window.ethereum.on("accountsChanged", async () => {
          window.location.reload();
        });

        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);

        const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
        const contract = new ethers.Contract(
          contractAddress,
          Upload.abi,
          signer
        );
        setContract(contract);
        setProvider(signer);
      } else {
        alert("Metamask is not installed");
      }
    };

    provider && wallet();
  }, []);

  return (
    <>
      <header>
        <h1>Repositorio de Archivos PYME</h1>
        <p>Cuenta: {account}</p>
      </header>

      <main className="App">
        <section className="file-section">
          <FileUpload account={account} contract={contract} />
          <Display account={account} contract={contract} />
        </section>
      </main>
    </>
  );
}

export default App;
// <div class="bg"></div>
// <div class="bg bg2"></div>
// <div class="bg bg2"></div>
