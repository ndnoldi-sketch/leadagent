export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end()

  const { message, accessToken } = req.body

  let adsContext = ""

  if (accessToken) {
    try {
      const adsRes = await fetch(
        "https://googleads.googleapis.com/v23/customers/2741577595/googleAds:search",
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${accessToken}`,
            "developer-token": process.env.GOOGLE_ADS_DEVELOPER_TOKEN,
            "login-customer-id": "5163947991",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            query: `SELECT campaign.id, campaign.name, campaign.status, metrics.impressions, metrics.clicks, metrics.cost_micros, metrics.conversions FROM campaign WHERE segments.date DURING LAST_30_DAYS ORDER BY metrics.cost_micros DESC LIMIT 10`
          })
        }
      )
      const adsData = await adsRes.json()
      if (adsData.results && adsData.results.length > 0) {
        adsContext = "Datos reales de Google Ads (últimos 30 días):\n" + adsData.results.map(r => {
          const cost = (r.metrics?.costMicros || 0) / 1000000
          return `- ${r.campaign.name}: estado=${r.campaign.status}, impresiones=${r.metrics?.impressions || 0}, clicks=${r.metrics?.clicks || 0}, coste=€${cost.toFixed(2)}, conversiones=${r.metrics?.conversions || 0}`
        }).join("\n")
      } else {
        adsContext = "Respuesta de Google Ads: " + JSON.stringify(adsData).substring(0, 300)
      }
    } catch (e) {
      adsContext = "Error: " + e.message
    }
  }

  const systemPrompt = `Eres un agente experto en Google Ads especializado en conseguir leads.
Tu objetivo es ayudar a crear, optimizar y gestionar campañas para maximizar leads al menor coste posible.
Cuando el usuario pida crear o modificar campañas, explica exactamente qué harías y pide confirmación.
Responde siempre en español, de forma clara y directa.
${adsContext ? `\nInformación actual de la cuenta:\n${adsContext}` : ""}`

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
      messages: [{ role: "user", content: message }]
    })
  })

  const data = await response.json()
  const reply = data.content?.[0]?.text || "Error al conectar con el agente."

  res.status(200).json({ reply })
}
