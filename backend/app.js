const express = require("express");
const path = require("path");

const bodyParser = require("body-parser");
const mongoose = require("mongoose");
// const autoIncrement = require('mongoose-auto-increment');
const registerRoutes = require("./routes/register");
const Register = require("./models/Register");
const userRoutes = require("./routes/user");
const employeeRoutes = require("./routes/employee");
const opkRoutes = require("./routes/opk");
// const groupRoutes = require("./routes/group");
// const eventTypeRoutes = require("./routes/eventType");
// const purposeRoutes = require("./routes/purpose");
// const categoryRoutes = require("./routes/category");
// const employeeTypeRoutes = require("./routes/employeeType");
// const employeeRoutes = require("./routes/employee");
// const customerTypeRoutes = require("./routes/customerType");
// const customerRoutes = require("./routes/customer");
// const vatRoutes = require("./routes/vat");
// const invoiceRoutes = require("./routes/invoice");
// const logBookRoutes = require("./routes/logBook");
// const insuranceRoutes = require("./routes/insurance");
// const eventRoutes = require("./routes/event");
// const equipmentTypeRoutes = require("./routes/equipmentType");
// const equipmentRoutes = require("./routes/equipment");
// const unitRoutes = require("./routes/unit");
// const productRoutes = require("./routes/product");
// const serviceRoutes = require("./routes/serviceOrder");
// const carRoutes = require("./routes/car");
// const opkRoutes = require("./routes/opk");
// const userRoutes = require("./routes/user");
// const reportRoutes = require("./routes/report");
const grantsRoutes = require("./routes/grants");
// const injPersonRoutes = require("./routes/injPerson");
// const injPersonGroupRoutes = require("./routes/injPersonGroup");
// const injInjectionTypeRoutes = require("./routes/injInjectionType");
// const globalRoutes = require("./routes/global");

mongoose.Promise = global.Promise;


const app = express();
// var connection=mongoose
//   .createConnection(
//     "mongodb://localhost:27017/register",
//     {
//       useUnifiedTopology: true,
//       useNewUrlParser: true,
//       // useFindAndModify: false
//     }
//   )
  // console.log('stan połaczenia (2-connecting, 1-connected) teraz:',connection.readyState)
  mongoose
  .connect(
    "mongodb://127.0.0.1:27017/aparatura",
    {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      // useFindAndModify: false
    }
  ).
  then(() => {
    console.log("Connected to database!");

  })
  .catch((error) => {
    console.log("Connection failed!",error);
  });



   app.use(bodyParser.text());
   app.use(bodyParser.json());

  app.use(bodyParser.urlencoded({ extended: false }));//accept strings, arrays   and any other type as values
  // app.use("/pdfjs", express.static(path.join("backend/pdfjs")));




  app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept , Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, PUT, POST, PATCH, DELETE, OPTIONS");
  next();
});

// Register.re .plugin(autoIncrement.plugin, { model: 'Register', field: 'number_of_deal' });
app.use("/api2/rejestr", registerRoutes);
app.use("/api2/uzytkownik", userRoutes);
app.use("/api2/uprawnienia", grantsRoutes);
app.use("/api2/pracownik", employeeRoutes);
app.use("/api2/opk", opkRoutes);

app.use((req, res, next) => {
  res.json([{id:1},{id:2}])
});

// app.use("/api/paliwo", petrolRoutes);
// app.use("/api/rodzaj_pojazdu", groupRoutes);
// app.use("/api/rodzaj_zdarzenia", eventTypeRoutes);
// app.use("/api/cel_wyjazdu", purposeRoutes);
// app.use("/api/kategoria", categoryRoutes);
// app.use("/api/pracownik", employeeRoutes);
// app.use("/api/typ_pracownika", employeeTypeRoutes);
// app.use("/api/kontrahent", customerRoutes);
// app.use("/api/typ_kontrahenta", customerTypeRoutes);
// app.use("/api/karta_drogowa", logBookRoutes);
// app.use("/api/vat", vatRoutes);
// app.use("/api/faktura", invoiceRoutes);
// app.use("/api/ubezpieczenie", insuranceRoutes);
// app.use("/api/zdarzenie", eventRoutes);
// app.use("/api/wyposazenie_typ", equipmentTypeRoutes);
// app.use("/api/wyposazenie", equipmentRoutes);
// app.use("/api/jednostka", unitRoutes);
// app.use("/api/produkt", productRoutes);
// app.use("/api/pojazd", carRoutes);
// app.use("/api/opk", opkRoutes);
// app.use("/api/uprawnienia", grantsRoutes);
// app.use("/api/uzytkownik", userRoutes);
// app.use("/api/serwis", serviceRoutes);
// app.use("/api/raport", reportRoutes);
// app.use("/api/ustawienia", globalRoutes);
// app.use("/api/szczepienie-osoba", injPersonRoutes);
// app.use("/api/szczepienie-osoba-grupa", injPersonGroupRoutes);
// app.use("/api/szczepienie-szczepionka-typ", injInjectionTypeRoutes);

module.exports = app;


