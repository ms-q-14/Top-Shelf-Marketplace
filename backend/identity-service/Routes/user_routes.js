// routes/users_routes.js
const bcrypt = require("bcrypt");
const e = require("express");
const jwt = require("jsonwebtoken");
const router = require("express").Router();
const User = require("../db/Models/UserSchema");
const tokenService = require("../Services/token_service");
const redisService = require("../Services/redis.service");
const AwsService = require("../Services/aws.service");
const crypto = require("crypto");

//Middleware
const validateNewUser = (req, res, next) => {
  if (!(req.body.username && req.body.password && req.body.email)) {
    return res
      .status(400)
      .json({ error: "Request body is missing required fields" });
  }
  next();
};
const validateLogin = (req, res, next) => {
  if (!(req.body.username && req.body.password)) {
    return res
      .status(400)
      .json({ error: "Request body is missing required fields" });
  }
  next();
};
const validateToken = async (req, res, next) => {
  const token = req.cookies.accessToken;
  if (!token) {
    return res.status(401).json({ error: "Unauthorized request" });
  }
  const blacklisted = await redisService.get(token);
  if (blacklisted) {
    return res
      .status(401)
      .json({ error: "Unauthorized request, token no longer valid" });
  } else {
    jwt.verify(token, process.env.TOKEN_KEY, (err, decoded) => {
      if (err) {
        return res.status(500).json({ error: "Error verifying token" });
      } else {
        req.user = decoded.user;
        next();
      }
    });
  }
};

//= =================== ROUTES =================== //
router.post("/register", validateNewUser, (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  let email = req.body.email;

  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: "Error generating salt" });
    } else {
      bcrypt.hash(password, salt, (err, hash) => {
        if (err) {
          console.log(err);
          res.status(500).json({ error: "Error hashing password" });
        } else {
          const newUser = new User({
            username: username,
            password: hash,
            email: email,
          });

          newUser.save(async (err, user) => {
            if (err && err.code === 11000) {
              res
                .status(400)
                .json({ error: "Username or email already exists" });
            } else if (err) {
              console.log(err);
              res.status(500).json({ error: "Error saving user to database" });
            } else {
              res.status(201).json({ message: "User created", user: user.id });
            }
          });
        }
      });
    }
  });
});

router.post("/login", validateLogin, (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  User.findOne({ username: username }, (err, user) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: "Error finding user in database" });
    } else if (!user) {
      res.status(404).json({ error: "User does not exist" });
    } else {
      bcrypt.compare(password, user.password, async (err, match) => {
        if (err) {
          console.log(err);
          res.status(500).json({ error: "Error comparing passwords" });
        } else if (!match) {
          res.status(400).json({ error: "Incorrect password" });
        } else {
          try {
            const accessToken = tokenService.generateAccessToken(user);
            const refreshToken = tokenService.generateRefreshToken(user);
            res.cookie("accessToken", accessToken, {
              httpOnly: true,
              sameSite: "strict",
            });
            res.cookie("refreshToken", refreshToken, {
              httpOnly: true,
              sameSite: "strict",
            });
            await redisService.set({
              key: refreshToken,
              value: "1",
            });
            res.status(200).json({
              message: "User logged in",
              user: {
                id: user.id,
                avatar: user.avatar,
                username: user.username,
              },
            });
          } catch (err) {
            console.log(err);
            res.status(500).json({ error: "Error generating token" });
          }
        }
      });
    }
  });
});

router.post("/logout", async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    const accessToken = req.cookies.accessToken;
    if (!refreshToken || !accessToken) {
      res.cookie("accessToken", "", {
        maxAge: 0,
        httpOnly: true,
        sameSite: "strict",
      });
      res.cookie("refreshToken", "", {
        maxAge: 0,
        httpOnly: true,
        sameSite: "strict",
      });
      return res.status(401).json({ error: "Unauthorized request" });
    }
    const decoded = jwt.decode(accessToken);
    if (decoded && decoded.exp > Date.now() / 1000) {
      await redisService.set({
        key: accessToken,
        value: "-1",
        expire: decoded.exp - Date.now() / 1000,
      });
    }
    await redisService.del(refreshToken);
    res.cookie("accessToken", "", {
      maxAge: 0,
      httpOnly: true,
      sameSite: "strict",
    });
    res.cookie("refreshToken", "", {
      maxAge: 0,
      httpOnly: true,
      sameSite: "strict",
    });
    res.status(200).json({ message: "User logged out" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error logging out" });
  }
});

router.post("/refresh", async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({ error: "Unauthorized request" });
  } else {
    const key = await redisService.get(refreshToken);
    if (!key) {
      return res.status(403).json({ error: "Forbidden request" });
    } else {
      jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_KEY,
        (err, decoded) => {
          if (err) {
            res.status(500).json({ error: "Error verifying token" });
          } else {
            const accessToken = tokenService.generateAccessToken(decoded.user);
            res.cookie("accessToken", accessToken, {
              httpOnly: true,
              sameSite: "strict",
            });
            res.status(200).json({ message: "Token refreshed" });
          }
        }
      );
    }
  }
});
router.patch("/avatar", validateToken, (req, res) => {
  let sampleFile;

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send("No files were uploaded.");
  }
  sampleFile = req.files.file;

  //   const blob = fs.readFileSync(imagePath);
  const uuid = crypto.randomUUID();
  const fileType = sampleFile.mimetype.split("/")[1];
  const fileName = req.body.fileName;

  AwsService.uploadImage(fileName, sampleFile.data)
    .then((data) => {
      const user = User.findById(req.user._id, (err, user) => {
        if (err) {
          console.log(err);
          res.status(500).json({ error: "Error finding user in database" });
        } else if (!user) {
          res.status(404).json({ error: "User does not exist" });
        } else {
          user.avatar = data.Location;
          user.save((err, user) => {
            if (err) {
              console.log(err);
              res.status(500).json({ error: "Error saving user to database" });
            } else {
              res.status(200).json({
                message: "User updated",
                user: user.id,
                avatar: user.avatar,
              });
            }
          });
        }
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "Error uploading image" });
    });
});

router.patch("/", validateToken, (req, res) => {
  const { username, email, password } = req.body;
  User.findOne({ _id: req.user._id }, (err, user) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: "Error finding user in database" });
    } else if (!user) {
      res.status(404).json({ error: "User does not exist" });
    } else {
      if (username) {
        user.username = username;
      }
      if (email) {
        user.email = email;
      }
      if (password) {
        bcrypt.genSalt(10, (err, salt) => {
          if (err) {
            console.log(err);
            res.status(500).json({ error: "Error generating salt" });
          } else {
            bcrypt.hash(password, salt, (err, hash) => {
              if (err) {
                console.log(err);
                res.status(500).json({ error: "Error hashing password" });
              } else {
                user.password = hash;
              }
            });
          }
        });
      }
      user.save((err, user) => {
        if (err) {
          console.log(err);
          res.status(500).json({ error: "Error saving user to database" });
        } else {
          res.status(200).json({ message: "User updated", user: user.id });
        }
      });
    }
  });
});

router.get("/test", validateToken, async (req, res) => {
  const key = await redisService.get(req.cookies.refreshToken);
  res.status(200).json({ message: "User is logged in", user: req.user.id });
});

router.get("/stream/:streamKey", async (req, res) => {
  try {
    const user = await User.findById(req.params.streamKey);
    if (!user) return res.status(404).json({ error: "User not found" });
    return res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ error: "Error finding user" });
  }
});

module.exports = router;
