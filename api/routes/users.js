const router = require("express").Router();
const User = require("../models/User");
const Post = require("../models/Post");

const bcrypt = require('bcrypt');

//UPDATE
/*router.get('/test', (req, res) => {
    res.send("Users routes are working.")
})*/
router.put("/:id", async (req, res) => {
    console.log("Updating user")

    try {
        console.log(req.body)
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set: req.body,
        }, { new: true });
        res.status(200).json(updatedUser);

        if (req.body.userId === req.params.id) {
            if (req.body.password) {
                const salt = await bcrypt.genSalt(10);
                (req.body.password = await bcrypt.hash(req.body.password, salt));
            }
        }
        else {
            res.status(401).json("you can update only your own account");
        }
    }
    catch (err) {
        console.log(err)
        res.status(500).json(err);
    }
});

//DELETE
router.delete("/:id", async (req, res) => {
    if (req.body.userId === req.params.id) {
        try {
            const user = await User.findById(req.params.id)
            try {
                await Post.deleteMany({ username: user.username });
                await User.findOneAndDelete(req.params.id);
                res.status(200).json("user has been deleted");
            }
            catch (err) {
                console.log(err);
                res.status(500).json(err);

            }
        } catch (err) {
            res.status(404).json("user not found");
        }

    }
    else {
        res.status(401).json("you can delete only your own account");
    }
});

//GET USER
router.get("/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const { password, ...others } = user._doc
        res.status(200).json(others);
    } catch (err) {
        res.status(500).json(err);
    }
});
module.exports = router;