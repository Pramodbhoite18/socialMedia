const app = require("./app");
const { connectDatabase } = require("./config/database");
const cloudinary = require("cloudinary");

connectDatabase();

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

cloudinary.config({
  cloud_name: "dpbtri3o8",
  api_key: 417984179231935,
  api_secret: "oUpD3QYyE6MGj1hqbwyw7cN27-Q",
});

app.listen(4000, () => {
  console.log(`Server is Running on port 4000`);
});
