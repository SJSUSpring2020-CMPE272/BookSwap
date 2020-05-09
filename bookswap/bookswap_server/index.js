"use strict"
  const app = require("./app");
  //routes
  const login = require("./routes/login");
  const signup = require("./routes/signup");
  const profile = require("./routes/profile");
  const book = require("./routes/book");
  const messages = require("./routes/messages");
  const requests = require("./routes/request");

  app.use("/login", login);
  app.use("/signup", signup);
  app.use("/profile", profile);
  app.use("/book", book);
  app.use("/messages", messages);
  app.use("/requests", requests);
  
  
  app.listen(3001, () => {
    console.log(`Server listening on port 3001`);
  });
  
  module.exports = app;