const mongoose = require('mongoose');

const KVSchema = new mongoose.Schema({
    id: String,
    image: String,
});

const KV = mongoose.model('kv', KVSchema);

module.exports = KV;
