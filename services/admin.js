
const { User } = require("../models/User");
const { Admin } = require("../models/admin")

exports.login = async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const admin = await Admin.findOne({ username }).lean();
    if (!admin) return res.status(404).send("Invalid credentials");
    if (password != admin.password) return res.status(400).send("Invalid credentials");
    return res.status(200).json({ admin });
  } catch (error) {
    return res.status(500).send(error.message);
  }
};
exports.register = async (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).send("Please fill in all the required fields!")
  try {
    const userObj = { username, password };
    const user = await new Admin(userObj).save();
    return res
      .status(200).json({ user });
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
  const { id } = req.params;
  try {
    if (!req.admin) return res.status(400).send("You dont have permission");
    await User.deleteOne({ id });
    return res.status(200).send("User has been deleted");
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

/*exports.addModule = async (req, res, next) => {
  const { title, image, content } = req.body;
  if (!title || !image || !content)
    return res.status(400).send("Please fill in all the required fields!");

  try {
    const newModule = new MyModule({ title, image, content });
    await newModule.save();
    return res.status(201).json({ message: 'Module added successfully' });
  } catch (error) {
    return res.status(500).send(error.message);
  }
};*/
