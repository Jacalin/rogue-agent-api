const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const checkAuth = require('../middleware/check-auth')

const Animal = require('../models/animals');

router.get('/', (req, res, next) => {
  Animal.find()
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
  const animal = new Animal({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name
  });
  animal
  .save()
  .then(result => {
    console.log(result);
    res.status(200).json({
      message: 'post for animals',
      createdAnimal: result
    });
  })
  .catch(err => {
    console.log(err)
    res.status(500).json({
      error: err
    });
  });
});

router.get('/:animalId', (req, res, next) => {
  const id = req.params.animalId;
  Animal.findById(id)
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

router.patch('/:animalId', checkAuth, (req, res, next) => {
  const id = req.params.animalId;
  const updateOps = {};
  for(const ops of req.body){
    updateOps[ops.propName] = ops.value;
  }
  Animal.update({ _id: id }, {$set : updateOps})
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

router.delete('/:animalId', checkAuth, (req, res, next) => {
  const id = req.params.animalId;
  Animal.remove({_id: id})
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
