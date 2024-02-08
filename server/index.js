import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

import multer from "multer";
import { promisify } from "util";
import { writeFile } from "fs/promises";

import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

mongoose.connect(
  //exp-proj-db in mongodb -> browser collection
  // process.env.MONGO_URL,
  // "mongodb+srv://exp:exp123@clusterexp.xw5sehz.mongodb.net/session-exp?retryWrites=true&w=majority",
  "mongodb+srv://exp:explore@explorecluster.yweprwi.mongodb.net/expdb?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => {
    console.log("\nDB connected");
  }
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    username: {
      unique: true,
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    dob: {
      type: String,
      required: true,
    },
    email: {
      unique: true,
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const User = new mongoose.model("User", userSchema);

//Routes
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user_exists = await User.findOne({ email: email });
    if (user_exists) {
      if (password === user_exists.password) {
        const token = jwt.sign({ id: user_exists._id }, "jwt_secret_key", {
          expiresIn: "60m",
        });

        return res.send({
          message: "Login Successfull",
          status: "ok",
          token: token,
          user: user_exists,
        });
      } else {
        return res.send({ message: "Password didn't match" });
      }
    } else {
      return res.send({ message: "User not registered" });
    }
  } catch (error) {
    return res.send({
      message: "Something went wrong, Try again later",
      error: error,
    });
  }
});

app.post("/register", async (req, res) => {
  const { name, username, gender, dob, email, password } = req.body;
  try {
    const user = await User.findOne({ email: email });
    if (user) {
      return res.send({ message: "User is already registerd." });
    } else {
      const new_user = new User({
        name,
        role: "user",
        username,
        gender,
        dob,
        email,
        password,
      });
      new_user.save();
      return res.send({
        message: "Successfully Registered, Please login now.",
        status: "ok",
      });
    }
  } catch (error) {
    return res.send({ message: "Something went wrong, ty again later." });
  }
});

app.post("/forgortpassword", async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email: email });

  if (!user) {
    return res.status(404).json({ Status: "User not existed!" });
  }
  const token = jwt.sign({ id: user._id }, "jwt_secret_key", {
    expiresIn: "5m",
  });
  const url = `http://localhost:5173/reset_password/${user._id}/${token}`;
  const emailHtml = `<h2>Click to reset password : ${url}</h2>`;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: true,
    auth: {
      user: "it24img@gmail.com",
      pass: "fvfh msrl wuru ulkq",
    },
  });

  const options = {
    from: "it24img@gmail.com",
    to: email,
    subject: "Explore - Reset Password",
    html: emailHtml,
  };

  const emailSender = await transporter.sendMail(options);

  res.send({
    message: "Check your email",
    status: "ok",
    user: user,
    data: emailSender,
  });
});

app.post("/reset-password/:id/:token", async (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;

  jwt.verify(token, "jwt_secret_key", async (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Invalid token" });
    }
    try {
      const user_exists = await User.findOne({ _id: id });
      if (!user_exists) {
        return res.send({ message: "Invalid token or ID" });
      }
      user_exists.password = password;

      await user_exists.save();
      res.send({ message: "Password Reset done", status: "ok" });
    } catch (error) {
      return res.send({ error: error });
    }
  });
});

