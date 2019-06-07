const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const router = express.Router();


const Item = require('../models/item_detail');
const Items = require('../models/items');


/**
 *
 *    GET REQUEST
 *
 */
router.get('/', (req, res, next) => {
  Items.find()
    .exec()
    .then( docs => {
      console.log(docs);
      // if(docs.length >= 0) {
        res.status(200).json(docs);
      // } else {
      //   res.status(404).json({
      //     message: 'No data found!'
      //   })
      // }

    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      })
    })
});

// router.get('/:id', (req, res, next) => {
//   const id = req.params.id;

//   Product.findById(id)
//     .exec()
//     .then(doc => {
//       console.log(doc);
//       if(doc) {
//         res.status(200).json(doc);
//       } else {
//         res.status(404).json({
//           message: 'No valid data'
//         })
//       }


//     })
//     .catch(err => {
//       console.log(err);

//       res.status(500).json({error: err});
//     });
// });



/**
 *
 *  POST REQUEST
 *
 */
router.post('/', (req, res, next) => {

  axios({
    method: 'get',
    url: `https://fortnite-api.theapinetwork.com/store/get`,
    headers: {'Authorization': "84bf0cc2b4b6be0918da79eff3a8e93b"}
  })
  .then(result => {
    const storeList = [];
    result.data.data.forEach(el => {
      let item = new Item({
        _id: new mongoose.Types.ObjectId(),
        itemid: el.itemId,
        name: el.item.name,
        price: el.store.cost,
        type: el.item.type,
        img: el.item.images.icon,
      });
      storeList.push(item);
    })

    const today = new Date().toLocaleString();

    let items = new Items({
      _id: new mongoose.Types.ObjectId(),
      items:storeList,
      query_date: today
    })

    

    items
    .save()
    .then(ress => {
      console.log(res);
      res.status(201).json({
        message: 'Items saved',
        items: items,
      });
    })
    .catch( err => {
      console.log(err);

      res.status(500).json({
        message: 'Items cannot be saved',
        error: err
      });
    } );

  })
  .catch(e => {
    console.log(e);
  });

  


});


/**
 *
 *  DELETE REQUEST
 *
 */
router.delete('/:id', (req, res, next) => {
  const id = req.params.id;
  Items.remove({_id: id})
    .exec()
    .then(result => {
      res.status(200).json(result);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});



module.exports = router;