
const { User } = require("../models/User");
const { Admin } = require("../models/admin")
const { Benefits } = require("../models/User");
const { hash, compare } = require("bcryptjs");
const { sign } = require("jsonwebtoken");
const admin = require("../models/admin");

exports.register = async (req, res, next) => {
  const { username, password, role } = req.body;
  if (!username || !password || !role)
    return res.status(400).send("Please fill in all the required fields!")
  try {
    const userObj = { username, role };
    const hashedPwd = await hash(password, 12);
    userObj.password = hashedPwd;
    const user = await new Admin(userObj).save();
    const token = sign({ [role]: admin }, "482d0829e5856b8340k3945p7487c5485x0940z", { expiresIn: 360000 });
    return res
      .status(201)
      .json({ token, admin: { ...user._doc, password: null } });
  } catch (error) {
    return res.status(500).send(error.message);
  }
};


exports.login = async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const user = await Admin.findOne({ username }).lean();
    if (!user) return res.status(404).send("Invalid credentials");
    if (user.role !== "admin")
      return res.status(404).send("Invalid credentials..");
    const isMatch = await compare(password, user.password);
    if (!isMatch) return res.status(400).send("Invalid credentials");
    const token = sign({ user }, "482d0829e5856b8340k3945p7487c5485x0940z", { expiresIn: 360000 });
    return res.status(200).json({ token, user: { ...user, password: null } });
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

exports.getUsers = async (req, res, next) => {
  try {
    return res.status(200).json(await User.find().lean());
  } catch (error) {
    return res.status(500).json(error);
  }
};

exports.updateUser = async (req, res, next) => {
  const { id } = req.params;
  try {
    if (!req.admin) return res.status(400).send("You dont have permission");
    const user = await User.findById(id).lean();
    if (!user) return res.status(400).send("User does not exist");
    const userObj = { ...req.body };
    if (req.body.password) {
      const hashedPWD = await hash(req.body.password, 12);
      userObj.password = hashedPWD;
    }
    const newUser = await User.findByIdAndUpdate(
      { _id: id },
      { ...userObj },
      { new: true }
    );
    return res.status(200).json(newUser);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  const uid = req.headers['userid'];
  try {
    await User.deleteOne({ _id: uid });
    return res.status(200).send("User has been deleted");
  } catch (error) {
    return res.status(500).json(error);
  }
};
exports.deletebenefit = async (req, res, next) => {
  const bid = req.headers['bid'];
  console.log(bid);
  try {
    await Benefits.deleteOne({ _id: bid });
    return res.status(200).send("Benefit has been deleted");
  } catch (error) {
    return res.status(500).json(error);
  }
};
exports.getAuthAdmin = async (req, res, next) => {
  try {
    const admin = await User.findById(req?.admin?._id).select("-password").lean();
    if (!admin)
      return res.status(400).send("Admin not found, Authorization denied..");
    return res.status(200).json({ ...admin });
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

exports.addbenefits = async (req, res, next) => {
  const { benefit_name, description, elegibility_criteria, coverage_amount, image,fields } = req.body;
  if (!benefit_name || !description || !elegibility_criteria || !coverage_amount || !image||!fields)
    return res.status(400).send("Please fill in all the required fields!");
  try {
    const newModule = new Benefits({ benefit_name, description, elegibility_criteria, coverage_amount, image,fields });
    await newModule.save();
    return res.status(201).json({ message: 'Benefit added successfully' });
  } catch (error) {
    return res.status(500).send(error.message);
  }
};
exports.addapprove = async (req, res, next) => {
  const { u_id, b_id } = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(u_id, {
      $addToSet: {
        approved_benefits
          : b_id
      }
    }, { new: true });
    return res.status(200).json(updatedUser);
  } catch (error) {
    return res.status(500).json(error);
  }
}
exports.deleteben = async (req, res, next) => {
  const { u_id, b_id } = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(u_id, {
      $pull: {
        added_benefits: b_id
      }
    }, { new: true });
    return res.status(200).json(updatedUser);
  } catch (error) {
    return res.status(500).json(error);
  }
}
