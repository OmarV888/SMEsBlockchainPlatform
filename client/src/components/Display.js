import { useState } from "react";
import axios from "axios"; 
import Modal from "./Modal";
import "./Display.css";

const Display = ({ contract, account }) => {
  const [data, setData] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [displayedUser, setDisplayedUser] = useState(account); // Inicia con la cuenta principal

  // Función para obtener los metadatos del archivo desde Pinata
  const getFileNameFromPinata = async (hash) => {
    const url = `https://api.pinata.cloud/data/pinList?hashContains=${hash}`;

    try {
      const response = await axios.get(url, {
        headers: {
          pinata_api_key: '4806e75da4b2309b57be',
          pinata_secret_api_key: 'f85e18c0281a04ef78b9e07ac0c1f24f7eb8daaf632c8a013b4ceaad0a15899d',
        },
      });

      if (response.data.rows.length > 0) {
        const fileName = response.data.rows[0].metadata.name || "Archivo";
        return fileName;
      }
    } catch (error) {
      console.error("Error al obtener el nombre del archivo:", error);
      return "Archivo";
    }
  };

  const getdata = async () => {
    let dataArray;
    const OtherAddress = document.querySelector(".address").value;

    try {
      if (OtherAddress) {
        dataArray = await contract.display(OtherAddress);
        setDisplayedUser(OtherAddress); // Muestra el nombre del usuario ingresado
        console.log(dataArray);
      } else {
        dataArray = await contract.display(account);
        setDisplayedUser(account); // Restablece el nombre de la cuenta principal
        console.log(dataArray);
      }
    } catch (error) {
      alert(error);
    }

    const isEmpty = Object.keys(dataArray).length === 0;

    if (!isEmpty) {
      const images = await Promise.all(
        dataArray.map(async (item, i) => {
          const fileHash = item.split("/")[4];
          const fileName = await getFileNameFromPinata(fileHash);

          return (
            <div key={`a-${i}`} className="file-entry">
              <a href={item} target="_blank" rel="noopener noreferrer">
                {fileName}
              </a>
              <button className="center button">Borrar</button>
            </div>
          );
        })
      );
      setData(images);
    } else {
      alert("No hay imágenes para mostrar");
    }
  };

  const handleMyFiles = () => {
    setDisplayedUser(account); // Restablece el nombre de la cuenta principal
    setData([]); // Limpia los archivos anteriores si se necesita.
    document.querySelector(".address").value = ""; // Limpia el campo de texto
    getdata(); // Obtiene los archivos de la cuenta principal
  };

  return (
    <>
      <div className="button-container">
        {!modalOpen && (
          <button className="share" onClick={() => setModalOpen(true)}>
            Compartir
          </button>
        )}
        {modalOpen && <Modal setModalOpen={setModalOpen} contract={contract} />}

        <button className="btn_Arch" onClick={handleMyFiles}>
          Mis Archivos
        </button>
      </div>

      <div id="image-item">
        <p className="tag_arch">Archivos de {displayedUser}</p> {/* Cambia a displayedUser */}
        <div className="image-list">{data}</div>
      </div>

      <div className="input-container">
        <input type="text" placeholder="Ingresar Usuario" className="address" />
        <button className="center button" onClick={getdata}>
          Obtener Archivos
        </button>
      </div>
    </>
  );
};

export default Display;
