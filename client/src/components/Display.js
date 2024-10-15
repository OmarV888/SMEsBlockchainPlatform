import { useState } from "react";
import axios from "axios"; // Asegúrate de importar axios
import "./Display.css";

const Display = ({ contract, account }) => {
  const [data, setData] = useState("");

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
        // Verificamos si hay metadatos disponibles y devolvemos el nombre del archivo
        const fileName = response.data.rows[0].metadata.name || "Archivo"; // Usamos "Archivo" como fallback
        return fileName;
      }
    } catch (error) {
      console.error("Error al obtener el nombre del archivo:", error);
      return "Archivo"; // Si falla, retorna un valor por defecto
    }
  };

  const getdata = async () => {
    let dataArray;
    const OtherAddress = document.querySelector(".address").value;

    try {
      if (OtherAddress) {
        dataArray = await contract.display(OtherAddress);
        console.log(dataArray);
      } else {
        dataArray = await contract.display(account);
        console.log(dataArray);
      }
    } catch (error) {
      alert(error);
    }

    const isEmpty = Object.keys(dataArray).length === 0;

    if (!isEmpty) {
      // En cada lista hay un enlace, en cada iteración extraemos y mostramos el nombre del archivo
      const images = await Promise.all(
        dataArray.map(async (item, i) => {
          const fileHash = item.split("/")[4]; // Obtener el hash del enlace de Pinata
          const fileName = await getFileNameFromPinata(fileHash); // Llama a la función para obtener el nombre del archivo

          return (
            <div key={`a-${i}`} className="file-entry">
              <a href={item} target="_blank" rel="noopener noreferrer">
                {fileName} {/* Mostrar el nombre real del archivo */}
              </a>
              <button className="center button" >Borrar</button>
            </div>
          );
        })
      );
      setData(images);
    } else {
      alert("No images to display");
    }
  };

  return (
    <>
      <div id="image-item">
      <div className="image-list" >{data}</div>
      </div>
      <input type="text" placeholder="Enter Address" className="address" />

      <button className="center button" onClick={getdata}>
        Get Data
      </button>
    </>
  );
};

export default Display;