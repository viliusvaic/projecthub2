var MongoClient = require('mongodb').MongoClient;

var url = 'mongodb://localhost:27017/data';

var mongoWrapper = (usedCollection, callback) => {
    MongoClient.connect(url, function (err, db) {
        console.log("Connected correctly to server.");
        var collection = db.collection(usedCollection);
        callback(collection);
        db.close();
    });
};

var insertItems = (itemsArray, usedCollection) => {
    mongoWrapper(usedCollection, (collection) => {
        itemsArray.forEach(function (item) {
            collection.save(item);
        });
    });
};

var readAllItems = (usedCollection) => {
    mongoWrapper(usedCollection, (collection) => {
        var cursor = collection.find({});
        cursor.forEach(function (item) {
            console.log(item);
        });
    });
};

var readOneItem = (itemId, usedCollection) => {
    mongoWrapper(usedCollection, (collection) => {
        var cursor = collection.find({_id: itemId});
        cursor.forEach(function (item) {
            console.log(item);
        });
    });
};

var deleteOneItem = (itemId, usedCollection) => {
    mongoWrapper(usedCollection, (collection) => {
        collection.deleteOne({_id: itemId});
    });
};

module.exports = {
    insertItems: insertItems,
    readAllItems: readAllItems,
    readOneItem: readOneItem,
    deleteOneItem: deleteOneItem
};