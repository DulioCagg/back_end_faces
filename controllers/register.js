const handleRegister = (req, res, db, bcrypt) => {
  const { name, email, password } = req.body;
  const salt = bcrypt.genSaltSync(10);

  if (!email || !name || !password) {
    return res.status(400).json("Incorrect form submission!");
  }
  const hash = bcrypt.hashSync(password, salt);


  if (db.schema.hasTable('users')) {
    db.select().from('users')
      .then(data => console.log(data))
      .catch(err => console.log("Users " + err))
    db.select().from('logins')
      .then(data => console.log(data))
      .catch(err => console.log("Logins " + err))
  }

  db.transaction(trx => {
    trx.insert({
      hash: hash,
      email: email
    })
      .into('logins')
      .returning("email")
      .then(logInEmail => {
        console.log("Enter into users")
        return trx('users')
          .returning("*")
          .insert({
            email: logInEmail[0],
            name: name,
            joined: new Date()
          })
          .then(user => res.json(user[0]))
          .catch(err => res.status(400).json("Unable to register first!"))
      })
      .then(trx.commit)
      .catch(trx.rollback)
  })
    .catch(err => res.status(400).json("Unable to register second!"))
}

module.exports = {
  handleRegister: handleRegister,
};