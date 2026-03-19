const express = require("express");
const AuthVerify = require("auth-verify");

const app = express();

const auth = new AuthVerify({ storeToken: "memory" });

const github = auth.oauth.github({
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    redirectUri: "http://localhost:3000/auth/github/callback"
});

app.get("/auth/github", (req, res) => {
    github.redirect(res);
});

app.get("/auth/github/callback", async (req, res) => {
    try {
        const userData = await github.callback(req);
        console.log("GitHub User:", userData);
        res.json({ success: true, user: userData });
    } catch (err) {
        console.error("GitHub OAuth error", err);
        res.status(500).json({ error: "OAuth failed" });
    }
});

app.listen(3000, () =>
    console.log("Serverlistening on http://localhost:3000")
);