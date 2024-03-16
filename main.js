const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const app = express();
const port = 3000;
const routerWeb=require("./routers/router_web");
const router_api=require("./routers/router_api");
// const { CloudinaryStorage } = require('multer-storage-cloudinary');

mongoose.connect("mongodb://localhost:27017/AssMob402", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Kết nối tới MongoDB thành công.');
  })
  .catch((err) => {
    console.error('Lỗi khi kết nối tới MongoDB: ' + err);
  });
//Cho phép đọc dữ liệu truyền từ Api và form
app.use(bodyParser.json());
// const upload = multer({ storage: storage });
app.use(routerWeb);
app.use(router_api);
app.use('/upload', express.static('upload'));
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 
// const cloudinary = require("cloudinary").v2;

// // Cấu hình Cloudinary
// cloudinary.config({
//   cloud_name: "drvzjrz3i",
//   api_key: "843915886383526",
//   api_secret: "ko5ZcNXE493zoH6DGMXkkmWNwYY",
// });

// // Cấu hình multer và lưu trữ Cloudinary
// const storage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: {
//     folder: "your-folder-name", // Thay thế bằng tên thư mục bạn muốn lưu trữ hình ảnh
//     format: async (req, file) => "jpg", // Hoặc sử dụng định dạng tệp từ file.originalname
//   },
// });

// const upload = multer({
//   storage: multer.memoryStorage(), // Lưu trữ hình ảnh trong bộ nhớ tạm thời
// });

// const uploads = multer({ storage: storage });

// app.post(
//   '/products',
//   uploads.array('productImages', 2), // Giới hạn số lượng hình ảnh là 2
//   async (req, res) => {
//     const { productName, productDescription, productPrice ,productCode} = req.body;

//     try {
//       const productImages = req.files.map((file) => file.path);

//       // Tạo một đối tượng Product mới với mảng đường dẫn hình ảnh
//       const product = new Product({
//         maSP:productCode,
//        tenSP: productName,
//         moTa: productDescription,
//         giaSP:productPrice,
//         anhSP:productImages,
//       });

//       // Lưu đối tượng vào MongoDB
//       await product.save();
//       res.status(200).json({ message: "Thêm sản phẩm thành công" });

//       // res.redirect('/products');
//     } catch (error) {
//       console.error('Lỗi khi thêm sản phẩm:', error);
//       res.status(500).json({ error: 'Đã xảy ra lỗi khi thêm sản phẩm.' });
//     }
//   }
// );
app.get('/', (req, res) => {
  res.render(__dirname + '/view/test.ejs');
});

