require("dotenv").config();
const express = require("express");
const formidable = require("express-formidable");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(formidable());

// MAILGUN CONFIGURATION
const api_key = process.env.MAILGUN_API_KEY;
const domain = process.env.MAILGUN_DOMAIN;
const mailgun = require("mailgun-js")({ apiKey: api_key, domain: domain });

app.get("/", (req, res) => {
   res.send("Server is up");
});

app.post("/", (req, res) => {
   //Destructuring
   const { firstname, lastname, email, subject, message } = req.fields;
   // Creation de l'objet data
   const data = {
      from: `${firstname} ${lastname} <${email}>`,
      to: "hello@teddy-beau.com",
      subject: `[Tripadvisor] ${subject}`,
      text: `Contenu du message :\n${message}`,
   };
   // Envoi de l'objet data via mailgun
   mailgun.messages().send(data, (error, body) => {
      if (!error) {
         return res.json(body);
      }
      res.status(401).json(error);
   });
});

app.listen(process.env.PORT, () => {
   console.log("Server started");
});
