module.exports = function (app, con) {
  // User Sign up
  app.post("/api/signup", (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400).send("Name, email, and password are required");
      return;
    }

    const checkQuery = "SELECT * FROM userDetails WHERE email = ?";
    db.query(checkQuery, [email], (err, results) => {
      if (err) {
        res.status(500).send("Server error");
        return;
      }

      if (results.length > 0) {
        res.status(400).send("User already exists");
        return;
      }

      bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
          res.status(500).send("Error hashing password");
          return;
        }

        const insertQuery =
          "INSERT INTO userDetails (name, email, password) VALUES (?, ?, ?)";
        db.query(insertQuery, [name, email, hashedPassword], (err, result) => {
          if (err) {
            res.status(500).send("Error saving user");
            return;
          }

          const token = jwt.sign({ id: result.insertId, email }, secretKey, {
            expiresIn: "1h",
          });

          res.status(201).json({
            message: "User registered successfully",
            token,
          });
        });
      });
    });
  });

  // User Login
  app.post("/api/loginUser", (req, res) => {
    console.log(email, password);
    const { email, password } = req.body;
    console.log(email, password);

    if (!email || !password) {
      res.status(400).send("Email and password are required");
      return;
    }

    const query = "SELECT * FROM userDetails WHERE email = ?";
    db.query(query, [email], (err, results) => {
      if (err) {
        res.status(500).send("Server error");
        return;
      }

      if (results.length === 0) {
        res.status(401).send("Invalid email or password");
        return;
      }

      const user = results[0];

      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) {
          res.status(500).send("Server error");
          return;
        }

        if (isMatch) {
          res.send("Login successful");
        } else {
          res.status(401).send("Invalid email or password");
        }
      });
    });
  });
};
