//  Middleware to ad custom headers for demo purposes.

const addDemoHeaders = (req, res, next) => {
  // Add a header called 'X-Demo-Page' with 'true'
  res.setHeader("X-Demo-Page", "true");

  //  Add a header called 'X-middleware-Demo' with any messsage you want
  res.setHeader("X-middleware-demo", "This is a Demo and I'm testing it");

  next();
};

export { addDemoHeaders };
