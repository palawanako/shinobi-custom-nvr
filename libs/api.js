module.exports = function(s,config,lang,app){
    var pathOfImg='./web/libs/desktopImg/'
    const multer = require('multer');
    var fs = require('fs');
    var storage = multer.diskStorage({
        destination:'./web/libs/desktopImg/',
        filename: function (req, file, cb) {
            cb(null,Date.now()+'.'+file.originalname.split('.')[1])
        }
    });
    const upload = multer({
        storage: storage,
        limits : {fileSize : 1000000}
    }).single("file");

    app.post([
        config.webPaths.apiPrefix+':auth/upload/:ke/',

    ],function (req,res){
        endData = {
            ok : false
        }
        res.setHeader('Content-Type', 'application/json');

        s.auth(req.params,function(user){
            if(user.details.sub){
                endData.msg = user.lang['Authentication failed']
                s.closeJsonResponse(res,endData)
                return
            }
            upload(req, res, (err) => {
                if(err) {
                    res.status(400).send("Something went wrong!");
                }
                res.send(req.file);
            });
            if(endData.msg){
                res.end(s.prettyPrint(endData))
            }
        },res,req)
    })

       app.post([
        config.webPaths.apiPrefix+':auth/api/:ke/',

    ],function (req,res){
        endData = {
            ok : false
        }
        res.setHeader('Content-Type', 'application/json');
        var messageError = {
            error: {
                code: "400",
                message:
                    "Invalid request - example: ?t=nametable",
            },
        };
        s.auth(req.params,function(user){
            if(user.details.sub){
                endData.msg = user.lang['Authentication failed']
                s.closeJsonResponse(res,endData)
                return
            }
            if (req.query.t === undefined) {
                res.json(messageError);
                return;
            }
            let info = req.body;
            //keys
            var keyArr = [];
            Object.keys(info[0]).forEach(function (key) {
                keyArr.push(key);
            });

            //VALUES
            var valArr = [];
            info.forEach(function (newObj) {
                valArr.push(Object.values(newObj));
            });
            Crud.insert(keyArr, valArr, req.query.t, function (err, results) {
                if (err) {
                    res.json(err);
                } else {
                    res.json({ id: results.insertId, values: req.body });
                }
            });
            if(endData.msg){
                res.end(s.prettyPrint(endData))
            }
        },res,req)
    })

    //get
    app.get([
        config.webPaths.apiPrefix+':auth/api/:ke/:id?',
    ],function (req,res){
        endData = {
            ok : false
        }
        res.setHeader('Content-Type', 'application/json');
        var messageError = {
            error: {
                code: "400",
                message:
                    "Invalid request - example: ?t=nametable",
            },
        };
        s.auth(req.params,function(user){
            if(user.details.sub){
                endData.msg = user.lang['Authentication failed']
                s.closeJsonResponse(res,endData)
                return
            }
            if (req.query.t === undefined) {
                res.json(messageError);
                return;
            }
            if (req.query.id) {
                Crud.getById(req.query.id, req.query.t, req.query.f, function (err, rows) {
                    if (err) {
                        res.json(err);
                    } else {
                        res.json(rows);
                    }
                });
            } else {
                Crud.get(req.query.t, function (err, rows) {
                    if (err) {
                        res.json(err);
                    } else {
                        res.json(rows);
                    }
                });
            }
            if(endData.msg){
                res.end(s.prettyPrint(endData))
            }
        },res,req)
    })

    //update
    app.put([
        config.webPaths.apiPrefix+':auth/api/:ke/:id?',

    ],function (req,res){
        endData = {
            ok : false
        }
        res.setHeader('Content-Type', 'application/json');
        var messageError = {
            error: {
                code: "400",
                message:
                    "Invalid request - example: ?t=nametable",
            },
        };
        s.auth(req.params,function(user){
            if(user.details.sub){
                endData.msg = user.lang['Authentication failed']
                s.closeJsonResponse(res,endData)
                return
            }
            if (req.query.t === undefined) {
                res.json(messageError);
                return;
            }
            Crud.update(
                req.query.id,
                req.query.t,
                req.body,
                req.query.f,
                function (err, rows) {
                    if (err) {
                        res.json(err);
                    } else {
                        res.json(rows);
                    }
                }
            );

            if(endData.msg){
                res.end(s.prettyPrint(endData))
            }
        },res,req)
    })

    //delete
    app.delete([
        config.webPaths.apiPrefix+':auth/api/:ke/:id?',

    ],function (req,res){
        endData = {
            ok : false
        }
        res.setHeader('Content-Type', 'application/json');
        var messageError = {
            error: {
                code: "400",
                message:
                    "Invalid request - example: ?t=nametable",
            },
        };
        s.auth(req.params,function(user){
            if(user.details.sub){
                endData.msg = user.lang['Authentication failed']
                s.closeJsonResponse(res,endData)
                return
            }
            if (req.query.t === undefined) {
                res.json(messageError);
                return;
            }
            //for preset table must delete image files
            if(req.query.t==='DesktopApp_preset'){
               s.sqlQuery('select * from '+req.query.t+' where '+req.query.f+'=?',req.query.id,function (er,row) {
                   if(row && row[0]){
                       //check if exist
                       fs.stat(pathOfImg+row[0]['thumb'], function (err, stats) {
                           if (err) {
                               return console.error(err);
                           }
                           fs.unlink(pathOfImg+row[0]['thumb'],function(err){
                               if(err) return console.log(err);
                           });
                       });
                   }
               })
            }
            Crud.delete(req.query.id, req.query.t, req.query.f, function (err, count) {
                if (err) {
                    res.json(err);
                } else {
                    res.json(count);
                }
            });

            if(endData.msg){
                res.end(s.prettyPrint(endData))
            }
        },res,req)
    })


    var Crud = {
        get: function (table, callback) {
            return s.sqlQuery("SELECT * FROM " + table, callback);
        },
        getById: function (id, table,field, callback) {
            return s.sqlQuery("SELECT * FROM  " + table + ' WHERE '+field+'=? ' , id, callback);
        },
        insert: function (fields,values, table, callback) {
            return s.sqlQuery("INSERT INTO " + table + "("+fields+") VALUES  ? ", [values], callback);
        },
        delete: function (id, table ,field, callback) {
        return s.sqlQuery("DELETE FROM " + table + " WHERE "+field+'=? ' , [id], callback);
        },
        update: function (id, table, values ,field, callback) {
            return s.sqlQuery("UPDATE " + table + " SET ?  WHERE "+field+'=? ', [values, id], callback);
        }
    };
}