module.exports = function(req, res, next) {
  const { phoneNumber, name, password } = req.body;

  function validPhoneNumber(phoneNumber) {
    // You can define your own validation logic for phone numbers
    // For example, a basic regex pattern for a valid phone number in a specific format
    return /^\d{10}$/.test(phoneNumber);
  }

  if (req.path === "/register") {
    if (![phoneNumber, name, password].every(Boolean)) {
      return res.json("Missing Credentials");
    } else if (!validPhoneNumber(phoneNumber)) {
      return res.json("Invalid Phone Number");
    }
  } else if (req.path === "/login") {
    if (![phoneNumber, password].every(Boolean)) {
      return res.json("Missing Credentials");
    } else if (!validPhoneNumber(phoneNumber)) {
      return res.json("Invalid Phone Number");
    }
  }

  next();
};