//audiobook
const bookSchema = new mongoose.Schema(
  {
    bkname: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    authname: {
      type: String,
      required: true,
    },
    bkimage: {
      type: String,
      required: true,
    },
    bkgenre: {
      type: String,
      required: true,
    },
    desp: {
      type: String,
      required: true,
    },
    bkcon: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Book = new mongoose.model("Book", bookSchema);

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post(
  "/addbook",
  upload.fields([
    { name: "bkImg", maxCount: 1 },
    { name: "bkCon", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { bkname, role, authname, bkgenre, desp } = req.body;

      const bkImg = req.files["bkImg"] ? req.files["bkImg"][0] : null;
      const bkCon = req.files["bkCon"] ? req.files["bkCon"][0] : null;

      const bookInfo = await Book.findOne({ bkname: bkname });

      if (bookInfo) {
        return res.send({ message: "book already there!" });
      }

      let bkImgPath = "";
      let bkConPath = "";

      if (bkImg) {
        const bufferBkImg = bkImg.buffer;
        const bkImgPathPublic = `../client/public/users/bookCover/${
          bkname + "_" + bkImg.originalname
        }`;
        await writeFile(bkImgPathPublic, bufferBkImg);

        bkImgPath = `/users/bookCover/${bkname + "_" + bkImg.originalname}`;
      } else {
        bkImgPath = "/assets/logoExplore.png";
      }

      if (bkCon) {
        const bufferBkCon = bkCon.buffer;
        const bkConPathPublic = `../client/public/users/bookCon/${
          bkname + "_" + bkCon.originalname
        }`;
        await writeFile(bkConPathPublic, bufferBkCon);

        bkConPath = `/users/bookCon/${bkname + "_" + bkCon.originalname}`;
      } else {
        bkConPath = "noBookContent";
      }

      const book = new Book({
        bkname,
        role,
        authname,
        bkimage: bkImgPath,
        bkgenre,
        desp,
        bkcon: bkConPath,
      });

      book.save();
      return res.send({ message: "Book add Successfully!" });
    } catch (error) {
      console.log(error);
      res.status(500).send({ error: "Internal Server Error" });
    }
  }
);

app.post(
  "/edit-book",
  upload.fields([
    { name: "bkImg", maxCount: 1 },
    { name: "bkCon", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { bkname, authname, bkgenre, desp } = req.body;

      const bkImg = req.files["bkImg"] ? req.files["bkImg"][0] : null;
      const bkCon = req.files["bkCon"] ? req.files["bkCon"][0] : null;

      const bookInfo = await Book.findOne({ bkname: bkname });

      if (!bookInfo) {
        return res.send({ message: "book doesn't exists!" });
      }

      if (authname) bookInfo.authname = authname;
      if (bkgenre) bookInfo.bkgenre = bkgenre;
      if (desp) bookInfo.desp = desp;

      let bkImgPath = "";
      let bkConPath = "";

      if (bkImg) {
        const bufferBkImg = bkImg.buffer;
        const bkImgPathPublic = `../client/public/users/bookCover/${
          bkname + "_" + bkImg.originalname
        }`;
        await writeFile(bkImgPathPublic, bufferBkImg);

        bkImgPath = `/users/bookCover/${bkname + "_" + bkImg.originalname}`;
        bookInfo.bkimage = bkImgPath;
      }

      if (bkCon) {
        const bufferBkCon = bkCon.buffer;
        const bkConPathPublic = `../client/public/users/bookCon/${
          bkname + "_" + bkCon.originalname
        }`;
        await writeFile(bkConPathPublic, bufferBkCon);

        bkConPath = `/users/bookCon/${bkname + "_" + bkCon.originalname}`;
        bookInfo.bkcon = bkConPath;
      }

      await bookInfo.save();
      // const book = new Book({
      //   bkname,
      //   authname,
      //   bkimage: bkImgPath,
      //   bkgenre,
      //   desp,
      //   bkcon: bkConPath,
      // });
      return res.send({ message: "Book edited Successfully!", status: "ok" });
    } catch (error) {
      console.log(error);
      res.status(500).send({ error: "Internal Server Error" });
    }
  }
);

const delBookSchema = new mongoose.Schema(
  {
    bkname: {
      type: String,
      required: true,
    },
    authname: {
      type: String,
      required: true,
    },
    bkimage: {
      type: String,
      required: true,
    },
    bkgenre: {
      type: String,
      required: true,
    },
    desp: {
      type: String,
      required: true,
    },
    bkcon: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const DelBook = new mongoose.model("DelBook", delBookSchema);

app.post("/delbook", async (req, res) => {
  try {
    const { bkname } = req.body;
    // console.log(bkname);
    const bookExist = await Book.findOne({ bkname: bkname });

    if (!bookExist) {
      return res.send({ message: "book doesn't exists!" });
    }

    const delbook = new DelBook({
      bkname: bookExist.bkname,
      authname: bookExist.authname,
      bkimage: bookExist.bkimage,
      bkgenre: bookExist.bkgenre,
      desp: bookExist.desp,
      bkcon: bookExist.bkcon,
    });

    await delbook.save();

    await Book.deleteOne({ bkname });

    return res.send({ message: "book deleted successfully !", status: "del" });
  } catch (error) {
    console.log(error);
  }
});

//audiobook
const audiobookSchema = new mongoose.Schema(
  {
    audioBkName: {
      type: String,
      required: true,
    },
    audioAuthName: {
      type: String,
      required: true,
    },
    audioBkImage: {
      type: String,
      required: true,
    },
    audioBkGenre: {
      type: String,
      required: true,
    },
    audioDesp: {
      type: String,
      required: true,
    },
    audioBkCon: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Audiobook = new mongoose.model("Audiobook", audiobookSchema);

app.post(
  "/addaudiobook",
  upload.fields([
    { name: "audioBkImage", maxCount: 1 },
    { name: "audioBkCon", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { audioBkName, audioAuthName, audioBkGenre, audioDesp } = req.body;

      const audioBkImage = req.files["audioBkImage"]
        ? req.files["audioBkImage"][0]
        : null;
      const audioBkCon = req.files["audioBkCon"]
        ? req.files["audioBkCon"][0]
        : null;

      const audiobookInfo = await Audiobook.findOne({
        audioBkName: audioBkName,
      });

      if (audiobookInfo) {
        return res.send({ message: "book already there!" });
      }

      let audioBkImagePath = "";
      let audioBkConPath = "";

      if (audioBkImage) {
        const bufferaudioBkImage = audioBkImage.buffer;
        const audioBkImagePathPublic = `../client/public/users/audioBookCover/${
          audioBkName + "_" + audioBkImage.originalname
        }`; //why is ` used??
        await writeFile(audioBkImagePathPublic, bufferaudioBkImage);

        audioBkImagePath = `/users/audioBookCover/${
          audioBkName + "_" + audioBkImage.originalname
        }`;
      } else {
        audioBkImagePath = "/assets/logoExplore.png";
      }

      if (audioBkCon) {
        const bufferaudioBkCon = audioBkCon.buffer;
        const audioBkConPathPublic = `../client/public/users/audioBookCon/${
          audioBkName + "_" + audioBkCon.originalname
        }`;
        await writeFile(audioBkConPathPublic, bufferaudioBkCon);

        audioBkConPath = `/users/audioBookCon/${
          audioBkName + "_" + audioBkCon.originalname
        }`;
      } else {
        audioBkConPath = "noBookContent";
      }

      const audiobook = new Audiobook({
        audioBkName: audioBkName,
        audioAuthName,
        audioBkImage: audioBkImagePath,
        audioBkGenre,
        audioDesp,
        audioBkCon: audioBkConPath,
      });

      audiobook.save();
      return res.send({ message: "Book add Successfully!" });
    } catch (error) {
      console.log(error);
      res.status(500).send({ error: "Internal Server Error" });
    }
  }
);

app.post("/get-dbcollections", async (req, res) => {
  const { books } = await req.body;
  console.log(books);
  try {
    // if (books == "books") {
    const bookInfo = await Book.find({});

    if (!bookInfo) {
      return res.send({ message: "No book in DB!" });
    }
    // console.log(bookInfo);
    return res.send({ message: "Data found", data: bookInfo });
    // }
  } catch (error) {
    console.log(error);
  }
});

app.post("/get-audiobk", async (req, res) => {
  const { audiobooks } = await req.body;
  console.log(audiobooks);
  try {
    // if (books == "books") {
    const audiobookInfo = await Audiobook.find({}); //Book is from where is it from database (user)

    if (!audiobookInfo) {
      return res.send({ message: "No book in DB!" });
    }
    // console.log(bookInfo);
    return res.send({ message: "Data found", data: audiobookInfo }); // data used from and where
    // }
  } catch (error) {
    console.log(error);
  }
});

app.listen(3001, () => {
  console.log("\nBE started at port 3001");
});

// const uploadImg = new mongoose.Schema(

//   {
//     email: {
//       unique: true,
//       type: String,
//       required: true,
//     },
//     imgPath: {
//       type: String,
//       required: true,
//     },
//   },
//   { timestamps: true }
// );
// const UploadImg = new mongoose.model("UploadImg", uploadImg);

// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });

// app.post("/upload", upload.single("profileImg"), async (req, res) => {
//   // const data = await req.formData();

//   try {
//     const email = req.body.email;
//     const profileImg = req.file;

//     let profileImgPath = "";

//     const user = await UploadImg.findOne({ email: email });
//     if (user) {
//       return res.send({ message: "Use another email", user: user });
//     }

//     if (profileImg) {
//       const bufferProfile = profileImg.buffer;
//       const profileImgPathPublic = `../client/public/users/profiles/${
//         email + "_" + profileImg.originalname
//       }`;
//       await writeFile(profileImgPathPublic, bufferProfile);
//       profileImgPath = `/users/profiles/${
//         email + "_" + profileImg.originalname
//       }`;
//     } else {
//       profileImgPath = "noProfile";
//     }

//     const uploadImgData = new UploadImg({
//       email,
//       imgPath: profileImgPath,
//     });
//     await uploadImgData.save();

//     res.send({ message: "Uploaded img successfully" });
//   } catch (error) {
//     console.log(error);
//   }
// });
