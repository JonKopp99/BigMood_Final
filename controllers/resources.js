const express = require('express');
const app = express();
const Resource = require('../models/resource');
var admin = require('../app');

module.exports = function(app) {

    //ROOT ROUTE
    //https://stackoverflow.com/questions/39277670/how-to-find-random-record-in-mongoose
    app.get('/', (req, res) => {
     Resource.count().exec(function (err, count) {
        // "Get a random entry"
        var random = Math.floor(Math.random() * count)
       // "Again query all users but only fetch one offset by our random #""
        Resource.findOne().skip(random).exec(
          function (err, result) {
           // "Tada! random user"
            console.log(result)
            res.render('landing', { resource: result });
          })
      })
    });

    // NEW resource form
    app.get('/resources/new', (req, res) => {
      res.render('resources-new', {});
    });

    // CREATE NEW resource
    app.post('/resources', (req, res) => {
      Resource.create(req.body).then((resource) => {
        console.log(resource);
        res.redirect(`/`)

      }).catch((err) => {
        console.log(err.message);
      })
    });

    app.get('/moods/:mood', (req, res) => {
      Resource.find({moods: {$all:[req.params.mood]}}).then(resources => {
        console.log(resources)
        res.render('by-mood', {resources: resources, mood: req.params.mood});
      }).catch(err => {
        console.log(err.message);
      });
    });







// ---------- ADMIN FEATURES BELOW ------------


  // SHOW A single resource for ADMIN USE ONLY
  app.get('/resources/:id', (req, res) => {
    // find resource
    Resource.findById(req.params.id).then(resource => {
        res.render('resources-show-admin', { resource: resource})})
        .catch((err) => {
      console.log(err.message)
    });
  });

      //admin see all to edit
      app.get('/index', (req, res) => {
          Resource.find()
             .then(resources => {
               res.render('resources-index', { resources: resources });
             })
             .catch(err => {
               console.log(err);
             })
      });

    // EDIT a resource by clicking on the edit link in the shown resource
    app.get('/resources/:id/edit', (req, res) => {
      Resource.findById(req.params.id, function(err, resource) {
        res.render('resources-edit', {resource: resource});
      })
    });


    // UPDATE... does this replace EDIT? ...guess not...
    app.put('/resources/:id', (req, res) => {
      Resource.findByIdAndUpdate(req.params.id, req.body).then(resource => {
          res.redirect('/index');
        })
        .catch(err => {
          console.log(err.message)
        })
    });


    // DELETE one resource from the delete button on the "shown" resource page
    app.delete('/resources/:id', function (req, res) {
      console.log("DELETE resource")
      Resource.findByIdAndRemove(req.params.id).then((resource) => {
         res.redirect('/index');
      }).catch((err) => {
        console.log(err.message);
      })
    });

};
