var mongoose = require('mongoose');

module.exports = mongoose.model('PhotoInfo', {
    uniqueFilename: {
        type: String,
        default: ''
    },
    realName : String,
    path : String,
    info : [{
    	label : String,
    	confidence : Number,
    	topleft : Object,
    	bottomright : Object
    }],
    created : {
    	type : Date,
        default: Date.now
    },
    mimetype : String
});

