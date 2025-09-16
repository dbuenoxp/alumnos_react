
import React, { useState, useEffect } from "react";
import PruebaButton from "./ui/PruebaButton";
import { gtagEvent } from "./utils/analytics";
// Modal para agregar/editar
function Modal({ isOpen, onClose, onSave, alumno }) {
  const [form, setForm] = useState({ nombre: "", apellido: "", fecha: "", curso: "" });

  useEffect(() => {
    if (alumno) setForm(alumno);
    else setForm({ nombre: "", apellido: "", fecha: "", curso: "" });
  }, [alumno]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          background: "linear-gradient(135deg, #0f172a, #1e40af)",
          padding: "2rem",
          borderRadius: "16px",
          width: 400,
          color: "#fff",
          boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
        }}
      >
        <h2 style={{ marginBottom: "1rem" }}>{alumno ? "Editar Alumno" : "Agregar Alumno"}</h2>
        <input
          placeholder="Nombre"
          value={form.nombre}
          onChange={(e) => setForm({ ...form, nombre: e.target.value })}
          style={{
            width: "100%",
            padding: 8,
            marginBottom: 8,
            borderRadius: 6,
            border: "none",
          }}
        />
        <input
          placeholder="Apellido"
          value={form.apellido}
          onChange={(e) => setForm({ ...form, apellido: e.target.value })}
          style={{
            width: "100%",
            padding: 8,
            marginBottom: 8,
            borderRadius: 6,
            border: "none",
          }}
        />
        <input
          type="date"
          value={form.fecha}
          onChange={(e) => setForm({ ...form, fecha: e.target.value })}
          style={{
            width: "100%",
            padding: 8,
            marginBottom: 8,
            borderRadius: 6,
            border: "none",
          }}
        />
        <input
          placeholder="Curso"
          value={form.curso}
          onChange={(e) => setForm({ ...form, curso: e.target.value })}
          style={{
            width: "100%",
            padding: 8,
            marginBottom: 16,
            borderRadius: 6,
            border: "none",
          }}
        />
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
          <button
            onClick={onClose}
            style={{
              padding: "8px 16px",
              borderRadius: 6,
              border: "none",
              background: "#1e293b",
              color: "#cbd5e1",
              cursor: "pointer",
            }}
          >
            Cancelar
          </button>
          <button
            onClick={() => {
              if (!form.nombre || !form.apellido || !form.fecha || !form.curso) return;
              onSave({ ...form, id: alumno?.id || Date.now() });
              onClose();
            }}
            style={{
              padding: "8px 16px",
              borderRadius: 6,
              border: "none",
              background: "linear-gradient(135deg, rgb(15, 23, 42), rgb(30, 64, 175), rgb(56, 189, 248))",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [alumnos, setAlumnos] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editAlumno, setEditAlumno] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("alumnos");
    if (saved) setAlumnos(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("alumnos", JSON.stringify(alumnos));
  }, [alumnos]);

  const handleSave = (alumno) => {
    setAlumnos((prev) => {
      const exists = prev.find((a) => a.id === alumno.id);
      if (exists) {
        gtagEvent("editar_alumno", { nombre: alumno.nombre, curso: alumno.curso });
        return prev.map((a) => (a.id === alumno.id ? alumno : a));
      }
      gtagEvent("agregar_alumno", { nombre: alumno.nombre, curso: alumno.curso });
      return [...prev, alumno];
    });

     try {
         fetch("http://localhost:5678/webhook/new-register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(alumno),
        });
        console.log("Alumno enviado a n8n:", alumno);
      } catch (error) {
        console.error("Error enviando a n8n:", error);
      }
  };

  // const handleDelete = (id) => setAlumnos(alumnos.filter((a) => a.id !== id));
  const handleDelete = (id) => {
    const alumno = alumnos.find((a) => a.id === id);
    gtagEvent("eliminar_alumno", { nombre: alumno?.nombre, curso: alumno?.curso });
    setAlumnos(alumnos.filter((a) => a.id !== id));
  };

  const filtered = alumnos.filter((a) =>
    a.nombre.toLowerCase().includes(filtro.toLowerCase())
  );

  const handleExport = () => {
     gtagEvent("exportar_lista", { total: alumnos.length });
    const csv = [
      ["Nombre", "Apellido", "Fecha de Nacimiento", "Curso"],
      ...alumnos.map((a) => [a.nombre, a.apellido, a.fecha, a.curso]),
    ]
      .map((row) => row.join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "alumnos.csv";
    link.click();
  };

  return (
    <div
      style={{
        padding: "2rem",
        fontFamily: "sans-serif",
        background: "linear-gradient(135deg, #0f172a, #1e40af)",
        minHeight: "100vh",
        color: "#fff",
        boxSizing: "border-box",
        maxWidth: "100vw",
      }}
    >
      {/* Card de filtros */}
      <div
        style={{
          background: "linear-gradient(135deg, #0f172a, #1e40af)",
          padding: "1.5rem 2rem",
          borderRadius: 16,
          marginBottom: "2rem",
          boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
          maxWidth: "600px",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
  <h2 style={{ marginBottom: "1rem", color: "#38bdf8", textAlign: "center" }}>Administración de Alumnos</h2>
  <div style={{ marginBottom: 12 }}>
    <label style={{ marginRight: 8 }}>Nombre:</label>
    <input
      value={filtro}
      onChange={(e) => setFiltro(e.target.value)}
      style={{ padding: 8, borderRadius: 6, border: "none", width: 200 }}
    />
  </div>
  {/* Botones alineados a la derecha */}
  <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
    <button
      onClick={() => setModalOpen(true)}
      style={{
        padding: "8px 16px",
        borderRadius: 6,
        border: "none",
        background: "linear-gradient(135deg, rgb(15, 23, 42), rgb(30, 64, 175), rgb(56, 189, 248))",
        color: "#fff",
        cursor: "pointer",
      }}
    >
      Agregar
    </button>
    <button
      onClick={handleExport}
      style={{
        padding: "8px 16px",
        borderRadius: 6,
        border: "none",
        background: "linear-gradient(135deg, rgb(15, 23, 42), rgb(30, 64, 175), rgb(56, 189, 248))",
        color: "#fff",
        cursor: "pointer",
      }}
    >
      Exportar
    </button>
  </div>
</div>

      {/* Card de lista */}
      <div
        style={{
          background: "linear-gradient(135deg, #0f172a, #1e40af)",
          padding: "1.5rem",
          borderRadius: 16,
          boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
          maxWidth: "900px",
          marginLeft: "auto",
          marginRight: "auto",
          overflowX: "auto",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            width: "100%",
            minWidth: 0,
          }}
        >
          <div
            style={{
              display: "none",
              marginBottom: "1rem",
            }}
            className="responsive-table-labels"
          ></div>
          {/* Responsive table: scroll on mobile, flex on desktop */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
              width: "100%",
            }}
          >
            {/* Header row */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                borderBottom: "1px solid #38bdf8",
                fontWeight: "bold",
                color: "#38bdf8",
                padding: "8px 0",
              }}
            >
              <div style={{ flex: 1, minWidth: 120, padding: 8 }}>Nombre</div>
              <div style={{ flex: 1, minWidth: 120, padding: 8 }}>Apellido</div>
              <div style={{ flex: 1, minWidth: 120, padding: 8 }}>Fecha Nac.</div>
              <div style={{ flex: 1, minWidth: 120, padding: 8 }}>Curso</div>
              <div style={{ minWidth: 120, padding: 8, textAlign: "center" }}>Acciones</div>
            </div>
            {/* Data rows */}
            {filtered.map((a) => (
              <div
                key={a.id}
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  borderBottom: "1px solid rgba(255,255,255,0.1)",
                  alignItems: "center",
                  padding: "8px 0",
                }}
              >
                <div style={{ flex: 1, minWidth: 120, padding: 8 }}>{a.nombre}</div>
                <div style={{ flex: 1, minWidth: 120, padding: 8 }}>{a.apellido}</div>
                <div style={{ flex: 1, minWidth: 120, padding: 8 }}>{a.fecha}</div>
                <div style={{ flex: 1, minWidth: 120, padding: 8 }}>{a.curso}</div>
                <div style={{ minWidth: 120, padding: 8, display: "flex", gap: 8, justifyContent: "center" }}>
                  <button
                    onClick={() => {
                      setEditAlumno(a);
                      setModalOpen(true);
                    }}
                    style={{
                      padding: "4px 8px",
                      borderRadius: 6,
                      border: "none",
                      background: "#38bdf8",
                      color: "#0f172a",
                      cursor: "pointer",
                      minWidth: 70,
                    }}
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(a.id)}
                    style={{
                      padding: "4px 8px",
                      borderRadius: 6,
                      border: "none",
                      background: "#ef4444",
                      color: "#fff",
                      cursor: "pointer",
                      minWidth: 70,
                    }}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div style={{ textAlign: "center", padding: 12, color: "#94a3b8" }}>
                No hay alumnos
              </div>
            )}
          </div>
        </div>
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditAlumno(null);
        }}
        onSave={handleSave}
        alumno={editAlumno}
      />
    </div>
  );
}
