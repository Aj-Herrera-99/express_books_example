const express = require("express");
// create a server instance
const app = express();

// set costant to port
const port = process?.env.PORT || 3000;

// Other imports
const errorsHandler = require("./middlewares/errorsHandles");
const notFound = require("./middlewares/notFound");
const corsPolicy = require("./middlewares/corsPolicy");
const booksRouter = require("./routers/booksRouter");
const usersRouter = require("./routers/usersRouter");

// global middlewares
app.use(express.json());
app.use(express.static("public"));
app.use(corsPolicy);

// homepage
app.get("/", (req, res) => {
  res.send("Home Page");
});

// routers
app.use("/users", usersRouter);
app.use("/books", booksRouter);

// fallback
app.use(errorsHandler);
app.use(notFound);

//server must listen on your host and your port
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});


