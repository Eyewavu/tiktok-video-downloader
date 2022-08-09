import express from "express"
import downloadVidFromTikTok from "./app.mjs"
import path from "path"

const PORT =8000
const app =express()
app.use(express.json())
app.use("/src",express.static(path.resolve("src")))

app.get("/",(_,res) => res.sendFile(path.resolve("index.html")))

app.post("/tiktok",async (req,res) => {
  const link =req.body.link
  console.log(link)

  downloadVidFromTikTok(link)
  .then(binary => res.status(200).end(Buffer.from(binary)))
  .catch(() => res.status(404).send("Not Found"))
  
})

app.listen(process.env.PORT || PORT)