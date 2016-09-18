var mongoose = require('mongoose');

/**
* Represents an order
*/
var groupSchema = mongoose.Schema({
    name: {type: String, unique: true, required: true},
    owners: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
    pendingMembers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
});


/**
* Creates Group object
* @param creatorID: id of order creator, who will be an owner
* @param groupName: name of group
*/
groupSchema.statics.createGroup = function(creator, groupName, cb) {
    var creatorID = creator._id;
    this.create({
        name: groupName,
        owners: [creatorID],
        members: [creatorID],
        pendingMembers: []
    }, cb);
};

/**
* Adds a user to pendingMembers
* @param user: id of user who wants to join group
*/
groupSchema.methods.requestMembership = function(user, cb) {
    var userID = user.id;
    var isUserInMembers = (this.members.indexOf(userID) != -1);
    var isUserInPendingMembers = (this.pendingMembers.indexOf(userID) != -1);
    if (!isUserInMembers && !isUserInPendingMembers) {
        this.pendingMembers.push(userID);
        this.save(cb);
    } else {
        // user is already pending or a member
        cb("INVALID_USER");
    }
};

/**
* Moves a user from pendingMembers to members
* @param userID: user who wants to join group
*/
groupSchema.methods.approveMember = function(user, cb) {
    var userID = user.id;
    var pendingMemberIndex = this.pendingMembers.indexOf(userID);
    var isUserInPendingMembers = (pendingMemberIndex != -1);
    var isUserInMembers = (this.members.indexOf(userID) != -1);
    if (isUserInPendingMembers && !isUserInMembers) {
        this.members.push(userID);
        this.pendingMembers.splice(pendingMemberIndex, 1);
        this.save(cb);
    } else {
        // user isn't pending, therefore cannot be approved
        cb("USER_NOT_PENDING");
    }
};

/**
* Grants owner status to a member
* @param user: user whose owner status is being changed
*/
groupSchema.methods.becomeOwner = function(user, cb) {
    var userID = user.id;
    // if userID is in members, add userID to owners
    var isUserInMembers = (this.members.indexOf(userID) != -1);
    var isUserInOwners = (this.owners.indexOf(userID) != -1);
    if (isUserInMembers && !isUserInOwners) {
        this.owners.push(userID);
        this.save(cb);
    } else {
        // isn't a non-owner member, shouldn't be given owner status
        cb("INVALID_USER");
    }
};

/**
* Removes a user from the group (regardless of status)
* @param user: user to remove from group
*/
groupSchema.methods.removeMember = function(user, cb) {
    var userID = user.id;

    var ownerIndex = this.owners.indexOf(userID);
    var isUserInOwners = (ownerIndex != -1);

    // don't let the user leave if they are the only owner... otherwise the group will be useless!
    if (isUserInOwners && this.owners.length < 2) {
        return cb("INVALID_USER");
    }

    // remove the user from owners
    if (isUserInOwners) {
        this.owners.splice(ownerIndex, 1);
    }

    // remove the user from members
    var memberIndex = this.members.indexOf(userID);
    var isUserInMembers = (memberIndex != -1);
    if (isUserInMembers) {
        this.members.splice(memberIndex, 1);
    }

    // remove the user from pendingMembers
    var pendingMemberIndex = this.pendingMembers.indexOf(userID);
    var isUserInPendingMembers = (pendingMemberIndex != -1);
    if (isUserInPendingMembers) {
        this.pendingMembers.splice(pendingMemberIndex, 1);
    }

    // if the user isn't in the group at all, return with success=false
    if (!isUserInPendingMembers && !isUserInMembers) {
        return cb("INVALID_USER");
    }

    this.save(cb);
};

groupSchema.methods.isUserInPendingMembers = function(user) {
    var userID = user.id;
    var pendingMembersIndex = this.pendingMembers.indexOf(userID);
    var isUserInPendingMembers = (pendingMembersIndex != -1);
    return isUserInPendingMembers;
};

groupSchema.methods.isUserInOwners = function(user) {
    var userID = user.id;
    var ownerIndex = this.owners.indexOf(userID);
    var isUserInOwners = (ownerIndex != -1);
    return isUserInOwners;
};


module.exports = mongoose.model('Group', groupSchema);
