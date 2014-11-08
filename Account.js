module.exports = function(mongoose){
    var AccountSchema = new mongoose.Schema({
        username: {type: String, unique: true},
        password: {type: String},
        online: {type: Boolean},
        createGame: {type: Boolean}
    });

    var Account = mongoose.model('Account', AccountSchema);

    var online = function(username){
        Account.update({username: username}, {online: true}, {upsert: false}, function(err){
//            console.log('online: ' + err );
        });
    }

    var offline = function(username){
        Account.update({username: username}, {online: false, createGame: false}, {upsert: false}, function(err){
//            console.log('offline: ' + err );
        });
    }

    var login = function(username,password,callback){
        Account.findOne({username:username, password:password}, function (err,doc) {
//            console.log(username + ' Logging/ ' + 'doc ' + doc );
            callback(doc);
        })
    }

    var register = function(username,password,callback){
        console.log('Registering ' + username);

        var user = new Account({
            username: username,
            password: password,
            online: true,
            createGame: false
        });

        user.save(function (err, doc) {
            callback(doc);
            console.log('err: ' + err);
        });

    }

    var onlineList = function(userId,callback){
        list = Account.find({online: true})
//                        .where('_id')
//                        .ne(userId)
                        .find(function(err,docs){
                            callback(docs);
                        });
    }

    var createGame = function(userId){
        Account.update({_id: userId}, {createGame: true}, function(err,doc){
//            console.log('err: ' + err);
        })
    }

    return {
        online: online,
        offline: offline,
        onlineList: onlineList,
        register: register,
        login: login,
        createGame: createGame,
        Account: Account
    }
}

