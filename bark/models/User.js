var mongoose = require('mongoose');

/**
* Represents an order
*/
var userSchema = mongoose.Schema({
    facebookId: {type: String, unique: true, required: true},
    name: {type: String, required: true}
});

userSchema.statics.findOrCreate = function(profile, cb) {
    console.log(profile);
    mongoose.model('User').findOne({'facebookId' : profile.id}, function(err1, user){
        if (err1) return cb(err);

        if (user) {
            return cb(null,user);
        } else {
            mongoose.model('User').create({'facebookId': profile.id, 'name' : profile.displayName}, function(err2, userCreated){
                console.log("creating user");
                if (err2) return cb(err2);
                if (userCreated) {
                    return cb(null,userCreated);
                } else {
                    return cb({msg: 'Could not find or create that user.'});
                } 
            });
        }
    });
}

module.exports = mongoose.model('User', userSchema);
