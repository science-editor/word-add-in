// server.js
const express = require("express");
const path = require("path");

const app = express();
const port = process.env.PORT || 7000;

// Serve everything in dist/ as static files
app.use(express.static(path.join(__dirname, "dist")));

// If someone hits /taskpane (no .html), send them taskpane.html
app.get("/taskpane", (req, res) => {
    res.sendFile(path.join(__dirname, "dist", "taskpane.html"));
});

app.listen(port, () => {
    console.log(`Static server up on http://localhost:${port}`);
});
