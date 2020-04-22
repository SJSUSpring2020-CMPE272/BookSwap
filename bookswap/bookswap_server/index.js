"use strict"
  const app = require("./app");
  //routes
  const login = require("./routes/login");
  const signup = require("./routes/signup");
  const profile = require("./routes/profile");
  const book = require("./routes/book");

  app.use("/login", login);
  app.use("/signup", signup);
  app.use("/profile", profile);
  app.use("/book", book);
  
  
  app.listen(3001, () => {
    console.log(`Server listening on port 3001`);
  });
  
  module.exports = app;