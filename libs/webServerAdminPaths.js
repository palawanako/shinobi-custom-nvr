var fs = require('fs');
var os = require('os');
var moment = require('moment')
var request = require('request')
var jsonfile = require("jsonfile")
var exec = require('child_process').exec;
var spawn = require('child_process').spawn;
var execSync = require('child_process').execSync;
module.exports = function(s,config,lang,app){
    /**
    * API : Administrator : Edit Sub-Account (Account to share cameras with)
    */
    app.all(config.webPaths.adminApiPrefix+':auth/accounts/:ke/edit', function (req,res){
        s.auth(req.params,function(user){
            var endData = {
                ok : false
            }
            if(user.details.sub){
                endData.msg = user.lang['Not Permitted']
                s.closeJsonResponse(res,endData)
                return
            }
            var form = s.getPostData(req)
            var uid = form.uid || s.getPostData(req,'uid',false)
            var mail = form.mail || s.getPostData(req,'mail',false)
            var grpuid = form.grpuid || s.getPostData(req,'grpuid',false)
            if(form){
                var keys = ['details']
                var condition = []
                var value = []
                var value2 = []
                keys.forEach(function(v){
                    condition.push(v+'=?')
                    if(form[v] instanceof Object)form[v] = JSON.stringify(form[v])
                    value.push(form[v])
                })
                value2 = value.concat([uid])
                s.sqlQuery("UPDATE Users SET "+condition.join(',')+" WHERE uid=? ",value2)
               s.sqlQuery('UPDATE Users SET details=? WHERE  grpuid=?',value2)
                s.tx({
                    f: 'edit_sub_account',
                    ke: req.params.ke,
                    uid: uid,
                    mail: mail,
                    form: form
                },'ADM_'+req.params.ke)
                endData.ok = true
                s.sqlQuery("SELECT * FROM API WHERE ke=? AND uid=?",[req.params.ke,uid],function(err,rows){
                    if(rows && rows[0]){
                        rows.forEach(function(row){
                            delete(s.api[row.code])
                        })
                    }
                })
            }else{
                endData.msg = lang.postDataBroken
            }
            s.closeJsonResponse(res,endData)
        },res,req)
    })
    /**
    * API : Administrator : Delete Sub-Account (Account to share cameras with)
    */
    app.all(config.webPaths.adminApiPrefix+':auth/accounts/:ke/delete', function (req,res){
        s.auth(req.params,function(user){
            var endData = {
                ok : false
            }
            if(user.details.sub){
                endData.msg = user.lang['Not Permitted']
                s.closeJsonResponse(res,endData)
                return
            }
            var form = s.getPostData(req)
            // var uid = form.uid || s.getPostData(req,'uid',false)
           // var mail = form.mail || s.getPostData(req,'mail',false)
           var uid = req.body.uid
           var mail = req.body.mail
            s.sqlQuery('DELETE FROM Users WHERE uid=? AND ke=? AND mail=?',[uid,req.params.ke,mail])
            s.sqlQuery("SELECT * FROM API WHERE ke=? AND uid=?",[req.params.ke,uid],function(err,rows){
                if(rows && rows[0]){
                    rows.forEach(function(row){
                        delete(s.api[row.code])
                    })
                    s.sqlQuery('DELETE FROM API WHERE uid=? AND ke=?',[uid,req.params.ke])
                }
            })
            s.tx({
                f: 'delete_sub_account',
                ke: req.params.ke,
                uid: uid,
                mail: mail
            },'ADM_'+req.params.ke)
            endData.ok = true
            s.closeJsonResponse(res,endData)
        },res,req)
    })
    /**
    * API : Administrator : Add Sub-Account (Account to share cameras with)
    */
    app.post([
        config.webPaths.adminApiPrefix+':auth/accounts/:ke/register',
        //these two routes are for backwards compatibility
        config.webPaths.adminApiPrefix+':auth/register/:ke/:uid',
        config.webPaths.apiPrefix+':auth/register/:ke/:uid'
    ],function (req,res){
        endData = {
            ok : false
        }
        res.setHeader('Content-Type', 'application/json');
        s.auth(req.params,function(user){
            if(user.details.sub){
                endData.msg = user.lang['Not an Administrator Account']
                s.closeJsonResponse(res,endData)
                return
            }
            var form = s.getPostData(req)
            if(form.mail !== '' && form.pass !== ''){
                if(form.pass === form.password_again || form.pass === form.pass_again){
                    s.sqlQuery('SELECT * FROM Users WHERE mail=?',[form.mail],function(err,r) {
                        if(r&&r[0]){
                            //found one exist
                            endData.msg = 'Email address is in use.'
                            s.tx({
                                f: 'error',
                                msg: 'ایمیل تکراری می باشد',
                            },'ADM_'+req.params.ke)
                        }else{
                            //create new
                            //endData.msg = 'New Account Created'
                            endData.msg = user.lang["New Account Created"]
                            endData.ok = true
                            var newId = s.gid()
                            /*var details = s.s({
                                sub: "1",
                                allmonitors: "1"
                            })*/
                            var details = form.grpSetting;
                            var tmpID = JSON.parse(details);
                            var grpuid=tmpID.idgrp;


                            s.sqlQuery('INSERT INTO Users (ke,uid,grpuid,mail,pass,details) VALUES (?,?,?,?,?,?)',[req.params.ke,newId,grpuid,form.mail,s.createHash(form.pass),details])
                            s.tx({
                                f: 'add_sub_account',
                                details: details,
                                ke: req.params.ke,
                                uid: newId,
                                mail: form.mail
                            },'ADM_'+req.params.ke)
                            endData.user = {
                                details: s.parseJSON(details),
                                ke: req.params.ke,
                                uid: newId,
                                mail: form.mail
                            }
                        }
                        res.end(s.prettyPrint(endData))
                    })
                }else{
                    endData.msg = user.lang["Passwords Don't Match"]
                }
            }else{
                endData.msg = user.lang['Fields cannot be empty']
            }
        if(endData.msg){
            res.end(s.prettyPrint(endData))
        }
        },res,req)
    })
     /******************* ako
    * API : Administrator : Add groups
    */
   app.post([
    config.webPaths.adminApiPrefix+':auth/groups/:ke/register'
],function (req,res){
    endData = {
        ok : false
    }
    res.setHeader('Content-Type', 'application/json');
    s.auth(req.params,function(user){
        if(user.details.sub){
            endData.msg = user.lang['Not an Administrator Account']
            s.closeJsonResponse(res,endData)
            return
        }
        var form = s.getPostData(req)

        if(form.grpName !== ''){

            //create new
            endData.msg = 'New Account Created'
            endData.ok = true
            var newId = s.gid()
            var grpKey='3';
            var details = s.s({
                sub: '1',
                allmonitors: "1",
                idgrp: newId,
                grpName:form.grpName,
                lang:"fa",
                theme:"Enterprise Blue",
            })


            //orig
           // s.sqlQuery('INSERT INTO Users (ke,uid,details) VALUES (? ,?, ?)',[grpKey,newId,details])
            s.sqlQuery('INSERT INTO Users (ke,uid,grpuid,details) VALUES (? ,?,?,?)',[req.params.ke,newId,grpKey,details])
            s.tx({
                f: 'add_groups',
               // ke: '3',
                ke: req.params.ke,
                uid: newId,
                details: details
            },'ADM_'+req.params.ke)
            endData.user = {
               // ke: '3',
                ke: req.params.ke,
                uid: newId,
                details: s.parseJSON(details)
            }
        }else{
            endData.msg = user.lang['Fields cannot be empty']
        }
    if(endData.msg){
        res.end(s.prettyPrint(endData))
    }
    },res,req)
})
/**
 * API : Delete group
 */
app.all(config.webPaths.adminApiPrefix+':auth/groups/:ke/delete', function (req,res){

    s.auth(req.params,function(user){
        var endData = {
            ok : false
        }
        if(user.details.sub){
            endData.msg = user.lang['Not Permitted']
            s.closeJsonResponse(res,endData)
            return
        }
        var form = s.getPostData(req)

        var uid = req.body.uid

        s.sqlQuery('DELETE FROM Users WHERE uid=?',[uid])
        s.sqlQuery("SELECT * FROM API WHERE ke=? AND uid=?",[req.params.ke,uid],function(err,rows){
            if(rows && rows[0]){
                rows.forEach(function(row){
                    delete(s.api[row.code])
                })
                s.sqlQuery('DELETE FROM API WHERE uid=?',[uid])
            }
        })
        s.tx({
            f: 'delete_group',
            ke: '3',
            uid: uid,
        },'ADM_'+req.params.ke)
        endData.ok = true
        s.closeJsonResponse(res,endData)
    },res,req)
})

    /**
    * API : Administrator : Monitor : Add, Edit, and Delete
    */
    app.all([
        config.webPaths.apiPrefix+':auth/configureMonitor/:ke/:id',
        config.webPaths.apiPrefix+':auth/configureMonitor/:ke/:id/:f',
        config.webPaths.adminApiPrefix+':auth/configureMonitor/:ke/:id',
        config.webPaths.adminApiPrefix+':auth/configureMonitor/:ke/:id/:f'
    ], function (req,res){
        var endData = {
            ok: false
        }
        res.setHeader('Content-Type', 'application/json');
        s.auth(req.params,function(user){
            var hasRestrictions = user.details.sub && user.details.allmonitors !== '1'
            if(req.params.f !== 'delete'){
                var form = s.getPostData(req)
                if(!form){
                   endData.msg = user.lang.monitorEditText1;
                   res.end(s.prettyPrint(endData))
                   return
                }
                form.mid = req.params.id.replace(/[^\w\s]/gi,'').replace(/ /g,'')
                if(!user.details.sub ||
                   user.details.allmonitors === '1' ||
                   hasRestrictions && user.details.monitor_edit.indexOf(form.mid) >- 1 ||
                   hasRestrictions && user.details.monitor_create === '1'){
                        if(form && form.name){
                            s.checkDetails(form)
                            form.ke = req.params.ke
                            s.addOrEditMonitor(form,function(err,endData){
                                res.end(s.prettyPrint(endData))
                            },user)
                        }else{
                            endData.msg = user.lang.monitorEditText1;
                            res.end(s.prettyPrint(endData))
                        }
                }else{
                        endData.msg = user.lang['Not Permitted']
                        res.end(s.prettyPrint(endData))
                }
            }else{
                if(!user.details.sub || user.details.allmonitors === '1' || user.details.monitor_edit.indexOf(req.params.id) > -1 || hasRestrictions && user.details.monitor_create === '1'){
                    s.userLog(s.group[req.params.ke].mon_conf[req.params.id],{type:'Monitor Deleted',msg:'by user : '+user.uid});
                    req.params.delete=1;s.camera('stop',req.params);
                    s.tx({f:'monitor_delete',uid:user.uid,mid:req.params.id,ke:req.params.ke},'GRP_'+req.params.ke);
                    s.sqlQuery('DELETE FROM Monitors WHERE ke=? AND mid=?',[req.params.ke,req.params.id])
                    s.sqlQuery('DELETE FROM cleaningmonitors WHERE  mid=?',[req.params.id])
                    s.sqlQuery('DELETE FROM DesktopApp_camera WHERE  mid=?',[req.params.id])
                    if(req.query.deleteFiles === 'true'){
                        //videos
                        s.dir.addStorage.forEach(function(v,n){
                            var videosDir = v.path+req.params.ke+'/'+req.params.id+'/'
                            fs.stat(videosDir,function(err,stat){
                                if(!err){
                                    s.file('deleteFolder',videosDir)
                                }
                            })
                        })
                        var videosDir = s.dir.videos+req.params.ke+'/'+req.params.id+'/'
                        fs.stat(videosDir,function(err,stat){
                            if(!err){
                                s.file('deleteFolder',videosDir)
                            }
                        })
                        //fileBin
                        var binDir = s.dir.fileBin+req.params.ke+'/'+req.params.id+'/'
                        fs.stat(binDir,function(err,stat){
                            if(!err){
                                s.file('deleteFolder',binDir)
                            }
                        })
                    }
                    endData.ok=true;
                    endData.msg='Monitor Deleted by user : '+user.uid
                    res.end(s.prettyPrint(endData))
                }else{
                    endData.msg=user.lang['Not Permitted'];
                    res.end(s.prettyPrint(endData))
                }
            }
        },res,req)
    })
    /**
    * API : Add API Key, binded to the user who created it
    */
    app.all([
        config.webPaths.adminApiPrefix+':auth/api/:ke/add',
        config.webPaths.apiPrefix+':auth/api/:ke/add',
    ],function (req,res){
        var endData = {ok:false}
        res.setHeader('Content-Type', 'application/json');
        s.auth(req.params,function(user){
            var endData = {
                ok : false
            }
            var form = s.getPostData(req)
            if(form){
                var insert = {
                    ke : req.params.ke,
                    uid : user.uid,
                    code : s.gid(30),
                    ip : form.ip,
                    details : s.stringJSON(form.details)
                }
                var escapes = []
                Object.keys(insert).forEach(function(column){
                    escapes.push('?')
                });
                s.sqlQuery('INSERT INTO API ('+Object.keys(insert).join(',')+') VALUES ('+escapes.join(',')+')',Object.values(insert),function(err,r){
                    insert.time = s.formattedTime(new Date,'YYYY-DD-MM HH:mm:ss');
                    if(!err){
                        s.tx({
                            f: 'api_key_added',
                            uid: user.uid,
                            form: insert
                        },'GRP_' + req.params.ke)
                        endData.ok = true
                    }
                    endData.api = insert
                    s.closeJsonResponse(res,endData)
                })
            }else{
                endData.msg = lang.postDataBroken
                s.closeJsonResponse(res,endData)
            }
        },res,req)
    })
    /**
    * API : Delete API Key
    */
    app.all([
        config.webPaths.adminApiPrefix+':auth/api/:ke/delete',
        config.webPaths.apiPrefix+':auth/api/:ke/delete',
    ],function (req,res){
        var endData = {ok:false}
        res.setHeader('Content-Type', 'application/json');
        s.auth(req.params,function(user){
            var endData = {
                ok : false
            }
            var form = s.getPostData(req)
            if(form){
                if(!form.code){
                    s.tx({
                        f:'form_incomplete',
                        uid: user.uid,
                        form:'APIs'
                    },'GRP_' + req.params.ke)
                    endData.msg = lang.postDataBroken
                    s.closeJsonResponse(res,endData)
                    return
                }
                var row = {
                    ke : req.params.ke,
                    uid : user.uid,
                    code : form.code
                }
                var where = []
                Object.keys(row).forEach(function(column){
                    where.push(column+'=?')
                })
                s.sqlQuery('DELETE FROM API WHERE '+where.join(' AND '),Object.values(row),function(err,r){
                    if(!err){
                        s.tx({
                            f: 'api_key_deleted',
                            uid: user.uid,
                            form: row
                        },'GRP_' + req.params.ke)
                        endData.ok = true
                        delete(s.api[row.code])
                    }
                    s.closeJsonResponse(res,endData)
                })
            }else{
                endData.msg = lang.postDataBroken
                s.closeJsonResponse(res,endData)
            }
        },res,req)
    })
    /**
    * API : List API Keys for Authenticated user
    */
    app.get([
        config.webPaths.adminApiPrefix+':auth/api/:ke/list',
        config.webPaths.apiPrefix+':auth/api/:ke/list',
    ],function (req,res){
        var endData = {ok:false}
        res.setHeader('Content-Type', 'application/json');
        s.auth(req.params,function(user){
            var endData = {
                ok : false
            }
            var row = {
                ke : req.params.ke,
                uid : user.uid
            }
            var where = []
            Object.keys(row).forEach(function(column){
                where.push(column+'=?')
            })
            s.sqlQuery('SELECT * FROM API WHERE '+where.join(' AND '),Object.values(row),function(err,rows){
                if(rows && rows[0]){
                    rows.forEach(function(row){
                        row.details = JSON.parse(row.details)
                    })
                    endData.ok = true
                    endData.uid = user.uid
                    endData.ke = user.ke
                    endData.keys = rows
                }
                s.closeJsonResponse(res,endData)
            })
        },res,req)
    })
    /**
    * API : Administrator : Get Monitor State Presets List
    */
    app.all([
        config.webPaths.apiPrefix+':auth/monitorStates/:ke',
        config.webPaths.adminApiPrefix+':auth/monitorStates/:ke'
    ],function (req,res){
        s.auth(req.params,function(user){
            var endData = {
                ok : false
            }
            if(user.details.sub){
                endData.msg = user.lang['Not Permitted']
                s.closeJsonResponse(res,endData)
                return
            }
            s.sqlQuery("SELECT * FROM Presets WHERE ke=? AND type=?",[req.params.ke,'monitorStates'],function(err,presets){
                if(presets && presets[0]){
                    endData.ok = true
                    presets.forEach(function(preset){
                        preset.details = JSON.parse(preset.details)
                    })
                    endData.presets = presets
                }else{
                    endData.msg = user.lang['State Configuration Not Found']
                }
                s.closeJsonResponse(res,endData)
            })
        })
    })
    /**
    * API : Administrator : Change Group Preset. Currently affects Monitors only.
    */
    app.all([
        config.webPaths.apiPrefix+':auth/monitorStates/:ke/:stateName',
        config.webPaths.apiPrefix+':auth/monitorStates/:ke/:stateName/:action',
        config.webPaths.adminApiPrefix+':auth/monitorStates/:ke/:stateName',
        config.webPaths.adminApiPrefix+':auth/monitorStates/:ke/:stateName/:action',
    ],function (req,res){
        s.auth(req.params,function(user){
            var endData = {
                ok : false
            }
            if(user.details.sub){
                endData.msg = user.lang['Not Permitted']
                s.closeJsonResponse(res,endData)
                return
            }
            var presetQueryVals = [req.params.ke,'monitorStates',req.params.stateName]
            switch(req.params.action){
                case'insert':case'edit':
                    var form = s.getPostData(req)
                    s.checkDetails(form)
                    if(!form || !form.monitors){
                        endData.msg = user.lang['Form Data Not Found']
                        s.closeJsonResponse(res,endData)
                        return
                    }
                    s.findPreset(presetQueryVals,function(notFound,preset){
                        if(notFound === true){
                            endData.msg = lang["Inserted State Configuration"]
                            var details = {
                                monitors : form.monitors
                            }
                            var insertData = {
                                ke: req.params.ke,
                                name: req.params.stateName,
                                details: s.s(details),
                                type: 'monitorStates'
                            }
                            s.sqlQuery('INSERT INTO Presets ('+Object.keys(insertData).join(',')+') VALUES (?,?,?,?)',Object.values(insertData))
                            s.tx({
                                f: 'add_group_state',
                                details: details,
                                ke: req.params.ke,
                                name: req.params.stateName
                            },'GRP_'+req.params.ke)
                        }else{
                            endData.msg = lang["Edited State Configuration"]
                            var details = Object.assign(preset.details,{
                                monitors : form.monitors
                            })
                            s.sqlQuery('UPDATE Presets SET details=? WHERE ke=? AND name=?',[s.s(details),req.params.ke,req.params.stateName])
                            s.tx({
                                f: 'edit_group_state',
                                details: details,
                                ke: req.params.ke,
                                name: req.params.stateName
                            },'GRP_'+req.params.ke)
                        }
                        endData.ok = true
                        s.closeJsonResponse(res,endData)
                    })
                break;
                case'delete':
                    s.findPreset(presetQueryVals,function(notFound,preset){
                        if(notFound === true){
                            endData.msg = user.lang['State Configuration Not Found']
                            s.closeJsonResponse(res,endData)
                        }else{
                            s.sqlQuery('DELETE FROM Presets WHERE ke=? AND name=?',[req.params.ke,req.params.stateName],function(err){
                                if(!err){
                                    endData.msg = lang["Deleted State Configuration"]
                                    endData.ok = true
                                }
                                s.closeJsonResponse(res,endData)
                            })
                        }
                    })
                break;
                default://change monitors according to state
                    s.activateMonitorStates(req.params.ke,req.params.stateName,user,function(endData){
                        s.closeJsonResponse(res,endData)
                    })
                break;
            }
        },res,req)
    })

    /**
     * API : check users in groups exist
     */
    app.all(config.webPaths.adminApiPrefix+':auth/groupsCheck/:ke', function (req,res){
        s.auth(req.params,function(user){
            var endData = {
                ok : true
            }
            if(user.details.sub){
                endData.msg = user.lang['Not Permitted']
                s.closeJsonResponse(res,endData)
                return
            }
            var grpuidGet = s.getPostData(req)
            var mailList=[]
            s.sqlQuery("SELECT mail FROM Users WHERE ke=? AND grpuid=?",[req.params.ke,grpuidGet],function(err,rows){
                if(rows){
                    rows.forEach(function(row){
                        mailList.push(row.mail)
                    })
                    endData = mailList
                }else{
                    endData.msg = user.lang['No resault found']
                }
                s.closeJsonResponse(res,endData)
            })
        },res,req)
    })
    /**
     * API : Administrator : update USERS *(ako)
     */
    app.all(config.webPaths.adminApiPrefix+':auth/accounts/:ke/editUser', function (req,res){
        let fields=['grpuid','details','mail']
        let valuesInsert=[]
        let condition=[]
        s.auth(req.params,function(user){
            var endData = {
                ok : false
            }
            if(user.details.sub){
                endData.msg = user.lang['Not Permitted']
                s.closeJsonResponse(res,endData)
                return
            }
            var form = s.getPostData(req)
            var uid = form.userId || s.getPostData(req,'userId',false)
            var mail = form.mail || s.getPostData(req,'mail',false)
            var grpId = form.grpId || s.getPostData(req,'grpId',false)
            if(form.pass!=='' && form.pass_again !==''){
                if(form.pass===form.pass_again){
                    fields.push('pass')
                    fields.forEach(function(v){
                        condition.push(v+'=?')
                    })
                    valuesInsert.push(grpId,form.detailsUser,mail,s.createHash(form.pass),uid)
                }
            }else{
                fields.forEach(function(v){
                    condition.push(v+'=?')
                })
                valuesInsert.push(grpId,form.detailsUser,mail,uid)
            }
            if(form){
                let obj={ke:req.params.ke,mid:"$USER"}
                s.tameyeLog(obj,{type:user.lang.UserAccountMng,msg:'Account '+' : '+mail})
                s.sqlQuery("UPDATE Users SET "+condition.join(',')+" WHERE uid=? ",valuesInsert)
                //s.sqlQuery('UPDATE Users SET grpuid=? , details=?, mail=? WHERE  uid=?',[grpId,form.detailsUser,mail,uid])
                s.tx({
                    f: 'edit_Account_account',
                    ke: req.params.ke,
                    uid: uid,
                    mail: mail,
                    form: form
                },'ADM_'+req.params.ke)
                endData.ok = true
                s.sqlQuery("SELECT * FROM API WHERE ke=? AND uid=?",[req.params.ke,uid],function(err,rows){
                    if(rows && rows[0]){
                        rows.forEach(function(row){
                            delete(s.api[row.code])
                        })
                    }
                })
            }else{
                endData.msg = lang.postDataBroken
            }
            s.closeJsonResponse(res,endData)
        },res,req)
    })
}
