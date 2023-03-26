export const getprofile = async (req, res) => {
    try {
        if (!req.user) throw new Error();
        res.status(200).json({
            "name": req.user.name,
            "username": req.user.username,
            "email": req.user.email,
            "phone": req.user.phone,
            "role": req.user.role
        });
    } catch (error) {
        res.status(error.status || 500).json({ "msg": error.msg || "An error occurred while getting profile." });
    }
}