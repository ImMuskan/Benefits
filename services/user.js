const { hash, compare } = require("bcryptjs");
const { sign } = require("jsonwebtoken");

const { User, Benefits, Forms } = require("../models/User");

exports.register = async (req, res, next) => {
  const { username, email, password, role, age } = req.body;
  if (!username || !email || !password || !role || !age)
    return res.status(400).send("Please fill in all the required fields!")
  try {
    const userObj = { username, email, role, age };
    const hashedPwd = await hash(password, 12);
    userObj.password = hashedPwd;
    const user = await new User(userObj).save();
    const token = sign({ [role]: user }, "482d0829e5856b8340k3945p7487c5485x0940z", { expiresIn: 360000 });
    return res
      .status(201)
      .json(role === "user" ? { token, user: { ...user._doc, password: null } } : { token, admin: { ...user._doc, password: null } });
  } catch (error) {
    return res.status(500).send(error.message);
  }
};


exports.login = async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username }).lean();
    if (!user) return res.status(404).send("Invalid credentials");
    if (user.role !== "user")
      return res.status(404).send("Invalid credentials..");
    const isMatch = await compare(password, user.password);
    if (!isMatch) return res.status(400).send("Invalid credentials");
    const token = sign({ user }, "482d0829e5856b8340k3945p7487c5485x0940z", { expiresIn: 360000 });
    return res.status(200).json({ token, user: { ...user, password: null } });
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

exports.getAuthUser = async (req, res, next) => {
  try {
    const user = await User.findById(req?.user?._id).select("-password").lean();
    if (!user)
      return res.status(400).send("User not found, Authorization denied..");
    return res.status(200).json({ ...user });
  } catch (error) {
    return res.status(500).send(error.message);
  }
};


exports.getUser = async (req, res, next) => {
  const uid = req.headers['userid'];
  try {
    const user = await User.findById({ _id: uid });
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).send(error.message);
  }
};


exports.getbenefits = async (req, res, next) => {
  try {
    return res.status(200).json(await Benefits.find().lean());
  } catch (error) {
    return res.status(500).json(error);
  }
};


exports.registerForBenefit = async (req, res, next) => {
  const { u_id, b_id } = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(u_id, {
      $addToSet: {
        added_benefits
          : b_id
      }
    }, { new: true });
    return res.status(200).json(updatedUser);
  } catch (error) {
    return res.status(500).json(error);
  }
}

exports.addforms = async (req, res, next) => {
  const { formObject } = req.body;
  if (!formObject)
    return res.status(400).send("Please fill in all the required fields!");
  try {
    const newModule = new Forms({ formObject});
    await newModule.save();
    return res.status(201).json({ message: 'Form added successfully' });
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

exports.benefitregister = async (req, res, next) => {
  const { u_id, b_id } = req.body;
  try {
    const req = { u_id, b_id };
    const reqben = await new RequestedBenefit(req).save();
    return res.status(200).json(reqben);
  } catch (error) {
    return res.status(500).json(error);
  }
}




