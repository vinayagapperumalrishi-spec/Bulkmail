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
  port: 587,
  secure: false,
  auth: {
    user: data.user,
    pass: data.pass,
  },
});

    await transporter.verify();
    console.log("SMTP Connected");

    for (let i = 0; i < emailList.length; i++) {

      await transporter.sendMail({
        from: data[0].toJSON().user,
        to: emailList[i],
        subject: "A message from Bulk Mail App",
        text: msg,
      });

      console.log("Email sent to:", emailList[i]);
    }

    res.send(true);

  } catch (error) {

    console.log(error);
    res.send(false);

  }

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server Started on ${PORT}`);
});