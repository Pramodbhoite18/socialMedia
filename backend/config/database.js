const mongoose = require("mongoose");

exports.connectDatabase = () => {
  mongoose
    .connect(`mongodb+srv://pramodbhoite143:pramodbhoite143@cluster0.dpnuhbx.mongodb.net/SocialMedia?retryWrites=true&w=majority`)
    .then((con) => console.log(`Database connected: ${con.connection.host}`))
    .catch((err) => console.log(err));
};
