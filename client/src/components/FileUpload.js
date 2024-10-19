import { useState } from "react";
import axios from "axios";
import "./FileUpload.css";

const FileUpload = ({ contract, account }) => {
  const [file, setFile] = useState(null);
  const [filename, setFileName] = useState("Ningún archivo seleccionado.");

  // Handle the submission of the form
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (file) {
      try {
        const formData = new FormData();
        formData.append("file", file);

        const resFile = await axios({
          method: "post",
          url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
          data: formData,
          headers: {
            pinata_api_key: `4806e75da4b2309b57be`,
            pinata_secret_api_key: `f85e18c0281a04ef78b9e07ac0c1f24f7eb8daaf632c8a013b4ceaad0a15899d`,
            "Content-Type": "multipart/form-data",
          },
        });

        const ImgHash = `https://gateway.pinata.cloud/ipfs/${resFile.data.IpfsHash}`;
        console.log(ImgHash);

        // Añade el archivo a la blockchain
        await contract.add(account, ImgHash);

        alert("El archivo se ha subido al repositorio.");
        setFileName("No hay un archivo seleccionado.");
        setFile(null);
      } catch (error) {
        // Maneja el rechazo de la transacción por el usuario en MetaMask
        if (error.code === 4001) {
          alert("El usuario rechazó la transacción.");
        } else {
          console.error("Error during transaction:", error);
          alert("El usuario rechazó la transacción.");
        }
      }
    }
  };

  const retrieveFile = (event) => {
    const data = event.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(data);
    reader.onloadend = () => {
      setFile(event.target.files[0]);
    };
    console.log(event.target.files[0].name);
    setFileName(event.target.files[0].name);
    event.preventDefault();
  };

  return (
    <div className="top">
      <form className="form" onSubmit={handleSubmit}>
        <label htmlFor="file-upload" className="choose">
          Elegir Archivo
        </label>
        <input
          type="file"
          id="file-upload"
          name="data"
          onChange={retrieveFile}
          disabled={!account}
        />
        <span className="textArea">Archivo: {filename} </span>
        <button type="submit" className="upload" disabled={!file}>
          Subir Archivo
        </button>
      </form>
    </div>
  );
};

export default FileUpload;
