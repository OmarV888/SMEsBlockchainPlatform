import { useEffect } from "react";
import "./Modal.css";

const Modal = ({ setModalOpen, contract }) => {
  // Función para compartir acceso
  const sharing = async () => {
    const address = document.querySelector(".address").value;
    try {
      await contract.allow(address);
      alert("Acceso compartido exitosamente.");
      setModalOpen(false);
    } catch (error) {
      // Manejar error si el usuario rechaza la transacción
      if (error.code === 4001) {
        alert("Transacción rechazada por el usuario.");
      } else {
        console.error("Error al compartir acceso:", error);
        alert("Debe ingresar el usuario de la persona con quien compartir acceso.");
      }
    }
  };

  // Función para revocar acceso
  const revoking = async () => {
    const address = document.querySelector(".address").value;
    try {
      await contract.disallow(address);
      alert("Acceso revocado exitosamente.");
      setModalOpen(false);
    } catch (error) {
      // Manejar error si el usuario rechaza la transacción
      if (error.code === 4001) {
        alert("Transacción rechazada por el usuario.");
      } else {
        console.error("Error al revocar acceso:", error);
        alert("Debe ingresar el usuario de la persona a quien revocar acceso.");
      }
    }
  };

  useEffect(() => {
    const accessList = async () => {
      const addressList = await contract.shareAccess();
      let select = document.querySelector("#selectNumber");
      const options = addressList;

      for (let i = 0; i < options.length; i++) {
        let opt = options[i];
        let e1 = document.createElement("option");
        e1.textContent = opt;
        e1.value = opt;
        select.appendChild(e1);
      }
    };
    contract && accessList();
  }, [contract]);

  return (
    <>
      <div className="modalBackground">
        <div className="modalContainer">
          <div className="title">Compartir con</div>
          <div className="body">
            <input
              type="text"
              className="address"
              placeholder="Enter Address"
            ></input>
          </div>
          <form id="myForm">
            <select id="selectNumber">
              <option className="address">Personas con Acceso</option>
            </select>
          </form>
          <div className="footer">
            <button
              onClick={() => {
                setModalOpen(false);
              }}
              id="cancelBtn"
            >
              Cancelar
            </button>
            <button onClick={() => sharing()}>Compartir</button>
            <button onClick={() => revoking()}>Revocar</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
