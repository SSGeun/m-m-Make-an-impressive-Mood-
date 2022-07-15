var Filter = require("../models/Filter");

var mongodb = require('mongodb');

var filterController = {};

function filterBackUpSuccess(res, filter) {

    console.log(filter);
    res.json(filter);
}

function filterInfoSuccess(res, filter) {

    console.log(filter);
    res.json(filter);
}

// 필터 백업
filterController.filterBackUp = function (req, res) {

    var userID = req.body.userID;
    var filterName = req.body.filterName;
    var brightness = req.body.brightness;
    var saturation = req.body.saturation;
    var contrast = req.body.contrast;
    var vignette = req.body.vignette;
    var noise = req.body.noise;
    var filmburn = req.body.filmburn;
    var rCode = req.body.rCode;
    var gCode = req.body.gCode;
    var bCode = req.body.bCode;

    var filter = new Filter({ 'userID': userID, 'filterName': filterName, 'brightness': brightness, 'saturation': saturation, 'contrast': contrast, 'vignette': vignette, 'noise': noise, 'filmburn': filmburn, 'rCode': rCode, 'gCode': gCode, 'bCode': bCode });

    filter.save(function (err) {

        console.log(err);

        filterBackUpSuccess(res, filter);
    });
};

// 필터 정보 GET
filterController.filterInfo = function (req, res) {

    var _id = req.body.filterID;

    Filter.findOne({ '_id': new mongodb.ObjectID(_id) }, function (err, filter) {

        if (err) {

            console.log(err);
        }

        filterInfoSuccess(res, filter);
    });
};

module.exports = filterController;