const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =========================
// API ROUTES
// =========================

const authRoutes = require("./src/routes/auth");
const patientRoutes = require("./src/routes/patients");
const doctorRoutes = require("./src/routes/doctors");
const appointmentRoutes = require("./src/routes/appointments");
const medicalRecordRoutes = require("./src/routes/medical-records");

app.use("/api/auth", authRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/medical-records", medicalRecordRoutes);

// API fallback
app.use("/api", (req, res) => {
    res.status(404).json({
        success: false,
        message: "API endpoint not found"
    });
});

// =========================
// SERVE FRONTEND
// =========================

const publicPath = path.join(__dirname, "public");
app.use(express.static(publicPath));

// Homepage
app.get("/", (req, res) => {
    res.sendFile(path.join(publicPath, "index.html"));
});

// =========================
// START SERVER
// =========================

app.listen(PORT, () => {
    console.log("\n=======================================");
    console.log(`🚀 AarogyaCare Server running on port ${PORT}`);
    console.log("👉 Environment: Demo / In-Memory Mode");
    console.log(`🌐 Local: http://localhost:${PORT}`);
    console.log("=======================================\n");
});