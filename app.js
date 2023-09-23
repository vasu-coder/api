const express = require("express");
const app = express();
const morgan = require("morgan");
const bycrpt = require("bcryptjs");
const Register = require("./Register.js");
const port = process.env.PORT || 4000;
const formidableMiddleware = require("express-formidable");
const fs = require("fs");
const photoSchema = require("./photoModel.js");

require("./conn.js");
app.use(morgan("dev"));
``;

app.use(express.json());

app.post("/register", async (req, res) => {
  let register = await new Register(req.body);
  const d = await register.save(register);
  res.send(d);
});

app.post("/login", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const usermail = await Register.findOne({ email: email });

    const ismatch = await bycrpt.compare(password, usermail.password);

    console.log(ismatch);

    if (ismatch) {
      const obj = { name: usermail.name, email: usermail.email };
      res.status(200).send(JSON.stringify(obj));
    } else {
      res.send("not match");
    }
  } catch (error) {
    res.status(500).send("invalid Email");
  }
});
//check api temp
app.get("/", (req, res) => {
  res.send("everthing is work");
});

app.post("/create-request", formidableMiddleware(), async (req, res) => {
  try {
    const { name, location } = req.fields;
    const { photo } = req.files;

    if (!name || !location) {
      return res.status(404).send({
        success: false,
        message: "Fill all the fields",
      });
    }

    const product = new photoSchema({ ...req.fields });
    product.photo.data = fs.readFileSync(photo.path);
    product.photo.contentType = photo.type;

    await product.save();
    return res.status(201).json({
      success: true,
      message: "Request Accepted",
    });
  } catch (error) {
    console.log(error);
    res.status(404).send({
      success: false,
      error,
    });
  }
});

// website Api
app.get("/Unsolved-problems", async (req, res) => {
  try {
    const problems = await photoSchema
      .find({ status: "UnSolved" })
      .select("-photo");
    return res.status(201).json({
      problems,
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(404).send({
      success: false,
      message: "Problem in getting Porblems",
    });
  }
});
app.get("/solved-problems", async (req, res) => {
  try {
    const problems = await photoSchema
      .find({ status: "Solved" })
      .select("-photo");
    return res.status(201).json({
      problems,
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(404).send({
      success: false,
      message: "Problem in getting Porblems",
    });
  }
});
app.get("/Ignored-problems", async (req, res) => {
  try {
    const problems = await photoSchema
      .find({ status: "IgSolved" })
      .select("-photo");
    return res.status(201).json({
      problems,
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(404).send({
      success: false,
      message: "Problem in getting Porblems",
    });
  }
});
app.get("/All-problems", async (req, res) => {
  try {
    const problems = await photoSchema.find({}).select("-photo");
    return res.status(201).json({
      problems,
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(404).send({
      success: false,
      message: "Problem in getting Porblems",
    });
  }
});

app.get("/single-product", async (req, res) => {
  const problem = await photoSchema.findById(req.params.pid).select("-photo");
  res.status(201).json({
    success: true,
    problem,
    message: "Problem Detail",
  });
});

//To get the Photo
app.get("/get-photo", async (req, res) => {
  try {
    const product = await photoSchema.findById(req.params.pid).select("photo");
    if (product.photo.data) {
      res.set("Content-type", product.photo.contentType);
      return res.status(201).send(product.photo.data);
    }
  } catch (error) {
    console.log(error);
    res.status(404).send({
      success: false,
      error,
    });
  }
});

app.listen(4000, () => {
  console.log(`Server is running on ${port}`);
});
