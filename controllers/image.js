const Clarifai = require('clarifai');

const app = new Clarifai.App({
  apiKey: '3b9784c19ae94c7492005ef1b4c21653'
});

const handleApiRequest = (req, res) => {
  app.models.predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
    .then(data => res.json(data))
    .catch(err => res.status(400).json("Couldnt connect to the API"))
}

const handleImage = (req, res, db) => {
  const { id } = req.body;

  db('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => res.json(entries[0]))
    .catch(err => res.status(400).json("Unable to increment the entries"))
}

module.exports = {
  handleImage: handleImage,
  handleApiRequest: handleApiRequest,
};