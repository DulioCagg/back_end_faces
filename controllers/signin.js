const handleSignin = (req, res, db, bcrypt) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json("Incorrect form submission!");
  }

  console.log(email, password);

  db.select('email', 'hash')
    .from('logins')
    .where('email', '=', email)
    .then(data => {
      console.log(data);
      // const valid = bcrypt.compareSync(password, data[0].hash);
      const valid = (password === data[0].hash) ? true : false;
      if (valid) {
        return db.select('*').from('users')
          .where('email', '=', email)
          .then(user => res.json(user[0]))
          .catch(err => res.status(400).json("Unable to get user!"))
      } else {
        res.status(400).json("Wrong credentials!")
      }
    })
    .catch(err => res.status(400).json("wrong credential boy!"))
}

module.exports = {
  handleSignin: handleSignin,
};