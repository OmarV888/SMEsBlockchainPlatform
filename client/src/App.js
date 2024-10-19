import Upload from "./artifacts/contracts/Upload.sol/Upload.json";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import FileUpload from "./components/FileUpload";
import Display from "./components/Display";
import Modal from "./components/Modal";
import "./App.css";

function App() {
  const [account, setAccount] = useState('');
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        // Solicitar la apertura de la ventana de Metamask para seleccionar cuenta
        await provider.send("eth_requestAccounts", []);

        window.ethereum.on("chainChanged", () => {
          window.location.reload();
        });

        window.ethereum.on("accountsChanged", () => {
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
        alert("Metamask no se encuentra instalado. Para ingresar, instale Metamask");
      }
    } catch (error) {
      console.error("Error connecting to wallet:", error);
      alert("No se pudo conectar a metamask. Por favor, inténtalo nuevamente.");
    }
  };

  useEffect(() => {
    // Aquí podrías intentar automáticamente conectar si ya hay una cuenta disponible
    // Si quieres conectarte al inicio, puedes descomentar esta parte:
    // connectWallet();
  }, []);

  return (
    <>
      <header>
        {account ? (
          <>
            <button className="cierre" onClick={() => setAccount('')}>
              Cerrar sesión
            </button>
            <h1>Repositorio de Archivos PYME</h1>
            <p>Cuenta: {account}</p>
          </>
        ) : (
          <button className="sesion" onClick={connectWallet}>
            Iniciar Sesión con Metamask
          </button>
        )}
      </header>

      <main className="App">
        {account ? (
          <section className="file-section">
            <FileUpload account={account} contract={contract} />
            <Display account={account} contract={contract} />
          </section>
        ) : (
          <p>Por favor, inicia sesión con Metamask para acceder al repositorio de archivos.</p>
        )}
      </main>
    </>
  );
}

export default App;




/* import Upload from "./artifacts/contracts/Upload.sol/Upload.json";
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

        const contractAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3";
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
      <button className="sesion">Cerrar sesion</button>
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

export default App;*/