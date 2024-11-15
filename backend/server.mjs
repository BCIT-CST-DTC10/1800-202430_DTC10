import { env } from "process"
import 'dotenv/config'
import express from "express"
import axios from "axios"

const PORT = env.PORT ?? 3000;

const app = express();

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "https://gostudy.web.app");
    next();
});

app.get("/googleMapsCid", async (req, res) => {
    try {
        const url = (await axios.get(req.query.url)).request.res.responseUrl ?? "";
        res.json({
            url,
            cid: Array.from(/!1s0x.*?:(?<cid>0x.*?)!/gi[Symbol.matchAll](url), (v) => v.groups.cid).pop(),
        })
    } catch (error) {
        res.status(500).json({ error });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
