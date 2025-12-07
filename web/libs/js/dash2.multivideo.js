$(document).ready(function(e){

    //Timelapse Window
    $.timelapse1={e:$('#timelapse1')}
    $.timelapse2={e:$('#timelapse1')}
    $.timelapse3={e:$('#timelapse1')}
    $.timelapse4={e:$('#timelapse1')}
    $.timelapseAll={e:$('#timelapse1')}


    $.timelapse1.f=$.timelapse1.e.find('#form1')
    $.timelapse1.line=$('#timelapse_video_line1'),
    $.timelapse1.display=$('#timelapse_video_display1'),
        $.timelapse1.dr=$('#timelapse_daterange1'),
        $.timelapse1.monitors1=$.timelapse1.e.find('.monitors_list');

    $.timelapse2.f=$.timelapse2.e.find('#form2')
    $.timelapse2.line=$('#timelapse_video_line2'),
        $.timelapse2.display=$('#timelapse_video_display2'),
        $.timelapse2.dr=$('#timelapse_daterange2'),
        $.timelapse2.monitors2=$.timelapse2.e.find('.monitors_list2');

    $.timelapse3.f=$.timelapse3.e.find('#form3')
     $.timelapse3.line=$('#timelapse_video_line3'),
     $.timelapse3.display=$('#timelapse_video_display3'),
  $.timelapse3.dr=$('#timelapse_daterange3'),
        $.timelapse1.mL=$.timelapse1.e.find('.motion_list'),
        $.timelapse3.monitors3=$.timelapse3.e.find('.monitors_list3');

    $.timelapse4.f=$.timelapse4.e.find('#form4')
    $.timelapse4.line=$('#timelapse_video_line4'),
        $.timelapse4.display=$('#timelapse_video_display4'),
        $.timelapse4.dr=$('#timelapse_daterange4'),
        $.timelapse4.monitors4=$.timelapse4.e.find('.monitors_list4');

    $.timelapseAll.dr=$('#timelapse_daterangeAll');
    $.timelapseAll.f=$.timelapseAll.e.find('#formAll')

    $.timelapseAll.dr.daterangepicker({
        startDate:$.ccio.timeObject().subtract(moment.duration("24:00:00")),
        endDate:$.ccio.timeObject().add(moment.duration("00:00:00")),
        timePicker: true,
        timePicker24Hour: true,
        timePickerSeconds: true,
        timePickerIncrement: 30,
        locale: {
            format: 'jMM/jDD/jYYYY h:mm A'
        },
        opens: 'right',
        jalaali: true,

    },function(start, end, label){
        $.timelapseAll.f.submit()
    });
    $.timelapseAll.f.find('input').submit(function(){
        $.timelapseAll.f.submit()
    })
    $.timelapseAll.f.submit(function(e){
        console.log('22 ALL cal')
        e.preventDefault();
        $.timelapse1.drawTimeline()
        e.dateRange=$.timelapseAll.dr.data('daterangepicker');
        $.timelapse1.dr.daterangepicker({
            startDate:e.dateRange.startDate,
            endDate:e.dateRange.endDate,
            timePicker: true,
            timePicker24Hour: true,
            timePickerSeconds: true,
            timePickerIncrement: 30,
            locale: {
                format: 'jMM/jDD/jYYYY h:mm A'
            },
            opens: 'right',
            jalaali: true,
        },function(start, end, label){
            $.timelapse1.f.submit()
        })

        $.timelapse2.drawTimeline2()
        $.timelapse2.dr.daterangepicker({
            startDate:e.dateRange.startDate,
            endDate:e.dateRange.endDate,
            timePicker: true,
            timePicker24Hour: true,
            timePickerSeconds: true,
            timePickerIncrement: 30,
            locale: {
                format: 'jMM/jDD/jYYYY h:mm A'
            },
            opens: 'right',
            jalaali: true,
        },function(start, end, label){
            $.timelapse2.f.submit()
        })

        $.timelapse3.drawTimeline3()
        $.timelapse3.dr.daterangepicker({
            startDate:e.dateRange.startDate,
            endDate:e.dateRange.endDate,
            timePicker: true,
            timePicker24Hour: true,
            timePickerSeconds: true,
            timePickerIncrement: 30,
            locale: {
                format: 'jMM/jDD/jYYYY h:mm A'
            },
            opens: 'right',
            jalaali: true,
        },function(start, end, label){
            $.timelapse3.f.submit()
        })
        $.timelapse4.drawTimeline4()
        $.timelapse4.dr.daterangepicker({
            startDate:e.dateRange.startDate,
            endDate:e.dateRange.endDate,
            timePicker: true,
            timePicker24Hour: true,
            timePickerSeconds: true,
            timePickerIncrement: 30,
            locale: {
                format: 'jMM/jDD/jYYYY h:mm A'
            },
            opens: 'right',
            jalaali: true,
        },function(start, end, label){
            $.timelapse4.f.submit()
        })
        return false;
    })
    const player1 = new Plyr('#myplayer');
    const player2 = new Plyr('#myplayer2');
    const player3 = new Plyr('#myplayer3');
    const player4 = new Plyr('#myplayer4');

    /*********************************1****/
    $.timelapse1.dr.daterangepicker({
        startDate:$.ccio.timeObject().subtract(moment.duration("24:00:00")),
        endDate:$.ccio.timeObject().add(moment.duration("00:00:00")),
        timePicker: true,
        timePicker24Hour: true,
        timePickerSeconds: true,
        timePickerIncrement: 30,
        locale: {
            format: 'jMM/jDD/jYYYY h:mm A'
        },
        opens: 'right',
        jalaali: true,

    },function(start, end, label){
        console.log('111111111111111111')
        $.timelapse1.drawTimeline()
        $.timelapse1.dr.focus()
    });
    $.timelapse1.f.find('select').change(function(){
        $.timelapse1.f.submit()
    })
    $.timelapse1.f.submit(function(e){
        e.preventDefault();
        $.timelapse1.drawTimeline()

        return false;
    })
    $.timelapse1.drawTimeline=function(getData){
        var e={};
        if(getData===undefined){getData=true}
        var mid = $.timelapse1.monitors1.val()
        e.dateRange=$.timelapse1.dr.data('daterangepicker');

        e.dateRange={startDate:e.dateRange.startDate,endDate:e.dateRange.endDate}
        e.videoURL=$.ccio.init('location',$user)+$user.auth_token+'/videos/'+$user.ke+'/'+mid;

        e.videoURL+='?limit=100&start='+$.ccio.init('th',e.dateRange.startDate)+'&end='+$.ccio.init('th',e.dateRange.endDate);

        e.next=function(videos){
            $.timelapse1.currentVideos={}
            e.tmp=''
            $.each(videos.videos,function(n,v){
                if(!v||!v.time){return}
                v.videoBefore=videos.videos[n-1];
                v.videoAfter=videos.videos[n+1];
                v.position=n;
                $.timelapse1.currentVideos[v.filename]=v;
                e.tmp+='<li data-id="'+n+'" data-video-id="'+v.href+'">'
                e.tmp+='<span>file</span>'
                e.tmp+='</li>'
            })
            $.timelapse1.line.html(e.tmp)
            $.ccio.init('ls')
            if(getData===true){
                e.timeout=50
            }else{
                e.timeout=2000
            }

        }
        if(getData===true){

           setTimeout(function () {
               var playlist = document.querySelector('.playlist');
               var videos = playlist.querySelectorAll('#timelapse_video_line1 li');
               var i;
               var active = null;
               let a1=document.querySelector('#mp1');
               let pl1=a1.querySelectorAll('.plyr');

               for(i = 0; i < videos.length; i++) {
                   videos[i].onclick = changeVideo;
               }

               setSource( getId(videos[0]),buildSource(videos[0]) );

               pl1[0].addEventListener('ended', nextSong);

               function changeVideo(e) {
                   setSource( getId(e.target), buildSource(e.target), true );
               }

               function buildSource(el) {
                   var obj = [{
                       src: el.getAttribute('data-video-id'),
                       type: 'video/mp4'
                   }];

                   return obj;
               }
               function getId(el) {
                   return Number(el.getAttribute('data-id'));
               }


               function setSource(selected, videoId, play) {
                   if(active !== selected) {
                       active = selected;
                       player1.source={
                           type: 'video',
                           title: 'video title',
                           sources: videoId
                       };

                       for(var i = 0; i < videos.length; i++) {
                           if(Number(videos[i].getAttribute('data-id')) === selected) {
                               videos[i].className = 'active';
                           } else {
                               videos[i].className = '';
                           }
                       }

                       if(play) {
                           player1.play();
                       }
                   } else {
                       player1.togglePlay();

                   }
               }

               function nextSong(e) {
                   var next = active + 1;
                   if(next < videos.length) {
                       setSource( getId(videos[next]), buildSource(videos[next]), true );
                   }
               }

           },1000)
            $.getJSON(e.videoURL,function(videos){
                videos.videos=videos.videos.reverse()
                $.timelapse1.currentVideosArray=videos
                e.next(videos)
            })
        }else{
            e.next($.timelapse1.currentVideosArray)
        }
    }


    $.timelapse2.dr.daterangepicker({
        startDate:$.ccio.timeObject().subtract(moment.duration("24:00:00")),
        endDate:$.ccio.timeObject().add(moment.duration("00:00:00")),
        timePicker: true,
        timePicker24Hour: true,
        timePickerSeconds: true,
        timePickerIncrement: 30,
        locale: {
            format: 'jMM/jDD/jYYYY h:mm A'
        },
        opens: 'right',
        jalaali: true,

    },function(start, end, label){
        $.timelapse2.f.submit()
        $.timelapse2.dr.focus()
    });
    $.timelapse2.f.find('select').change(function(){
        $.timelapse2.f.submit()
    })
    $.timelapse2.f.submit(function(e){
        e.preventDefault();
        $.timelapse2.drawTimeline2()

        return false;
    })
    $.timelapse2.drawTimeline2=function(getData){
        var e={};
        if(getData===undefined){getData=true}
        var mid = $.timelapse2.monitors2.val()
        e.dateRange=$.timelapse2.dr.data('daterangepicker');

        e.dateRange={startDate:e.dateRange.startDate,endDate:e.dateRange.endDate}
        e.videoURL=$.ccio.init('location',$user)+$user.auth_token+'/videos/'+$user.ke+'/'+mid;

        e.videoURL+='?limit=100&start='+$.ccio.init('th',e.dateRange.startDate)+'&end='+$.ccio.init('th',e.dateRange.endDate);
        e.next=function(videos){
            $.timelapse2.currentVideos={}
            e.tmp=''
            $.each(videos.videos,function(n,v){
                if(!v||!v.time){return}
                v.videoBefore=videos.videos[n-1];
                v.videoAfter=videos.videos[n+1];
                v.position=n;
                $.timelapse2.currentVideos[v.filename]=v;
                // e.tmp+='<li class="glM'+v.mid+$user.auth_token+' list-group-item timelapse_video flex-block" timelapse2="video" file="'+v.filename+'" href="'+v.href+'" mid="'+v.mid+'" ke="'+v.ke+'" auth="'+$user.auth_token+'">'
                e.tmp+='<li data-id="'+n+'" data-video-id="'+v.href+'">'
                e.tmp+='<span>file2</span>'
                e.tmp+='</li>'
            })
            $.timelapse2.line.html(e.tmp)
            $.ccio.init('ls')
            if(getData===true){
                e.timeout=50
            }else{
                e.timeout=2000
            }
            /*setTimeout(function(){
                if($.timelapse2.e.find('.timelapse_video.active').length===0){
                    $.timelapse2.e.find('[timelapse2="video"]').first().click()

                }
            },e.timeout)*/
        }
        if(getData===true){

            setTimeout(function () {
                var playlist = document.querySelector('.playlist2');
                var videos = playlist.querySelectorAll('#timelapse_video_line2 li');
                var i;
                var active = null;
                let a2=document.querySelector('#mp2');
                let pl2=a2.querySelectorAll('.plyr');

                for(i = 0; i < videos.length; i++) {
                    videos[i].onclick = changeVideo;
                }

                setSource( getId(videos[0]),buildSource(videos[0]) );

                pl2[0].addEventListener('ended', nextSong);

                function changeVideo(e) {
                    setSource( getId(e.target), buildSource(e.target), true );
                }

                function buildSource(el) {
                    var obj = [{
                        src: el.getAttribute('data-video-id'),
                        type: 'video/mp4'
                    }];

                    return obj;
                }
                function getId(el) {
                    return Number(el.getAttribute('data-id'));
                }


                function setSource(selected, videoId, play) {
                    if(active !== selected) {
                        active = selected;
                        player2.source={
                            type: 'video',
                            title: 'video title',
                            sources: videoId
                        };

                        for(var i = 0; i < videos.length; i++) {
                            if(Number(videos[i].getAttribute('data-id')) === selected) {
                                videos[i].className = 'active';
                            } else {
                                videos[i].className = '';
                            }
                        }

                        if(play) {
                            player2.play();
                        }
                    } else {
                        player2.togglePlay();

                    }
                }

                function nextSong(e) {
                    var next = active + 1;
                    if(next < videos.length) {
                        setSource( getId(videos[next]), buildSource(videos[next]), true );
                    }
                }

            },1000)
            $.getJSON(e.videoURL,function(videos){
                videos.videos=videos.videos.reverse()
                $.timelapse2.currentVideosArray=videos
                e.next(videos)
            })
        }else{
            e.next($.timelapse2.currentVideosArray)
        }
    }



    /*********************************3**********************/
    $.timelapse3.dr.daterangepicker({
        startDate:$.ccio.timeObject().subtract(moment.duration("24:00:00")),
        endDate:$.ccio.timeObject().add(moment.duration("00:00:00")),
        timePicker: true,
        timePicker24Hour: true,
        timePickerSeconds: true,
        timePickerIncrement: 30,
        locale: {
            format: 'jMM/jDD/jYYYY h:mm A'
        },
        opens: 'right',
        jalaali: true,

    },function(start, end, label){
        $.timelapse3.f.submit()
        // $.timelapse3.drawTimeline3()
        // $.timelapse3.dr.focus()
    });
    $.timelapse3.f.find('select').change(function(){
        $.timelapse3.f.submit()
    })
    $.timelapse3.f.submit(function(e){
        e.preventDefault();
        $.timelapse3.drawTimeline3()

        return false;
    })
    $.timelapse3.drawTimeline3=function(getData){
        var e={};
        if(getData===undefined){getData=true}
        var mid = $.timelapse3.monitors3.val()
        e.dateRange=$.timelapse3.dr.data('daterangepicker');

        e.dateRange={startDate:e.dateRange.startDate,endDate:e.dateRange.endDate}
        e.videoURL=$.ccio.init('location',$user)+$user.auth_token+'/videos/'+$user.ke+'/'+mid;

        e.videoURL+='?limit=100&start='+$.ccio.init('th',e.dateRange.startDate)+'&end='+$.ccio.init('th',e.dateRange.endDate);
        e.next=function(videos){
            $.timelapse3.currentVideos={}
            e.tmp=''
            $.each(videos.videos,function(n,v){
                if(!v||!v.time){return}
                v.videoBefore=videos.videos[n-1];
                v.videoAfter=videos.videos[n+1];
                v.position=n;
                $.timelapse3.currentVideos[v.filename]=v;
                e.tmp+='<li data-id="'+n+'" data-video-id="'+v.href+'">'
                e.tmp+='<span>file</span>'
                e.tmp+='</li>'
            })
            $.timelapse3.line.html(e.tmp)
            $.ccio.init('ls')
            if(getData===true){
                e.timeout=50
            }else{
                e.timeout=2000
            }

        }
        if(getData===true){

            setTimeout(function () {
                var playlist = document.querySelector('.playlist3');
                var videos = playlist.querySelectorAll('#timelapse_video_line3 li');
                var i;
                var active = null;
                let a1=document.querySelector('#mp3');
                let pl1=a1.querySelectorAll('.plyr');

                for(i = 0; i < videos.length; i++) {
                    videos[i].onclick = changeVideo;
                }

                setSource( getId(videos[0]),buildSource(videos[0]) );

                pl1[0].addEventListener('ended', nextSong);

                function changeVideo(e) {
                    setSource( getId(e.target), buildSource(e.target), true );
                }

                function buildSource(el) {
                    var obj = [{
                        src: el.getAttribute('data-video-id'),
                        type: 'video/mp4'
                    }];

                    return obj;
                }
                function getId(el) {
                    return Number(el.getAttribute('data-id'));
                }


                function setSource(selected, videoId, play) {
                    if(active !== selected) {
                        active = selected;
                        player3.source={
                            type: 'video',
                            title: 'video title',
                            sources: videoId
                        };

                        for(var i = 0; i < videos.length; i++) {
                            if(Number(videos[i].getAttribute('data-id')) === selected) {
                                videos[i].className = 'active';
                            } else {
                                videos[i].className = '';
                            }
                        }

                        if(play) {
                            player3.play();
                        }
                    } else {
                        player3.togglePlay();

                    }
                }

                function nextSong(e) {
                    var next = active + 1;
                    if(next < videos.length) {
                        setSource( getId(videos[next]), buildSource(videos[next]), true );
                    }
                }

            },1000)
            $.getJSON(e.videoURL,function(videos){
                videos.videos=videos.videos.reverse()
                $.timelapse3.currentVideosArray=videos
                e.next(videos)
            })
        }else{
            e.next($.timelapse3.currentVideosArray)
        }
    }
    /*********************************33**********************/
    /*********************************4**********************/
    $.timelapse4.dr.daterangepicker({
        startDate:$.ccio.timeObject().subtract(moment.duration("24:00:00")),
        endDate:$.ccio.timeObject().add(moment.duration("00:00:00")),
        timePicker: true,
        timePicker24Hour: true,
        timePickerSeconds: true,
        timePickerIncrement: 30,
        locale: {
            format: 'jMM/jDD/jYYYY h:mm A'
        },
        opens: 'right',
        jalaali: true,

    },function(start, end, label){
        $.timelapse4.f.submit()
        // $.timelapse4.drawTimeline4()
        // $.timelapse4.dr.focus()
    });
    $.timelapse4.f.find('select').change(function(){
        $.timelapse4.f.submit()
    })
    $.timelapse4.f.submit(function(e){
        e.preventDefault();
        $.timelapse4.drawTimeline4()

        return false;
    })
    $.timelapse4.drawTimeline4=function(getData){
        var e={};
        if(getData===undefined){getData=true}
        var mid = $.timelapse4.monitors4.val()
        e.dateRange=$.timelapse4.dr.data('daterangepicker');

        e.dateRange={startDate:e.dateRange.startDate,endDate:e.dateRange.endDate}
        e.videoURL=$.ccio.init('location',$user)+$user.auth_token+'/videos/'+$user.ke+'/'+mid;

        e.videoURL+='?limit=100&start='+$.ccio.init('th',e.dateRange.startDate)+'&end='+$.ccio.init('th',e.dateRange.endDate);
        e.next=function(videos){
            $.timelapse4.currentVideos={}
            e.tmp=''
            $.each(videos.videos,function(n,v){
                if(!v||!v.time){return}
                v.videoBefore=videos.videos[n-1];
                v.videoAfter=videos.videos[n+1];
                v.position=n;
                $.timelapse4.currentVideos[v.filename]=v;
                e.tmp+='<li data-id="'+n+'" data-video-id="'+v.href+'">'
                e.tmp+='<span>file</span>'
                e.tmp+='</li>'
            })
            $.timelapse4.line.html(e.tmp)
            $.ccio.init('ls')
            if(getData===true){
                e.timeout=50
            }else{
                e.timeout=2000
            }

        }
        if(getData===true){

            setTimeout(function () {
                var playlist = document.querySelector('.playlist4');
                var videos = playlist.querySelectorAll('#timelapse_video_line4 li');
                var i;
                var active = null;
                let a1=document.querySelector('#mp4');
                let pl1=a1.querySelectorAll('.plyr');

                for(i = 0; i < videos.length; i++) {
                    videos[i].onclick = changeVideo;
                }

                setSource( getId(videos[0]),buildSource(videos[0]) );

                pl1[0].addEventListener('ended', nextSong);

                function changeVideo(e) {
                    setSource( getId(e.target), buildSource(e.target), true );
                }

                function buildSource(el) {
                    var obj = [{
                        src: el.getAttribute('data-video-id'),
                        type: 'video/mp4'
                    }];

                    return obj;
                }
                function getId(el) {
                    return Number(el.getAttribute('data-id'));
                }

                function setSource(selected, videoId, play) {
                    if(active !== selected) {
                        active = selected;
                        player4.source={
                            type: 'video',
                            title: 'video title',
                            sources: videoId
                        };

                        for(var i = 0; i < videos.length; i++) {
                            if(Number(videos[i].getAttribute('data-id')) === selected) {
                                videos[i].className = 'active';
                            } else {
                                videos[i].className = '';
                            }
                        }

                        if(play) {
                            player4.play();
                        }
                    } else {
                        player4.togglePlay();

                    }
                }
                function nextSong(e) {
                    var next = active + 1;
                    if(next < videos.length) {
                        setSource( getId(videos[next]), buildSource(videos[next]), true );
                    }
                }
            },1000)
            $.getJSON(e.videoURL,function(videos){
                videos.videos=videos.videos.reverse()
                $.timelapse4.currentVideosArray=videos
                e.next(videos)
            })
        }else{
            e.next($.timelapse4.currentVideosArray)
        }
    }
    /*********************************44**********************/
    $.timelapse1.e.on('hidden.bs.modal',function(e){
        console.log('_PUSE_____')
        delete($.timelapse1.currentVideos)
        delete($.timelapse1.currentVideosArray)
//window.location.reload(false);
        player1.pause();
        player2.pause();
        player3.pause();
        player4.pause();

    })
})
