export default async function handler(req, res) {
  const body = req.body || {};
  const r = await fetch("https://libretranslate.de/translate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  const data = await r.json();
  res.status(200).json(data);
}
