import https from "https";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });

  let body = "";
  req.on("data", chunk => (body += chunk));
  req.on("end", () => {
    try {
      const parsed = JSON.parse(body);
      const data = JSON.stringify(parsed);

      const options = {
        hostname: "translate.argosopentech.com",
        path: "/translate",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": data.length
        }
      };

      const request = https.request(options, response => {
        let translated = "";
        response.on("data", chunk => (translated += chunk));
        response.on("end", () => {
          res.status(200).json(JSON.parse(translated));
        });
      });

      request.on("error", error => {
        res.status(500).json({ error: "Translation failed", details: error.message });
      });

      request.write(data);
      request.end();
    } catch (err) {
      res.status(500).json({ error: "Invalid JSON", details: err.message });
    }
  });
}
