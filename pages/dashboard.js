import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [messages, setMessages] = useState([
    { role: "agent", text: "Hola. Estoy conectado a tu cuenta de Google Ads. ¿Qué quieres hacer hoy?" }
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (status === "unauthenticated") router.push("/")
  }, [status])

  async function sendMessage() {
    if (!input.trim()) return
    const userMsg = { role: "user", text: input }
    setMessages(prev => [...prev, userMsg])
    setInput("")
    setLoading(true)

    const res = await fetch("/api/agent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: input,
        accessToken: session?.accessToken
      })
    })
    const data = await res.json()
    setMessages(prev => [...prev, { role: "agent", text: data.reply }])
    setLoading(false)
  }

  if (status === "loading") return <p style={{ padding: 40 }}>Cargando...</p>

  return (
    <div style={{ minHeight: "100vh", background: "#f9f9f7", fontFamily: "sans-serif" }}>
      <div style={{
        background: "white",
        borderBottom: "0.5px solid #e0e0e0",
        padding: "0 24px",
        height: 52,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#1D9E75" }} />
          <span style={{ fontWeight: 700, fontSize: 16 }}>LeadAgent</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 13, color: "#888" }}>{session?.user?.email}</span>
          <button
            onClick={() => signOut()}
            style={{ fontSize: 12, color: "#888", background: "none", border: "0.5px solid #e0e0e0", borderRadius: 8, padding: "4px 12px", cursor: "pointer" }}
          >
            Salir
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 720, margin: "40px auto", padding: "0 20px" }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Agente IA</h1>
        <p style={{ fontSize: 13, color: "#888", marginBottom: 24 }}>Habla con tu agente para gestionar campañas de Google Ads</p>

        <div style={{
          background: "white",
          border: "0.5px solid #e0e0e0",
          borderRadius: 16,
          overflow: "hidden"
        }}>
          <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 12, minHeight: 320, maxHeight: 400, overflowY: "auto" }}>
            {messages.map((msg, i) =
