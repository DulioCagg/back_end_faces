const handleRegister = (req, res, db, bcrypt) => {
  const { name, email, password } = req.body;
  const salt = bcrypt.genSaltSync(10);

  if (!email || !name || !password) {
    return res.status(400).json("Incorrect form submission!");
  }
  const hash = bcrypt.hashSync(password, salt);

  res.json("Entering the transaction")
  db.transaction(trx => {
    trx.insert({
      hash: hash,
      email: email
    })
      .into('logins')
      .returning("email")
      .then(logInEmail => {
        console.log("Logins table successful bois")
        db('users')
          .returning("*")
          .insert({
            email: logInEmail[0],
            name: name,
            joined: new Date()
          })
          .then(user => res.json(user[0]))
          .catch(err => res.status(400).json("Unable to register!"))
      })
      .then(trx.commit)
      .catch(trx.rollback)
  })

}

module.exports = {
  handleRegister: handleRegister,
};