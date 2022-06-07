/* eslint-disable linebreak-style */
/* eslint-disable no-console */
/* eslint-disable linebreak-style */
/* eslint-disable prefer-destructuring */
/* eslint-disable linebreak-style */
/* eslint-disable max-len */
/* eslint-disable linebreak-style */
/* eslint-disable import/order */
/* eslint-disable linebreak-style */
/* eslint-disable quotes */
/* eslint-disable linebreak-style */
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const http = require("http");
const webSockets = require("./Config/websockets");
const path = require("path");
const bodyParser = require("body-parser");
const multer = require('multer');

const DBConnection = require("./Config/config").connection;

const cookieParser = require("cookie-parser");

// Import Routes
const userRoutes = require("./Routes/userRoutes");
const messageRoutes = require("./Routes/messageRoutes");
const statusRoutes = require("./Routes/userStatusRoutes"); // user status controller
const announcementRoutes = require("./Routes/announcementRoute");

const documentRoutes = require("./Routes/learn-and-support-routes/helpDocumentRoutes");
const panicButtonRoutes = require("./Routes/panicButtonRoutes");
// External Health service companies routes
const externalHealthCompany = require("./Routes/externalCompanyRoutes");

DBConnection(); // DB connection
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Configure server socket.io
const server = http.createServer(app);
const io = webSockets.setup(server);
/*
    End of Server socket.io
*/

// Middlewares
app.use(express.json()); // it is in the middle of the request and the response

// The below allows to display data in web browser with ejs
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views/"));

app.use(express.static(path.join(__dirname, "public/"))); // Setting the public folder as the folder for my files
// Below middlewares are used to store token in cookies for user authentication and authorization

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// SET FILE UPLOADS MIDDLEWARE
const storage =multer.diskStorage({
  destination: (req, file, cb) =>
  {
    cb(null, 'public/files');
  },
  filename: (req, file, cb)=>{
    // console.log(file);
    let name= path.basename(file.originalname).toString();
    name = name.toLocaleLowerCase();
    const d= new Date();
    const da = d.getFullYear()+"_"+d.getMonth()+"_"+d.getDate()+"_"+d.getHours()+"_"+d.getMinutes()+"_"+parseInt((d.getSeconds()/5));
    cb(null,  da +"_"+ name + path.extname(file.originalname))
  }
});
const upload =  multer({storage: storage});

// UPLOAD A FILE
app.post('/upload-file', upload.single('document'), (req,res) =>
{
  res.redirect('/view-add-document');
});

app.get("/login", (req, res) => res.render("login", { isAuth: true }));

app.get("/", (req, res) => res.render("landing", { isAuth: true }));

app.get("/home", (req, res) => res.render("home", {}));

app.get("/chat-publicly", (req, res) => res.render("publicChat", {}));

app.get("/view-directory", (req, res) => res.render("userDirectory", {}));

app.get("/privateChat", (req, res) => res.render("privateChat", {}));

app.get("/welcome", (req, res) => res.render("welcome", {}));

app.get("/share-status", (req, res) => res.render("shareStatus", {}));

app.get("/postAnnouncement", (req, res) => res.render("postAnnouncement", {}));

app.get("/userProfiles", (req, res) =>  res.render("user-Profiles", {}));

app.get("/chat-private/:username/:id", (req, res) => {
  const id = req.params.id;
  const username = req.params.username;
  res.render("privateChat", { id, username });
});

// app.get("/users/update/:id", (req, res) => {
//   const id = req.params.id;
//   res.render("updateProfileForm", { id });
// });

// app.get("/update-user-profile/:username/:id/:password/:status/:privilege", (req, res) => {
//   const id = req.params.id;
//   res.render("updateProfileForm", { id });
// });

app.get("/logout", (req, res) => res.render("login", { isAuth: true }));

app.get("/postAnnouncement", (req, res) => res.render("postAnnouncement", {}));

// Iteration-4 (read-and-support)
app.get("/view-add-document", (req,res)=> res.render("addDocument", {}));
// app.get("/view-add-document/one", (req,res)=> res.render("readOneDocument", {}));
app.get("/read-and-support", (req,res)=> res.render("viewAllDocuments", {}));
app.get("/unapproved-documents", (req,res)=> res.render("viewAllRequests", {}));

app.get("/volunteer-settings", (req, res) => res.render("volunteerSettings", {}));
// Health service company feature
app.get("/registerCompany", (req, res) =>
  res.render("register", { isAuth: true })
);
app.get("/loginCompany", (req, res) =>
  res.render("companyLogin", { isAuth: true })
);

app.get("/companyProfile", (req, res) =>
  res.render("healthCompanyProfile", { isAuth: true, isHealth: true })
);
app.get("/companyList", (req, res) => res.render("healthServiceApprove", {}));

app.get("/approvedCompany", (req, res) => res.render("healthCompanyList", {}));
// End of Health service company feature companyLogin

app.use("/users", userRoutes);
app.use("/messages", messageRoutes);
app.use("/status", statusRoutes);
app.use("/announcements", announcementRoutes);
app.use("/panic-button", panicButtonRoutes);
app.use("/documents", documentRoutes);

// Health service company
app.use("/company", externalHealthCompany);

server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

module.exports = io;
