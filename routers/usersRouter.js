const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const verify = require("../middlewares/verifyToken");
const users = require("../data/users");
let refreshTokens = require("../data/refreshTokens");

// index
router.get("/", (req, res) => {
    const data = users.map((user) => ({
        id: user.id,
        username: user.username,
        isAdmin: user.isAdmin,
    }));
    res.json(data);
});

// jwt auth
router.post("/signup", (req, res) => {
    const { username, email, password } = req.body;
    // * solo simulazione signup runtime, no override dei dati (fs module)
    if (
        users.findIndex(
            (user) => user.username === username && user.password === password
        ) !== -1
    ) {
        return res.status(409).json("You are already Registered!");
    }
    users.push({
        id: crypto.randomUUID(),
        username: username,
        password: password,
        isAdmin: false,
    });
    // console.log(users);
    res.json("You have signup successfully!");
});

router.post("/login", (req, res) => {
    const { username, password } = req.body;
    const user = users.find((user) => {
        return user.username === username && user.password === password;
    });
    if (user) {
        // Generate an access token
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);
        refreshTokens.push(refreshToken);
        console.log(refreshTokens);
        res.json({
            id: user.id,
            username: user.username,
            isAdmin: user.isAdmin,
            accessToken,
            refreshToken,
        });
    } else {
        res.status(404).json("Username or password incorrect!");
    }
});

router.post("/logout", verify, (req, res) => {
    const refreshToken = req.body.token;
    refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
    console.log(refreshTokens);

    res.status(200)
        // .setHeader("Cache-Control", "no-cache, no-store, must-revalidate")
        // .setHeader("Pragma", "no-cache")
        // .setHeader("Expires", "0")
        .json("You have logged out successfully!");
});

router.post("/refresh", (req, res) => {
    // take the refresh token from the user
    const refreshToken = req.body.token;
    // send error if there is no token or it's invalid
    if (!refreshToken)
        return res.status(401).json("You are not authenticated!");
    if (!refreshTokens.includes(refreshToken)) {
        return res.status(403).json("Refresh token is not valid!");
    }
    // if everything is ok, create new accessToken, refreshToken and send to user
    jwt.verify(refreshToken, "myRefreshSecretKey", (err, user) => {
        err && console.log(err);
        refreshTokens = refreshTokens.filter((token) => token !== refreshToken);

        const newAccessToken = generateAccessToken(user);
        const newRefreshToken = generateRefreshToken(user);
        refreshTokens.push(newRefreshToken);
        res.status(200).json({
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
        });
    });
});

// functions
function generateAccessToken(user) {
    return jwt.sign({ id: user.id, isAdmin: user.isAdmin }, "mySecretKey", {
        expiresIn: "1h",
    });
}
function generateRefreshToken(user) {
    return jwt.sign(
        { id: user.id, isAdmin: user.isAdmin },
        "myRefreshSecretKey"
    );
}

module.exports = router;
