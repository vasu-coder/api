const express = require("express");
const app = express();
const morgan = require("morgan");
const bycrpt = require("bcryptjs");
const Register = require("./Register.js");
const port = process.env.PORT || 4000;
const formidableMiddleware = require("express-formidable");
const fs = require("fs");
const photoSchema = require("./photoModel.js");
const supervisorSchema = require("./supervisorModel.js");

const cors = require("cors");
const { isAsyncFunction } = require("util/types");
const Guideline = require("./Gudieline.js");
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
require("./conn.js");
app.use(morgan("dev"));

app.use(express.json());

app.post("/register", async (req, res) => {
  let register = await new Register(req.body);
  const d = await register.save(register);
  res.status(201).send({
    success: true,
    d,
  });
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
      res.status(200).send({
        success: true,
        obj,
      });
    } else {
      res.send("not match");
    }
  } catch (error) {
    res.status(500).send("invalid Email");
  }
});

// supervisor registration

app.post("/supervisor-register", async (req, res) => {
  let detail = await new supervisorSchema(req.body);
  const d = await detail.save(detail);
  res.status(201).send({
    success: true,
    d,
  });
});

app.post("/supervisor-login", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const usermail = await supervisorSchema.findOne({ email: email });

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
app.get("/fetch", async (req, res) => {
  const data = await Register.find({});
  res.send(data);
});

app.post("/photopost", formidableMiddleware(), async (req, res) => {
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

app.get("/single-product/:pid", async (req, res) => {
  const problem = await photoSchema.findById(req.params.pid).select("-photo");
  res.status(201).json({
    success: true,
    problem,
    message: "Problem Detail",
  });
});

//To get the Photo
app.get("/get-photo/:pid", async (req, res) => {
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

// get all supervisor
app.get("/get-Allsupervisor", async (req, res) => {
  try {
    const supervisor = await supervisorSchema.find({});
    res.status(201).json({
      supervisor,
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(404).send({
      success: false,
      error,
    });
  }
});

app.post("/problem-Assigned/:pid/:sid", async (req, res) => {
  try {
    const problem = await photoSchema.findById(req.params.pid).select("-photo");
    problem.status = "Asigned";
    problem.supervisorId = req.params.sid;
    await problem.save();
    res.status(201).json({
      success: true,
      problem,
    });
  } catch (error) {
    console.log(error);
    res.status(404).send({
      success: false,
      error,
    });
  }
});

app.get("/get-assigned-problems/:sid", async (req, res) => {
  try {
    const porblems = await photoSchema.find({ supervisorId: req.params.sid });
    res.status(201).send({
      porblems,
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(404).send({
      success: false,
      error,
    });
  }
});

app.post("/guideline",async(req,res)=>{
  try{ const guideline = await new Guideline(req.body)
    const data = await guideline.save(guideline)
    res.send(data)}
    catch (error) {
      res.status(500).send(error);
    }
    

}
);
app.get("/get-guideline",async(req,res)=>{
  try{
      const guide= req.body.guidelines
      const headl= req.body.headline
      const guideline = await Guideline.find({});
      res.send(guideline);
  }
  catch(error){
    res.send(error)
  }
})

app.get("/",(req, res) => {
  res.send("everything is working")
})
app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
