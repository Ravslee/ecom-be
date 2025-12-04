require("dotenv").config({ path: process.env.ENV_FILE || ".env" });
const express = require("express");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");

const app = express();
app.use(express.json());

connectDB();

// routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/products", require("./routes/products"));
app.use("/api/cart", require("./routes/cart"));
app.use("/api/orders", require("./routes/orders"));
app.use("/api/admin", require("./routes/admin"));

// health
app.get("/health", (req, res) => res.json({ ok: true }));

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
