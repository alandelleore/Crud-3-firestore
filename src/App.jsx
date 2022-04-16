import React, { useEffect, useState } from "react";
import { firebase } from "./firebase";

function App() {
  const [tareas, setTareas] = useState([]);
  const [tarea, setTarea] = useState("");
  const [modoEdicion, setModoEdicion] = useState(false);
  const [id, setId] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const db = firebase.firestore();
        const data = await db.collection("tareas").get();

        const arrayData = data.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log(arrayData);

        setTareas(arrayData);
      } catch (error) {
        console.log(error);
      }
    };
    obtenerDatos();
  }, []);

  const agregar = async (e) => {
    e.preventDefault();

    if (!tarea.trim()) {
      setError("Ingrese una tarea");
      return;
    }
    try {
      const db = firebase.firestore();
      const nuevaTarea = {
        name: tarea,
        fecha: Date.now(),
      };

      const data = await db.collection("tareas").add(nuevaTarea);

      setTareas([...tareas, { ...nuevaTarea, id: data.id }]);
      setError(null);
      setTarea("");
    } catch (error) {
      console.log(error);
    }
    console.log(tarea);
  };

  const eliminar = async (id) => {
    try {
      const db = firebase.firestore();
      await db.collection("tareas").doc(id).delete();

      const arrayFiltrado = tareas.filter((item) => item.id !== id);
      setTareas(arrayFiltrado);
    } catch (error) {
      console.log(error);
    }
  };

  const activarEdicion = (item) => {
    setModoEdicion(true);
    setTarea(item.name);
    setId(item.id);
  };

  const editar = async (e) => {
    e.preventDefault();
    if (!tarea.trim()) {
      setError("Ingresa una tarea");
      return;
    }
    try {
      const db = firebase.firestore();
      await db.collection("tareas").doc(id).update({
        name: tarea,
      });

      const arrayEditado = tareas.map((item) =>
        item.id === id ? { id: item.id, fecha: item.fecha, name: tarea } : item
      );
      setTareas(arrayEditado);
      setModoEdicion(false);
      setError(null);
      setTarea("");
      setId("");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="bg-dark">
        <h2 className="text-center text-muted p-4">NOTAS 3.0</h2>
      </div>
      <div className="container mt-4">
        <hr />
        <div className="row">
          <div className="col-md-6">
            <h4>Lista de tareas</h4>

            <ul className="list-group">
              {tareas.length === 0 ? (
                <li className="list-group-item">No hay tareas</li>
              ) : (
                tareas.map((item) => (
                  <li className="list-group-item" key={item.id}>
                    {item.name}
                    <button
                      className="btn btn-danger btn-sm float-end mx-2"
                      onClick={() => eliminar(item.id)}
                    >
                      Eliminar
                    </button>
                    <button
                      className="btn btn-warning btn-sm float-end"
                      onClick={() => activarEdicion(item)}
                    >
                      Editar
                    </button>
                  </li>
                ))
              )}
            </ul>
          </div>
          <div className="col-md-6">
            <h4>{modoEdicion ? "Editar Tarea" : "Agregar Tarea"}</h4>
            <form onSubmit={modoEdicion ? editar : agregar}>
              {error ? <span className="text-danger">{error}</span> : null}
              <input
                type="text"
                placeholder="Ingrese tarea"
                className="form-control mb-2 mt-1"
                onChange={(e) => setTarea(e.target.value)}
                value={tarea}
              />
              <button
                className={
                  modoEdicion
                    ? "btn btn-warning btn col-md-12"
                    : "btn btn-dark btn col-md-12"
                }
                type="submit"
              >
                {modoEdicion ? "Editar" : "Agregar"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
