import { signIn, useSession } from "next-auth/react"
import { useRouter } from "next/router"
import { useEffect } from "react"

export default function Home() {
  const { data: session } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (session) router.push("/dashboard")
  }, [session])

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      background: "#f9f9f7",
      fontFamily: "sans-serif"
    }}>
      <div style={{
        background: "white",
        border: "0.5px solid #e0e0e0",
        borderRadius: 16,
        padding: "48px 40px",
        textAlign: "center",
        maxWidth: 400,
        width: "90%"
      }}>
        <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#1D9E75", margin: "0 auto 24px" }} />
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>LeadAgent</h1>
        <p style={{ color: "#888", fontSize: 14, marginBottom: 32 }}>
          Agente IA que gestiona tus campañas de Google Ads para conseguir más leads
        </p>
        <button
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          style={{
            width: "100%",
            padding: "12px 24px",
            background: "#1D9E75",
            color: "white",
            border: "none",
            borderRadius: 10,
            fontSize: 15,
            fontWeight: 600,
            cursor: "pointer"
          }}
        >
          Entrar con Google
        </button>
      </div>
    </div>
  )
}
