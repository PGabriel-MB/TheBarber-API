const mongoose = require('../../database/index');

const RatingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    comment: {
        type: String
    },
    stars: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
    },
    serviceProvider: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    created: {
        type: Date,
        default: Date.now
    }
});

const Rating = mongoose.model('rating', RatingSchema);

module.exports = Rating;