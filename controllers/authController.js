const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const response = require('../utils/response');
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });
};
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
    //   return res.status(400).json({
    //     message: 'Email sudah digunakan',
    //   });
        return response.error(res, {
            code: 400,
            message: 'Email sudah digunakan',
        });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return response.success(res, {
      code: 201,
      message: 'User berhasil didaftarkan',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      },
    });
  } catch (error) {
    return response.error(res, {
      code: 500,
      message: error.message,
    });
  }
};
exports.login = async (req, res) => {

  try {

    const { email, password } = req.body;

    if (!email || !password) {

      return response.validation(res, {
        errors: {
          email: !email
            ? ['Email wajib diisi']
            : [],
          password: !password
            ? ['Password wajib diisi']
            : [],
        },
      });

    }

    const user = await User.findOne({ email });

    if (!user) {

      return response.error(res, {
        code: 404,
        message: 'User tidak ditemukan',
      });

    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {

      return response.error(res, {
        code: 400,
        message: 'Password salah',
      });

    }

    return response.success(res, {
      code: 200,
      message: 'Login berhasil',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      },
    });

  } catch (err) {

    return response.error(res, {
      code: 500,
      message: 'Terjadi kesalahan server',
      err,
    });

  }

};
exports.profile = async (req, res) => {
    return response.success(res, {
        code: 200,
        message: 'Profile user',
        data: req.user,
    });
};