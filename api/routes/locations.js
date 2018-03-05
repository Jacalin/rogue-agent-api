const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const checkAuth = require('../middleware/check-auth')

const Location = require('../models/locations');

router.get('/', (req, res, next) => {
  Location.find()
  .select('name _id')
  .exec()
  .then(docs => {
    console.log(docs);
    res.status(200).json(docs);
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({
      error: err
    });
  });
});

router.post('/', checkAuth, (req, res, next) => {
  const location = new Location({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name
  });
  location
  .save()
  .then(result => {
    console.log(result);
    res.status(200).json({
      message: 'post for locations',
      createdLocation: result
    });
  })
  .catch(err => {
    console.log(err)
    res.status(500).json({
      error: err
    });
  });
});

router.get('/:locationId', (req, res, next) => {
  const id = req.params.locationId;
  Location.findById(id)
  .exec()
  .then(doc => {
    console.log(doc)
    res.status(200).json(doc);
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({
      error:err
    });
  });
});

router.patch('/:locationId', checkAuth, (req, res, next) => {
  const id = req.params.locationId;
  const updateOps = {};
  for(const ops of req.body){
    updateOps[ops.propName] = ops.value;
  }
  Location.update({ _id: id }, {$set : updateOps})
    .exec()
    .then(result => {
      console.log(result)
      res.status(200).json(result)
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
        error: err
      })
    })
});

router.delete('/:locationId', checkAuth, (req, res, next) => {
  const id = req.params.locationId;
  Location.remove({_id: id})
    .exec()
    .then(result => {
      res.status(200).json(result);
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
        error: err
      })
    })
});

module.exports = router;
