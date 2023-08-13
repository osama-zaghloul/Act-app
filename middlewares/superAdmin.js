//middleware function check if token is valid
module.exports = function (req, res, next) {
    if (req.admin.superAdmin == true) next();

    else return res.status(401).send({
        message: "Access denied"
    });

}