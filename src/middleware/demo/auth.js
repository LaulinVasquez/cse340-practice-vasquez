export function isAuthenticated(req, res, next) {

    // Fake logged in user
    const loggedIn = true;

    if (!loggedIn) {
        return res.redirect('/login');
    }
    req.user = {
        name: "Laurin",
        role:"admin"
    }
    res.locals.user = req.user;
    next();
}

export function isAdmin(req, res, next) {

    // Fake admin check
    const admin = true;

    if (!admin) {
        return res.status(403).send('Admins only');
    }
    next();
}