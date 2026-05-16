//  Route hanlders for static pages

const homePage = (req, res) => {
  res.render("home", { title: "Home" });
};

const aboutPage = (req, res) => {
  res.render("about", { title: "about" });
};

const demoPage = (req, res) => {
  res.render("demo", { tile: "Middleware Demo Page" }); //Checke header.js
};

const testErrorPage = (req, res, next) => {
  const err = new Error("Work as expected! (This is a test error)");
  err.status = 500;
  next(err);
};

export { homePage, aboutPage, demoPage, testErrorPage };
