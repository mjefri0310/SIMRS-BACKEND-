require("dotenv").config();
const express = require('express');
const cors = require("cors"); // supaya api server bisa di akses bedahost
const connectDB = require("./config/db"); // koneksi ke database
const response = require("./utils/response"); // memanggil helper
const authRoutes = require("./routes/authRoutes"); // memanggil routeauth
const app = express();
connectDB();
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
const PORT = process.env.PORT || 5000;
app.get('/', (req, res) => {
return response.success(res, {
message: "Api berjalan dengan baik",
});
});
app.listen(PORT, () => {
console.log(`Server berjalan di port ${PORT}`);
});
const patientRoutes = require("./routes/patientRoutes");
connectDB();
app.use(cors());
app.use(express.json());
app.use("/api/patients", patientRoutes);
const clinicRoutes = require("./routes/clinicRoutes");
const doctorRoutes = require("./routes/doctorRoutes");
const insuranceRoutes = require("./routes/insuranceRoutes");
const medicineRoutes = require("./routes/medicineRoutes");
const roomRoutes = require("./routes/roomRoutes");
const serviceTypeRoutes = require("./routes/serviceTypeRoutes");
const tariffRoutes = require("./routes/tariffRoutes");

app.use("/api/clinics", clinicRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/insurances", insuranceRoutes);
app.use("/api/medicines", medicineRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/service-types", serviceTypeRoutes);
app.use("/api/tariffs", tariffRoutes);

const registrationRoutes = require("./routes/registrationRoutes");// import routes yangdibuat sebelimnya



app.use("/api/registrations", registrationRoutes);


app.use("/api/registrations", registrationRoutes);

const rmeRoutes = require("./routes/rmeRoutes");

app.use("/api/rme", rmeRoutes);

const paymentRoutes = require("./routes/paymentRoutes");

app.use("/api/payments", paymentRoutes);