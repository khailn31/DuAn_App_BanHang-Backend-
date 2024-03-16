const express = require("express");
const router_api = express.Router();
const controller = require("../controller/controller_api");
const multer = require('multer');
const Product = require("../models/ProductModel");
const User=require("../models/UserModel");
const Bill=require('../models/BillModel');

const storage = multer.diskStorage({
    destination: function (req, file, res) {
        res(null, './upload');
    },
    filename: function (req, file, res) {
        res(null, file.originalname);
    }
});
const multi_upload = multer({
    storage,
    limits: { fileSize: 1 * 1024 * 1024 }, // Giới hạn dung lượng tệp là 1MB
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
            cb(null, true);
        } else {
            cb(null, false);
            const err = new Error('Chỉ chấp nhận định dạng .png, .jpg và .jpeg!');
            err.name = 'ExtensionError';
            return cb(err);
        }
    },
}).array('productImages', 2);
router_api.get('/getUser', async (req, res) => {
    try {
      const { email } = req.query;
  
      // Find the user by email
      const user = await User.findOne({ email });
  
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ message: 'User not found.' });
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      res.status(500).json({ message: 'Internal server error.' });
    }
  });
  router_api.post('/bill', async (req, res) => {
    try {
      
      const { email, tenSP, soLuong,ngay, tongTien} = req.body;
  
      // Tìm sản phẩm theo productId
   
      
      // Tạo đơn hàng mới
      const newOrder = new Bill({
        email: email,
        tenSP: tenSP, 
        soLuong: soLuong,
        ngay: ngay,
        tongTien: tongTien,
      });
  
      // Lưu đơn hàng vào database
      await newOrder.save();
  
      // Cập nhật số lượng sản phẩm
      // product.soLuong -= quantity;
      // await product.save();
  
      // // Cập nhật số dư của người dùng
      // const user = await User.findOne({ email: email });
      // if (!user) {
      //   return res.status(404).json({ error: 'Người dùng không tồn tại' });
      // }
      // user.balance -= totalAmount;
      // await user.save();
  
      // Trả về thông báo thành công
      res.json({ success: true, message: 'Đặt hàng thành công',  });
    } catch (error) {
      console.error('Lỗi xử lý đặt hàng:', error);
      res.status(500).json({ error: 'Đã có lỗi xảy ra' });
    }
  });
router_api.post("/register/user", controller.regUserController);
router_api.post("/login/user", controller.login);
router_api.put('/login/user', async (req, res) => {
    try {
      const { email, money } = req.body;
  
      // Find the user by email
      const user = await User.findOne({ email });
  
      if (user) {
        // Update the money field
        user.money = money;
        
        // Save the updated user
        await user.save();
  
        res.status(200).json({ message: 'Money updated successfully.' });
      } else {
        res.status(404).json({ message: 'User not found.' });
      }
    } catch (error) {
      console.error('Error updating money:', error);
      res.status(500).json({ message: 'Internal server error.' });
    }
  });
router_api.post('/products', multi_upload, async (req, res) => {
    try {
        const { productCount, productName, productPrice, productDescription } = req.body;
        const productImages = req.files.map(file => `./upload/${file.filename}`);

        const newProduct = new Product({
            soLuong: productCount,
            tenSP: productName,
            giaSP: productPrice,
            anhSP: productImages,
            moTa: productDescription,
        });

        const result = await newProduct.save();
        res.status(200).json({ message: 'Thêm sản phẩm thành công' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi thêm sản phẩm', error: error.message });
    }
});
router_api.get('/bill', controller.fetchBill);
router_api.get('/bills/:email', controller.fetchBillByEmail);
router_api.get('/products', controller.fetchData);
router_api.put('/products/:id', multi_upload, async (req, res) => {
    try {
        const productId = req.params.id;
        console.log(req.files);
        // Kiểm tra nếu sản phẩm với ID đã cho tồn tại
        const existingProduct = await Product.findById(productId);

        if (!existingProduct) {
            return res.status(404).json({ status: 404, message: 'Sản phẩm không tồn tại' });
        }

        // Cập nhật thông tin sản phẩm dựa trên dữ liệu từ yêu cầu
        const updateFields = {
            soLuong: req.body.soLuong || existingProduct.soLuong,
            tenSP: req.body.tenSP || existingProduct.tenSP,
            giaSP: req.body.giaSP || existingProduct.giaSP,
            moTa: req.body.moTa || existingProduct.moTacd
        };

        // Kiểm tra xem có hình ảnh mới được tải lên hay không
        if (req.files && req.files.length > 0) {
            // Xóa hình ảnh cũ trước khi cập nhật đường dẫn mới
            // Thêm đường dẫn mới của hình ảnh vào mảng
            updateFields.anhSP = req.files.map(file => `./upload/${file.filename}`);
        }

        // Sử dụng findOneAndUpdate để cập nhật sản phẩm
        const updatedProduct = await Product.findOneAndUpdate(
            { _id: productId },
            { $set: updateFields },
            { new: true } // Trả về sản phẩm đã được cập nhật
        );

        res.status(200).json({ status: 200, message: 'Cập nhật sản phẩm thành công', updatedProduct });
    } catch (error) {
        console.error("Error: " + error);
        res.status(500).json({ status: 500, message: 'Lỗi khi cập nhật sản phẩm', error });
    }
});
router_api.patch('/products/:productId', async (req, res) => {
  try {
    const productId = req.params.productId;
    const { soLuong } = req.body;

    const product = await Product.findById(productId);

    // Kiểm tra xem sản phẩm có tồn tại không
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Cập nhật số lượng sản phẩm
    product.soLuong = soLuong;
    
    // Lưu sản phẩm đã cập nhật vào cơ sở dữ liệu
    const updatedProduct = await product.save();

    res.status(200).json({ message: 'Product updated successfully', product: updatedProduct });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
router_api.delete('/products/:id', controller.del);
router_api.get('/products/search', controller.search);
router_api.get('/products/:id', controller.findById);
module.exports = router_api;
