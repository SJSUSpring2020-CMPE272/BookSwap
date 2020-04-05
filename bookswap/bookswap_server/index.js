"use strict"
  const app = require("./app");
  //routes
  const login = require("./routes/login");
  const signup = require("./routes/signup");

  app.use("/login", login);
  app.use("/signup", signup);
  
  
  app.listen(3001, () => {
    console.log(`Server listening on port 3001`);
  });
  
  module.exports = app;