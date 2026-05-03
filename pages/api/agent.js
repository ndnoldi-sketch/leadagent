export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end()

  const { message, accessToken } = req.body

  const systemPrompt = `Eres un agente experto en Google Ads especializado en conseguir leads.
Tienes acceso a la cuenta de Google Ads del usuario mediante su token de acceso.
Tu objetivo es ayudar a crear, optimizar y gestionar campañas para maximizar leads al menor coste posible.
Cuando el usuario pida crear o modificar campañas, explica exactamente qué harías y pide confirmación antes de ejecutar.
Responde siempre en español, de forma clara y directa.`

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-5",
      max_tokens: 1000,
      system: systemPrompt,
      messages: [
        { role: "user", content: message }
      ]
    })
  })

  const data = await response.json()
  const reply = data.content?.[0]?.text || "Error al conectar con el agente."

  res.status(200).json({ reply })
}
