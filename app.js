const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");

const errorController = require("./controllers/error");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

const Connection = require("./utils/database");
const User = require("./models/user");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

//Middlewares
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "/public")));

app.use(async (request, response, next) => {
  try {
    const user = await User.findById("63a452fcf5da659b5701a5da");
    if (!user) {
      return;
    }
    request.user = new User(user.username, user.email, user.cart, user._id);
    next();
  } catch (error) {
    console.log(error);
  }
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(errorController.get404page);

async function main() {
  try {
    await Connection.mongoConnection(async () => {
      app.listen(3000, () =>
        console.log("server Running at http//:localhost:3000")
      );
    });
  } catch (error) {
    console.log(error);
  }
}

main();
