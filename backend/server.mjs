import { env } from "process"
import 'dotenv/config'
import express from "express"
import axios from "axios"

const PORT = env.PORT ?? 3000;

const app = express();

app.use((req, res, next) => {
    const origin = req.headers.origin ?? ""
    const corsWhitelist = [
        'https://gostudy.web.app',
    ];
    if (corsWhitelist.indexOf(origin) !== -1 || origin.startsWith('http://127.0.0.1')) {
        res.header('Access-Control-Allow-Origin', origin);
    }
    next();
});

app.get("/googleMapsCid", async (req, res) => {
    try {
        const url = (await axios.get(req.query.url)).request.res.responseUrl ?? "";

        const decode = Array.from(/!1s0x.*?:(?<cid>0x.*?)!/gi[Symbol.matchAll](url), (v) => v.groups.cid).pop();
        const query = (new URLSearchParams(url)).get("cid");
        res.json({
            url,
            cid: decode ? decode : query,
        })
    } catch (error) {
        res.status(500).json({ error });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
