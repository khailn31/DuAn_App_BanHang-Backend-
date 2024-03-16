const User = require("../models/UserModel");
const Product = require("../models/ProductModel");
const Bill = require("../models/BillModel");
const regUserController= async (req, res) => {
    console.log(req.body);
    const newUser = new User({
      email: req.body.email,
      password: req.body.password,
      money:0
    });
    try {
      const result = await newUser.save();
      res.status(200).json({ message: "Đăng ký thành công" });
    } catch (error) {
      console.log(error);
    }
  };

  const login=async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
  
    if (!user) {
      return res.status(401).json({ message: "Tài khoản không tồn tại" });
    }
  
    else if (user.password !== password) {
      // Mật khẩu không khớp
      return res.status(401).json({ message: "Sai mật khẩu" });
    }
    else {
      // console.log("Login successful" );
      return res.status(200).json({ message: "Đăng nhập thành công" });
    }
    // Đăng nhập thành công, có thể lưu phiên làm việc tại đây
  
  
  };
  const fetchData=async (req, res) => {
    try {
      // Fetch all products from the MongoDB database
      const products = await Product.find();
  
      res.json(products);
   
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  const fetchBill=async (req, res) => {
    try {
      // Fetch all products from the MongoDB database
      const bills = await Bill.find();
  
      res.json(bills);
   
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  const fetchBillByEmail = async (req, res) => {
    try {
        // Lấy email từ yêu cầu
        const { email } = req.params;

        // Sử dụng Mongoose để tìm các hóa đơn với email nhất định
        const bills = await Bill.find({ email: email });

        res.json(bills);
   
    } catch (error) {
        console.error("Lỗi khi lấy hóa đơn:", error);
        res.status(500).json({ message: "Lỗi máy chủ nội bộ" });
    }
};
  
  const del= async (req, res) => {
    const productId = req.params.id;
  
    try {
      const deletedProduct = await Product.findByIdAndDelete(productId);
  
      if (!deletedProduct) {
        return res.status(404).json({ message: "Sản phẩm không tồn tại" });
      }
  
      res.json({ message: "Xóa sản phẩm thành công", deletedProduct });
    } catch (error) {
      console.error("Error deleting product:", error);
      res.status(500).json({ message: "Lỗi khi xóa sản phẩm" });
    }
  };

  const search=async (req, res) => {
    try {  const tenSP = req.query.tenSP.toLowerCase();
      // Fetch all products from the MongoDB database
      const products = await Product.find({tenSP:tenSP});
      res.json(products);
      console.log(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  const findById=async (req, res) => {
    try {
      const productId = req.params.id;
      const product = await Product.findById(productId);
  
      if (!product) {
        return res.status(404).json({ message: "Sản phẩm không tồn tại" });
      }
  
      res.json(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ message: "Lỗi khi lấy sản phẩm" });
    }
  };
  module.exports={regUserController,login,fetchData,del,search,findById,fetchBill,fetchBillByEmail};