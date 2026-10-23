const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");

const app = express();

// FIX 1: Allow all origins and explicitly handle preflight OPTIONS requests
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

const MONGO_URI =
  "mongodb+srv://rishi:12345@cluster0.u5j4gv2.mongodb.net/passkey?retryWrites=true&w=majority&appName=Cluster0";

// Safe model getter to prevent OverwriteModelError in Vercel Serverless
const getCredentialModel = () => {
  if (mongoose.models.credential) {
    return mongoose.models.credential;
  }
  return mongoose.model(
    "credential",
    new mongoose.Schema({}, { strict: false }),
    "bulkmail"
  );
};

app.get("/", (req, res) => {
  res.send("Bulk Mail Backend Server is running successfully! 🚀");
});

app.post("/sendmail", async (req, res) => {
  const { msg, emailList } = req.body;

  try {
    // FIX 2: Check & connect Mongoose dynamically for serverless execution
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(MONGO_URI, {
        serverSelectionTimeoutMS: 5000,
      });
    }

    const Credential = getCredentialModel();
    const data = await Credential.find();

    if (!data || data.length === 0) {
      return res.status(400).send("No credentials found in database.");
    }

    console.log("MongoDB data fetched:", data);

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "vinayagapperumalrishi@gmail.com",
        pass: "tqes kswi qbpk qngj",
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 10000,
    });

    await transporter.verify();
    console.log("SMTP Connected");

    const emailPromises = emailList.map((email) => {
      return transporter.sendMail({
        from: data[0].toJSON().user || "vinayagapperumalrishi@gmail.com",
        to: email,
        subject: "A message from Bulk Mail App",
        text: msg,
      });
    });

    await Promise.all(emailPromises);
    console.log("All emails sent successfully!");

    return res.status(200).send("SUCCESS");
  } catch (error) {
    console.log("Error details:", error);
    return res.status(500).send(error.message || "Internal Server Error");
  }
});

const PORT = process.env.PORT || 3000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server Started on ${PORT}`);
  });
}

module.exports = app;