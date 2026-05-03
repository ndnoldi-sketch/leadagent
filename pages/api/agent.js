export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end()

  const { message, accessToken } = req.body

  let adsDebug = ""

  if (accessToken) {
    try {
      const adsRes = await fetch(
        "https://googleads.googleapis.com/v19/customers:listAccessibleCustomers",
        {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${accessToken}`,
            "developer-token": process.env.GOOGLE_ADS_DEVELOPER_TOKEN,
          }
        }
      )
      const text = await adsRes.text()
      adsDebug = text.substring(0, 500)
    } catch (e) {
      adsDebug = "Error: " + e.message
    }
  } else {
    adsDebug = "Sin token de acceso"
  }

  res.status(200).json({ reply: "DEBUG: " + adsDebug })
}
