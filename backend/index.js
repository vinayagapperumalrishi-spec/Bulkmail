const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");

const app = express();

app.use(cors());
app.use(express.json());

const MONGO_URI = "mongodb+srv://rishi:12345@cluster0.u5j4gv2.mongodb.net/passkey?retryWrites=true&w=majority&appName=Cluster0";

// Safe model getter to prevent OverwriteModelError in Serverless
const getCredentialModel = () => {
  if (mongoose.models.credential) {
    return mongoose.models.credential;
  }
  return mongoose.model("credential", new mongoose.Schema({}, { strict: false }), "bulkmail");
};

app.get("/", (req, res) => {
  res.send("Bulk Mail Backend Server is running successfully! 🚀");
});

app.post("/sendmail", async (req, res) => {
  const { msg, emailList } = req.body;

  try {
    // Ensure connection is active
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(MONGO_URI);
    }

    const Credential = getCredentialModel();
    const data = await Credential.find();

    if (data.length === 0) {
      return res.send(false);
    }

    console.log("MongoDB data:", data);

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "vinayagapperumalrishi@gmail.com",
        pass: "tqes kswi qbpk qngj",
      },
      connectionTimeout: 30000,
      greetingTimeout: 30000,
      socketTimeout: 30000,
    });

    await transporter.verify();
    console.log("SMTP Connected");

    const emailPromises = emailList.map((email) => {
      return transporter.sendMail({
        from: data[0].toJSON().user,
        to: email,
        subject: "A message from Bulk Mail App",
        text: msg,
      });
    });

    await Promise.all(emailPromises);
    console.log("All emails sent successfully!");

    res.send(true);

  } catch (error) {
    console.log("Error details:", error);
    res.status(500).send(error.message); 
  }
});

const PORT = process.env.PORT || 3000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server Started on ${PORT}`);
  });
}

module.exports = app;