const express = require('express');
const mongoose = require('mongoose');

// Builds a CRUD router. Automatically uses the real Mongoose model + MongoDB
// when a database connection is active (production, with MONGODB_URI set),
// and transparently falls back to the in-memory store for local/demo mode.
function makeRouter(Model, memCollection) {
  const router = express.Router();

  const dbReady = () => mongoose.connection.readyState === 1;

  router.get('/', async (req, res) => {
    try {
      const data = dbReady() ? await Model.find().sort({ createdAt: -1 }) : memCollection.findAll();
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.post('/', async (req, res) => {
    try {
      const data = dbReady() ? await Model.create(req.body) : memCollection.create(req.body);
      res.status(201).json(data);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  router.put('/:id', async (req, res) => {
    try {
      const data = dbReady()
        ? await Model.findByIdAndUpdate(req.params.id, req.body, { new: true })
        : memCollection.update(req.params.id, req.body);
      if (!data) return res.status(404).json({ error: 'Not found' });
      res.json(data);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  router.delete('/:id', async (req, res) => {
    try {
      const removed = dbReady()
        ? await Model.findByIdAndDelete(req.params.id)
        : memCollection.remove(req.params.id);
      if (!removed) return res.status(404).json({ error: 'Not found' });
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
}

module.exports = makeRouter;
