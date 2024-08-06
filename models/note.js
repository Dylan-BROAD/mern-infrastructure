const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const noteSchema = new Schema({
    text: { type: String, required: true },
    user: { type: ObjectId, ref: 'User', required: true },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Note', noteSchema);