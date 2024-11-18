import { env } from "process";
import 'dotenv/config';
import express from "express";
import axios from "axios";
import admin from 'firebase-admin';

const PORT = env.PORT ?? 3000;

const firebaseApp = admin.initializeApp({
    credential: admin.credential.cert({
        project_id: env.GOOGLE_APPLICATION_PROJECT_ID,
        client_email: env.GOOGLE_APPLICATION_CLIENT_EMAIL,
        private_key: env.GOOGLE_APPLICATION_PRIVATE_KEY,
    }),
});
const expressApp = express();

expressApp.use((req, res, next) => {
    const origin = req.headers.origin ?? "";
    const corsWhitelist = [
        'https://gostudy.web.app',
    ];
    if (corsWhitelist.indexOf(origin) !== -1 || origin.startsWith('http://127.0.0.1')) {
        res.header('Access-Control-Allow-Origin', origin);
        next();
    } else {
        res.status(200).send();
        return;
    }
});

expressApp.get("/googleMapsCid", async (req, res) => {
    try {
        const url = (await axios.get(req.query.url)).request.res.responseUrl ?? "";

        const decode = Array.from(/!1s0x.*?:(?<cid>0x.*?)!/gi[Symbol.matchAll](url), (v) => v.groups.cid).pop();
        const query = (new URLSearchParams(url)).get("cid");
        res.json({
            url,
            cid: decode ? decode : query,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send();
    }
});

expressApp.get("/listUser", async (req, res) => {
    try {
        res.json(Object.fromEntries((await Promise.all([req.query.uid].flat().map((v) => firebaseApp.auth().getUser(v)))).
            map((v) => [v.uid, {
                email: v.email,
                emailVerified: v.emailVerified,
                displayName: v.displayName,
                disabled: v.disabled,
                lastSignInTime: v.metadata.lastSignInTime,
                creationTime: v.metadata.creationTime,
                lastRefreshTime: v.metadata.lastRefreshTime,
                tokensValidAfterTime: v.tokensValidAfterTime,
            }])));
    } catch (error) {
        console.error(error);
        res.status(500).send();
    }
});

expressApp.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
