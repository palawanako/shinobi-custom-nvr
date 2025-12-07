$(document).ready(function(e){
//multi monitor manager
$.multimon={e:$('#multi_mon')};
$.multimon.table=$.multimon.e.find('.tableData tbody');
$.multimon.f=$.multimon.e.find('form');
$.multimon.f.on('change','#multimon_select_all',function(e){
    e.e=$(this);
    e.p=e.e.prop('checked')
    e.a=$.multimon.f.find('input[type=checkbox][name]')
    if(e.p===true){
        e.a.prop('checked',true)
    }else{
        e.a.prop('checked',false)
    }
})
    $("#showAtlas").on( "click", function() {
        $('#viewAtlas').removeClass( "hidAtlas" );
        $('.demo-layout').addClass( "hide-side" );
        $('#monitors_live').addClass( "hidAtlas" );
        $('#accbtn').toggleClass( "toggleDisplay" );
        $('.sidmenuLeft').toggleClass( "toggleDisplay" );
        $('.sidmenuLeft').css("display","none")
        $('#rightSide').toggleClass( "toggleDisplay" );
        $('.demo-drawer').hide();
        $('.mdl-layout--fixed-drawer').addClass("hide-side")
    });
    $("#CloseIfram").on( "click", function() {
        $('.mdl-layout--fixed-drawer').toggleClass("hide-side")
        $('#viewAtlas').addClass( "hidAtlas" );
        $('#monitors_live').removeClass( "hidAtlas" );
        $('.demo-layout').removeClass( "hide-side" );
        $('#accbtn').toggleClass( "toggleDisplay" );
        $('.sidmenuLeft').toggleClass( "toggleDisplay" );
        $('#rightSide').toggleClass( "toggleDisplay" );
        $('.demo-drawer').show();
    });
    $('.toggle-button').on('click',function () {
        $('.demo-drawer').hide()
        $('.sidmenuLeft').css("display","block")
        $('.mdl-layout--fixed-drawer').toggleClass("hide-side")

        // $('.demo-layout').toggleClass('hide-side')
        $('#main_canvas').removeClass('marginLeft-270')
    })
    $('.sidmenuLeft').on('click',function () {
        $('.demo-drawer').show()
        $(this).hide();
        $('.mdl-layout--fixed-drawer').toggleClass("hide-side")
        $('.sidmenuLeft').toggleClass( "toggleDisplay" );
        // $('.demo-layout').toggleClass('hide-side')
        $('#main_canvas').addClass('marginLeft-270')
    })
$.multimon.e.find('.import_config').click(function(){
  var e={};e.e=$(this);e.mid=e.e.parents('[mid]').attr('mid');
    $.confirm.e.modal('show');
    $.confirm.title.text(lang['Import Monitor Configuration'])
    e.html=lang.ImportMultiMonitorConfigurationText+'<div style="margin-top:15px"><div class="form-group"><textarea placeholder="'+lang['Paste JSON here.']+'" class="form-control"></textarea></div><label class="upload_file btn btn-primary btn-block"> Upload File <input class="upload" type=file name="files[]"></label></div>';
    $.confirm.body.html(e.html)
    $.confirm.e.find('.upload').change(function(e){
        var files = e.target.files; // FileList object
        f = files[0];
        var reader = new FileReader();
        reader.onload = function(ee) {
            $.confirm.e.find('textarea').val(ee.target.result);
        }
        reader.readAsText(f);
    });
    $.confirm.click({title:'Import',class:'btn-primary'},function(){
//        setTimeout(function(){
//            $.confirm.e.modal('show');
//        },1000)
//        $.confirm.title.text(lang['Are you sure?'])
//        $.confirm.body.html(lang.ImportMultiMonitorConfigurationText)
//        $.confirm.click({title:'Save Set',class:'btn-danger'},function(){
            try{
                var postMonitor = function(v){
                    $.post($.ccio.init('location',$user)+$user.auth_token+'/configureMonitor/'+$user.ke+'/'+v.mid,{data:JSON.stringify(v,null,3)},function(d){
                        $.ccio.log(d)
                    })
                }
                var parseZmMonitor = function(Monitor){
                    console.log(Monitor)
                    var newMon = $.aM.generateDefaultMonitorSettings()
                    newMon.details = JSON.parse(newMon.details)
                    newMon.details.stream_type = 'jpeg'
                    switch(Monitor.Type.toLowerCase()){
                        case'ffmpeg':case'libvlc':
                            newMon.details.auto_host_enable = '1'
                            newMon.details.auto_host = Monitor.Path
                            if(newMon.auto_host.indexOf('rtsp://') > -1 || newMon.auto_host.indexOf('rtmp://') > -1 || newMon.auto_host.indexOf('rtmps://') > -1){
                                newMon.type = 'h264'
                            }else{
                                $.ccio.init('note',{title:lang['Please Check Your Settings'],text:lang.migrateText1,type:'error'})
                            }
                        break;
                        case'local':
                            newMon.details.auto_host = Monitor.Device
                        break;
                        case'remote':

                        break;
                    }
                    newMon.details = JSON.stringify(newMon.details)
                    console.log(newMon)
                    return newMon
                }
                parsedData=JSON.parse($.confirm.e.find('textarea').val());
                //zoneminder one monitor
                if(parsedData.monitor){
                    $.aM.import({
                        values : parseZmMonitor(parsedData.monitor.Monitor)
                    })
                    $.aM.e.modal('show')
                }else
                //zoneminder multiple monitors
                if(parsedData.monitors){
                    $.each(parsedData.monitors,function(n,v){
                        $.aM.import({
                            values : parseZmMonitor(parsedData.Monitor)
                        })
                        parseZmMonitor(v.Monitor)
                    })
                }else
                //shinobi one monitor
                if(parsedData.mid){
                    postMonitor(parsedData)
                }else
                //shinobi multiple monitors
                if(parsedData[0] && parsedData[0].mid){
                    $.each(parsedData,function(n,v){
                        postMonitor(v)
                    })
                }
            }catch(err){
                $.ccio.log(err)
                $.ccio.init('note',{title:lang['Invalid JSON'],text:lang.InvalidJSONText,type:'error'})
            }
//        });
    });
})
$.multimon.getSelectedMonitors = function(unclean){
    var arr=[];
    if(unclean === true){
        var monitors = $.ccio.mon
    }else{
        var monitors = $.ccio.init('cleanMons','object')
    }
    $.each($.multimon.f.serializeObject(),function(n,v){
        arr.push(monitors[n])
    })
    return arr;
}
$.multimon.e.find('.delete').click(function(){
    var arr=$.multimon.getSelectedMonitors(true);
    if(arr.length===0){
        $.ccio.init('note',{title:lang['No_camera_selected'],text:lang['select_atleast_one'],type:'error'});
        return
    }
    $.confirm.e.modal('show');
    $.confirm.title.text(lang['Delete']+' '+lang['Monitors'])
    e.html='<p>'+lang.DeleteMonitorsText+'</p>';
    $.confirm.body.html(e.html)
    $.confirm.click([
        {
            title:'Delete Monitors',
            class:'btn-danger',
            callback:function(){
                $.each(arr,function(n,v){
                    $.get($.ccio.init('location',$user)+v.user.auth_token+'/configureMonitor/'+v.ke+'/'+v.mid+'/delete',function(data){
                        console.log(data)
                    })
                })
            }
        },
        {
            title:'Delete Monitors and Files',
            class:'btn-danger',
            callback:function(){
                $.each(arr,function(n,v){
                    $.get($.ccio.init('location',$user)+v.user.auth_token+'/configureMonitor/'+v.ke+'/'+v.mid+'/delete?deleteFiles=true',function(data){
                        console.log(data)
                    })
                })
            }
        }
    ]);
})


    //Ako set Mode
    $.multimon.e.find('.setMode').click(function(){
        var SelectedMode;
        var arr=$.multimon.getSelectedMonitors(true);
        if(arr.length===0){
            $.ccio.init('note',{title:lang['No_camera_selected'],text:lang['select_atleast_one'],type:'error'});
            return
        }
        $.confirm.e.modal('show');
        $.confirm.title.text(lang['Group_change_mode_camera'])
        e.html=`<div class="form-group" >
	<label><div><span>${lang['Select_mode_camera']}</span></div>
		<div><select class="form-control" id="ModeId" >
                     <option value="stop" selected >${lang['Disabled']}</option>
                     <option value="start" >${lang['Watch Only']}</option>
                     <option value="record" >${lang['Record']}</option>
               </select>
        </div>
	</label>
  </div>
`;
        $.confirm.body.html(e.html)

        SelectedMode = $('#ModeId').find(":selected").val();
        $.confirm.body.on('change','#ModeId',function(e){
            SelectedMode = $('#ModeId').find(":selected").val();
            e.e=$(this);
        })
        $.confirm.click([
            {
                title:lang['apply changes'],
                class:'btn-info',
                callback:function(){
                    $.each(arr,function(n,v){
                        $.get($.ccio.init('location',$user)+v.user.auth_token+'/monitor/'+v.ke+'/'+v.mid+'/'+SelectedMode,function(data){
                            console.log(data)
                        })
                    })
                }
            }
        ]);

    })
    
//$.multimon.e.find('.edit_all').click(function(){
//    var arr=$.multimon.getSelectedMonitors();
//    var arrObject={}
//    if(arr.length===0){
//        $.ccio.init('note',{title:'No Monitors Selected',text:'Select atleast one monitor to delete.',type:'error'});
//        return
//    }
//    $.multimonedit.selectedList = arr;
//    $.multimonedit.e.modal('show')
//})


//     for export json beauty i use BLOB instead dataset
//     get all selected monitor and change stringify and set to new obj blob
//     and create a link to download
    $.multimon.e.find('.save_config').click(function(){
        var e={};e.e=$(this);
        var arr=$.multimon.getSelectedMonitors();
        if(arr.length===0){
            $.ccio.init('note',{title:lang['No_camera_selected'],text:lang['select_atleast_one'],type:'error'});
            return
        }
        e.dataStrToJson=JSON.stringify(arr, undefined, 4)
        var blob = new Blob([e.dataStrToJson], {type: 'text/json'}),
            e    = document.createEvent('MouseEvents'),
            a    = document.createElement('a')
        a.download = 'TAMEYE_Monitors_'+(new Date())+'.json'
        a.href = window.URL.createObjectURL(blob)
        a.dataset.downloadurl =  ['text/json', a.download, a.href].join(':')
        e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
        a.dispatchEvent(e)
    })
    $.multimon.e.on('shown.bs.modal',function() {
        var tmp='';
        var i=1;
        function sanitizeIp(data){
            let ipData=data.split('.');
            ipData.forEach((value,i) => {
                if(parseInt(ipData[i])<10){
                    ipData[i]='00'+value;
                }else if(parseInt(ipData[i])>=10 && parseInt(ipData[i]) <100){
                    ipData[i]='0'+value;
                }else{
                    ipData[i]=value;
                }
            })
            return ipData.join('.');
        }
        function sanitizeRow(data){
            let rowData;
            if(parseInt(data)<10){
                rowData='00'+data;
            }else if(parseInt(data)>=10 && parseInt(data) <100){
                rowData='0'+data;
            }else{
                rowData=data;
            }
            return rowData;
        }

        $.each($.ccio.mon,function(n,v){
            var streamURL = $.ccio.init('streamURL',v)
            if(streamURL!=='Websocket'&&v.mode!==('idle'&&'stop')){
                streamURL='<a target="_blank" href="'+streamURL+'">'+streamURL+'</a>'
            }
            let camDetails=JSON.parse(v.details)
            tmp+='<tr mid="'+v.mid+'" ke="'+v.ke+'" auth="'+v.user.auth_token+'">'
            tmp+='<td><div class="checkbox"><input id="multimonCheck_'+v.ke+v.mid+v.user.auth_token+'" type="checkbox" name="'+v.ke+v.mid+v.user.auth_token+'" value="1"><label for="multimonCheck_'+v.ke+v.mid+v.user.auth_token+'"></label></div></td>'
            tmp+='<td sorttable_customkey='+sanitizeRow(i)+'><div class="row"><label >'+parseInt(i)+'</label></div></td>'
            tmp+='<td><a monitor="watch"><img class="small-square-img" src="/libs/snap/'+v.mid+'.png"></a></td>'
            if(camDetails.control==="1"){
                tmp+='<td><div class="ptz display-flx" ><div title="'+v.mode.trim()+'" class="tamLamp" style="margin:10px;"></div><img class="small-square-img" src="/libs/img/icon/ptz.png"></div></td>'
            }else{
                tmp+='<td><div class="dome display-flx" ><div title="'+v.mode.trim()+'" class="tamLamp" style="margin:10px;"></div><img  class="small-square-img" src="/libs/img/icon/dome.png"></div></td>'
            }
            tmp+='<td>'+v.name+'<br><small>'+v.mid+'</small></td>'
            tmp+='<td class="monitor_status">'+v.status+'</td>'
            tmp+='<td sorttable_customkey='+sanitizeIp(v.host)+'><a href="http://'+v.host+'" target="_blank">'+v.host+'</a></td>'


            //buttons
            var buttons = {
                "Pop": {
                    "label": "Pop",
                    "attr": "monitor=\"pop\"",
                    "class": "default",
                    "icon": "external-link"
                },
                "Calendar": {
                    "label": "Calendar",
                    "attr": "monitor=\"calendar\"",
                    "class": "default ",
                    "icon": "calendar"
                },
                "Power Viewer": {
                    "label": "Power Viewer",
                    "attr": "monitor=\"powerview\"",
                    "class": "default",
                    "icon": "bolt"
                },
                "Time-lapse": {
                    "label": "Time-lapse",
                    "attr": "monitor=\"timelapse\"",
                    "class": "default",
                    "icon": "angle-double-right"
                },
                "Videos List": {
                    "label": "Videos List",
                    "attr": "monitor=\"videos_table\"",
                    "class": "default",
                    "icon": "film"
                },
                "Monitor Settings": {
                    "label": "Monitor Settings",
                    "attr": "monitor=\"edit\"",
                    "class": "default",
                    "icon": "wrench"
                }
            }
            if(!$.ccio.permissionCheck('video_view',v.mid)){
                delete(buttons["Videos List"])
                delete(buttons["Time-lapse"])
                delete(buttons["Power Viewer"])
                delete(buttons["Calendar"])
            }
            if(!$.ccio.permissionCheck('monitor_edit',v.mid)){
                delete(buttons["Monitor Settings"])
            }
            tmp+='<td class="text-right">'
            $.each(buttons,function(n,v){
                // console.log(v)
                tmp+='<a id="currItem" class="btn btn-'+v.class+'" '+v.attr+' title="'+v.label+'"><i class="fa fa-'+v.icon+'"></i></a>'
            })
            tmp+='</td>'
            tmp+='</tr>'
            i++;

        })
        $.multimon.table.html(tmp)
    })
    //change color selected button
    $.multimon.f.on('click','#currItem',function(e){
        e.e=$(this)[0];
        e.e.classList.add("activeSelect")
    })

    //for export csv file
    //get id for fetch CSV
    $.multimon.getSelectedItem = function(){
        var arr=[];
        $('#checkboxes input[type=checkbox]').each(function() {
            if($(this).prop('checked') === true){
                if((jQuery.inArray( $(this).attr('name'), arr))=== -1){
                    arr.push($(this).attr('name'));
                }
            }
        });
        return arr;
    }
    $.multimon.e.find('.save_config_csv').click(function(){
        var e={};e.e=$(this);
        var arrayOfField=[];
        var arr=$.multimon.getSelectedMonitors();
        if(arr.length===0){
            $.ccio.init('note',{title:lang['No_camera_selected'],text:lang['select_atleast_one'],type:'error'});
            return
        }
        $.confirm.e.modal('show');
        $.confirm.title.text(lang['header_csv_modal'])
        e.html=`
    <div id="checkboxes">
    <div class="checkbox">
    <input id="chkbx_0" type="checkbox" name="dir" ><label for="chkbx_0">مسیر نگهداری</label>
    </div>
    <div class="checkbox">
    <input id="chkbx_1" type="checkbox" name="auto_host" ><label for="chkbx_1">مسیر کامل</label>
    </div>
    <div class="checkbox">
    <input id="chkbx_2" type="checkbox" name="max_keep_days" ><label for="chkbx_2">تعداد روزهای نگهداری</label>
    </div>
    <div class="checkbox">
    <input id="chkbx_3" type="checkbox" name="fatal_max" ><label for="chkbx_3">تعداد تلاش مجدد</label>
    </div>
    <div class="checkbox">
    <input id="chkbx_4" type="checkbox" name="skip_ping" ><label for="chkbx_4">عدم توجه به پینگ</label>
    </div>
    <div class="checkbox">
    <input id="chkbx_5" type="checkbox" name="is_onvif" ><label for="chkbx_5">onvif</label>
    </div>
    <div class="checkbox">
    <input id="chkbx_6" type="checkbox" name="sfps" ><label for="chkbx_6">تعداد فریم های ورودی</label>
    </div>
    <div class="checkbox">
    <input id="chkbx_7" type="checkbox" name="stream_type" ><label for="chkbx_7">نوع جریان ورودی</label>
    </div>
    <div class="checkbox">
    <input id="chkbx_8" type="checkbox" name="fulladdress" ><label for="chkbx_8">آدرس استریم دوم</label>
    </div>
    
    </div>
   
</div>
    `;
        $.confirm.body.html(e.html)
        var tempArrayDetails=[];
        var allowFields=[];
        $.confirm.body.on('change',function(e){
            console.log('change all')
            allowFields=$.multimon.getSelectedItem();

        })
        $.confirm.click([
            {
                title:'دریافت خروجی',
                class:'btn-info',
                callback:function(){
                    // listFields.push(tempArray2);
                    allowFields.push('host','mid','mode','path');
                    console.log(allowFields)
                       arr.map( obj => {
                        let inputMap;
                        let inStrUrl=[];
                        const details = JSON.parse(obj.details);
                        if(details.input_maps){
                            if(Array.isArray(details.input_maps)){
                                inStrUrl=details.input_maps[0].fulladdress;
                            }else{
                                inputMap = JSON.parse(details.input_maps);
                                inStrUrl = inputMap.map(mapAddress =>{
                                    return mapAddress.fulladdress
                                })
                            }
                        }
                        else{
                            inStrUrl=[];
                        }

                        const final = {
                            "host" : obj.host,
                            "mid" : obj.mid,
                            "mode" : obj.mode,
                            "path" : obj.path,
                            "dir" : details.dir,
                            "auto_host" : details.auto_host,
                            "max_keep_days" : details.max_keep_days,
                            "skip_ping" : details.skip_ping,
                            "is_onvif" : details.is_onvif,
                            "sfps" : details.sfps,
                            "fatal_max" : details.fatal_max,
                            "stream_type" : details.stream_type,
                            "fulladdress" : inStrUrl,
                        }
                        Object.keys(final).forEach((key) => allowFields.includes(key) || delete final[key]);
                        // console.log(final);
                        arrayOfField.push(final);
                    })
                    var JSONData=arrayOfField;
                    var ReportTitle='TamEyeExport';
                    var ShowLabel=true;
                    var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
                    var CSV = '';
                    if (ShowLabel) {
                        var row = "";

                        for (var index in arrData[0]) {
                            row += index + ',';
                        }
                        row = row.slice(0, -1);
                        CSV += row + '\r\n';
                    }

                    for (var i = 0; i < arrData.length; i++) {
                        var row = "";
                        for (var index in arrData[i]) {
                            row += '"' + arrData[i][index] + '",';
                        }
                        row.slice(0, row.length - 1);
                        CSV += row + '\r\n';
                    }

                    if (CSV == '') {
                        alert("Invalid data");
                        return;
                    }
                    var fileName = "MyReport_"+(new Date());
                    fileName += ReportTitle.replace(/ /g,"_");
                    var uri = 'data:text/csv;meta charset=UTF-8;encoding=UTF-8,' + escape(CSV);
                    var link = document.createElement("a");
                    link.href = uri;
                    link.style = "visibility:hidden";
                    link.download = fileName + ".csv";
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }
            }
        ]);
    })
})
