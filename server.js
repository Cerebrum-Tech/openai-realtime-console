import express from "express";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import "dotenv/config";

const app = express();
const port = process.env.PORT || 3000;
const apiKey = process.env.OPENAI_API_KEY;


app.use(express.json());


const vite = await createViteServer({
  server: { middlewareMode: true },
  appType: "custom",
});
app.use(vite.middlewares);



const CALLBACKS_FILE_PATH = './call_back.json';


app.post('/api/save-callback', (req, res) => {
  const newCallback = req.body;
  if (!newCallback.customerId || !newCallback.dateTime) {
    return res.status(400).json({ error: 'Eksik bilgi gönderildi.' });
  }

  const logEntry = {
    kayitTarihi: new Date().toISOString(),
    aranacakMusteri: newCallback.customerId,
    aranacakZaman: newCallback.dateTime
  };

  
  fs.readFile(CALLBACKS_FILE_PATH, 'utf8', (err, data) => {
    let callbacks = [];
   
    if (!err && data) {
      try {
        callbacks = JSON.parse(data);
      } catch (e) {
       
        console.error("Mevcut callback dosyası bozuk, sıfırlanıyor.");
      }
    }

   
    callbacks.push(logEntry);

   
    fs.writeFile(CALLBACKS_FILE_PATH, JSON.stringify(callbacks, null, 2), (writeErr) => {
      if (writeErr) {
        console.error('Sunucuda geri arama dosyasına yazılırken hata:', writeErr);
        return res.status(500).json({ error: 'Dosyaya yazma işlemi başarısız.' });
      }
      console.log('Geri arama talebi sunucuda başarıyla kaydedildi:', logEntry);
      res.status(200).json({ success: true, message: 'Geri arama başarıyla kaydedildi.' });
    });
  });
});

app.post('/api/update-callbacks', (req, res) => {
  const updatedCallbacks = req.body;
  if (!Array.isArray(updatedCallbacks)) {
    return res.status(400).json({ error: 'Geçersiz veri formatı. Bir dizi bekleniyordu.' });
  }
  fs.writeFile(CALLBACKS_FILE_PATH, JSON.stringify(updatedCallbacks, null, 2), (writeErr) => {
    if (writeErr) {
      return res.status(500).json({ error: 'Dosyaya yazma işlemi başarısız.' });
    }
    res.status(200).json({ success: true, message: 'Liste başarıyla güncellendi.' });
  });
});

app.get('/api/get-callbacks', (req, res) => {
  fs.readFile(CALLBACKS_FILE_PATH, 'utf8', (err, data) => {
   
    if (err || !data) {
      return res.json([]);
    }
    try {
     
      const callbacks = JSON.parse(data);
      res.status(200).json(callbacks);
    } catch (parseError) {
      console.error('JSON parse hatası:', parseError);
      res.status(500).json({ error: 'Dosya içeriği bozuk.' });
    }
  });
});



app.get("/token", async (req, res) => {
  try {
    const response = await fetch(
      "https://api.openai.com/v1/realtime/sessions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-realtime-preview-2025-06-03",
          voice: "verse",
        }),
      },
    );

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Token generation error:", error);
    res.status(500).json({ error: "Failed to generate token" });
  }
});


app.use("*", async (req, res, next) => {
  const url = req.originalUrl;

  try {
    const template = await vite.transformIndexHtml(
      url,
      fs.readFileSync("./client/index.html", "utf-8"),
    );
    const { render } = await vite.ssrLoadModule("./client/entry-server.jsx");
    const appHtml = await render(url);
    const html = template.replace(`<!--ssr-outlet-->`, appHtml?.html);
    res.status(200).set({ "Content-Type": "text/html" }).end(html);
  } catch (e) {
    vite.ssrFixStacktrace(e);
    next(e);
  }
});

app.listen(port, () => {
  console.log(`Express server running on *:${port}`);
});