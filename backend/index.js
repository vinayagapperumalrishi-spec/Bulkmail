const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(
  "mongodb+srv://rishi:12345@cluster0.u5j4gv2.mongodb.net/passkey?retryWrites=true&w=majority&appName=Cluster0"
)
.then(() => {
  console.log("Connected to DB");
})
.catch((err) => {
  console.log("Failed to Connect");
  console.log(err.message);
});

const Credential = mongoose.model("credential", {}, "bulkmail");
const data = await Credential.find();
if (data.length === 0) { return res.send(false); }
app.get("/", (req, res) => {
  res.send("Bulk Mail Backend Server is running successfully! 🚀");
});

app.post("/sendmail", async (req, res) => {

  const { msg, emailList } = req.body;

  try {

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

    console.log(error);
    res.send(false);

  }

});

const PORT = process.env.PORT || 3000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server Started on ${PORT}`);
  });
}

module.exports = app;