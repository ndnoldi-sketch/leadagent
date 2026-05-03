export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end()

  const { message, accessToken } = req.body

  let adsDebug = ""

  if (accessToken) {
    try {
      const adsRes = await fetch(
        "https://googleads.googleapis.com/v17/customers/2741577595/googleAds:search",
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${accessToken}`,
            "developer-token": process.env.GOOGLE_ADS_DEVELOPER_TOKEN,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            query: `SELECT campaign.id, campaign.name, campaign.status FROM campaign LIMIT 5`
          })
        }
      )
      const adsData = await adsRes.json()
      adsDebug = JSON.stringify(adsData)
    } catch (e) {
      adsDebug = "Error: " + e.message
    }
  } else {
    adsDebug = "Sin token de acceso"
  }

  res.status(200).json({ reply: "DEBUG: " + adsDebug })
}
