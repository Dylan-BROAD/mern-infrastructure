module.exports = function (req, res, next) {
    console.log('User is not logged in');
    if (!req.user) return res.status(401).json('Unauthorized');
    console.log('User is logged in:', req.user);
    next();
};