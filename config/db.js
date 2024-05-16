const mongoose = require("mongoose");

module.exports = async (server) => {
  try {
    mongoose.connect("mongodb+srv://inamdarmuskan55:jiAoE2hlf2CdlPye@cluster0.wh0jual.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
    console.log("mongo connection successful..".yellow.underline.bold);

    // Listening to server
    await server.listen(process.env.PORT || 5000, () =>
      console.log(
        `server running on development mode, port 5000.`
          .cyan.bold
      )
    );
  } catch (error) {
    console.log("mongo connection failed..".red);
    console.log(error);
    process.exit(1);
  }
};
