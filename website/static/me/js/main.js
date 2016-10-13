$(document).ready(function() {  
  
    /* ------------------------------------------------------
     * Mobile Menu
     * ------------------------------------------------------ */
   var toggleButton = $('.menu-toggle'),
       nav = $('#menu-nav-wrap'),
       siteBody = $('body'),
       mainContents = $('#main-content-wrap, header');

    // open-close menu by clicking on the menu icon
    // toggleButton.on('click', function(e){

        // e.preventDefault();

        toggleButton.toggleClass('is-clicked');
        siteBody.toggleClass('menu-is-open').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
            // firefox transitions break when parent overflow is changed, 
            // so we need to wait for the end of the trasition to give the body an overflow hidden
            siteBody.toggleClass('overflow-hidden');
        });
            
        // check if transitions are not supported 
        if ($('html').hasClass('no-csstransitions')) {
             siteBody.toggleClass('overflow-hidden');
        }

    // });

    // close menu clicking outside the menu itself
    mainContents.on('click', function(e){

        if( !$(e.target).is('.menu-toggle, .menu-toggle span') ) {

            toggleButton.removeClass('is-clicked');
            siteBody.removeClass('menu-is-open').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
                siteBody.removeClass('overflow-hidden');
            });
            
            // check if transitions are not supported
            if ($('html').hasClass('no-csstransitions')) {
                 siteBody.removeClass('overflow-hidden');
            }
        }

    });


     //tab 切换
    function showTag(tagNo){
        for(var i=1; i<=3; i++){
            $("#div"+i).hide();
            $("#tag"+i).removeClass('tab-active');
        }
        var tag=$("#tag"+tagNo);
        tag.addClass('tab-active');
        var tagContent=$("#div"+tagNo);
        tagContent.show();
    }

    $('.tags').on('click', function(e) {
        var target = e.target;
        if (target.id === 'tag1' || $(target).parent().attr('id') === 'tag1') {
            showTag(1);
        } else if (target.id === 'tag2' || $(target).parent().attr('id') === 'tag2') {
            showTag(2);
        } else if (target.id === 'tag3' || $(target).parent().attr('id') === 'tag3') {
            showTag(3);
        }
    });

    $('.show-search-left li').on('click', function() {
        $(this).siblings().removeClass('active-li');
        $(this).addClass('active-li');

    });

    var teamId = null;
    

    // var pn = '';
    // var no = '';
    // var Location = '';

    // $.when(
        //获取队员信息
        $.ajax({
            // url: '/imap 2/src/php/getTeamInfo.php',
            url: 'http://www.sjtuimap.com/Interface/getTeamInfo.php',
            type: 'GET',
            success: function(data) {
                $('.team-table').html(juicer($('#team-info-tpl').html(), {data: data.MyTeam}));
                teamId = data.MyTeam.teamID;

                //删除member
                $('.J_del_member').on('click', function(e) {
                    var memberId = $(e.target).parent().siblings('.J_member_id').html();
                    $.ajax({
                        // url: '/imap 2/src/php/getTeamInfo.php',
                        url: 'http://www.sjtuimap.com/Interface/operateOneMember.php',
                        type: 'get',
                        data: {
                            userId: memberId,
                            type: 'delete'
                        },
                        success: function(data) {
                            data = JSON.parse(data);
                            if (data.status === 'ok') {
                                alert('删除成功');
                                location.reload();
                            }
                        }
                    })
                })

                $('.file').on('change', function() {
                    $('.submit').click();
                });


                $('.submit').on('click', function(){
                    setTimeout(function() {
                        location.reload();
                    }, 2000)

                });


                 $('.edit-member').on('click', function(e) {
                    // $(e).attr({
                    //     'data-toggle': "modal", 
                    //     'data-target': "#memberEdit"
                    // });
                    var person_ID = $(this).parent().siblings('.J_member_id').html();
                    var name = $(this).parent().siblings('.member-name').html();
                    $('.J_new_name').val(name);

                    $("#memberEdit").modal();

                    $('.J_member_edit').on('click', function(e) {
                        // var 

                        var newName = $('.J_new_name').val();

                        if (name === '' ) {
                            alert('请完善表单信息');
                            return;
                        }

                        $.ajax({
                            // url: '/imap 2/src/php/getTeamInfo.php',
                            url: 'http://www.sjtuimap.com/Interface/operateOneMember.php',
                            type: 'get',
                            data: {
                                type: 'update',
                                name: newName,
                                person_ID: person_ID
                            },
                            success: function(data) {
                                $(e.target).attr('data-dismiss', 'modal');

                                data = JSON.parse(data);
                                if (data.status === 'ok') {
                                    location.reload();
                                }
                
                                // console
                                // $('.task-table tbody').html(juicer($('#task-tpl').html(), {data: JSON.parse(data)}));
                                // console.log('success')
                            }
                        });
                   });
               });
            }
        }).then(function() {
            teamId = teamId;
            //获取task信息
            $.ajax({
                // url: '/imap 2/src/php/getTeamInfo.php',
                url: 'http://www.sjtuimap.com/Interface/getTask.php',
                type: 'post',
                data: {
                    team_ID: teamId
                },
                success: function(data) {
                    // console
                    $('.task-table tbody').html(juicer($('#task-tpl').html(), {data: JSON.parse(data)}));

                    var participants = $('.task-group').html();
                    var particiArr = (participants && participants.split(',')) || [];
                    var particiHtml = '<li>';
                    for (var i = 0;i < particiArr.length; i ++) {
                        particiHtml += particiArr[i] + '</li><li>';
                    }
                    $('#myModal .show-search-left ul').html(particiHtml);

                    $('.edit-task').on('click', function() {
                        var participants = $(this).parent().siblings('.task-group').html();
                        var particiArr = participants.split(',') || [];
                        var particiHtml = '<li>';
                        for (var i = 0;i < particiArr.length; i ++) {
                            particiHtml += particiArr[i] + '</li><li>';
                        }
                        $('#editTask .show-search-left ul').html(particiHtml);

                        $('.show-search-left li').on('click', function() {
                            $(this).siblings().removeClass('active-li');
                            $(this).addClass('active-li');
                        });

                        $('.edit-task-issue').val($(this).parent().siblings('.task-issue').html());
                        $('#editTask .task-start-year').val($(this).parent().siblings('.task-start').html());
                        $('#editTask .task-end-year').val($(this).parent().siblings('.task-end').html());
                        $('.task-discription').val($(this).parent().siblings('.task-discription').html());
                        $('.edit-task-tag').val($(this).parent().siblings('.task-tag-td').html());
                        // $('.edit-task-issue').val($(this).siblings('.task-issue').html());
                        // $('.edit-task-issue').val($(this).siblings('.task-issue').html());
                        $('#editTask').modal();

                        $('#editTask .li-left').on('click', function() {
                            $('#editTask  .show-search-right ul').append($('#editTask .show-search-left .active-li').removeClass('active-li'));
                        });

                        $('#myModal .li-left').on('click', function() {
                            $('#myModal .show-search-right ul').append($('#myModal .show-search-left .active-li').removeClass('active-li'));
                        }); 

                        $('#editTask .li-right').on('click', function() {
                            $('#editTask .show-search-left ul').append($('#editTask .show-search-right .active-li').removeClass('active-li'));
                        });

                        $('#myModal .li-right').on('click', function() {
                            $('#myModal .show-search-left ul').append($('#myModal .show-search-right .active-li').removeClass('active-li'));
                        }); 

                    });

                    $('.del-task').on('click', function(e) {
                        $.ajax({
                            // url: '/imap 2/src/php/getTeamInfo.php',
                            url: 'http://www.sjtuimap.com/Interface/operateOneTask.php',
                            type: 'get',
                            data: {
                                Task_ID: $(e.target).parent().siblings('.task-id').html(),
                                type: 'delete'
                            },
                            success: function(data) {

                                 data = JSON.parse(data);
                                if (data.status === 'ok') {
                                    alert('删除成功')
                                    location.reload();
                                }
                            }
                        });
                    })
                }
            });

            $.ajax({
                url: 'http://www.sjtuimap.com/Interface/getReagentAndInstrument.php',
                type: 'get',
                data: {
                    type: 'instrument',
                    From_Team_ID: teamId
                },
                success: function(data) {

                }
            }).then(function() {
                 $.ajax({
                    // url: '/imap 2/src/php/getTeamInfo.php',
                    url: 'http://www.sjtuimap.com/Interface/getReagentAndInstrument.php',
                    type: 'get',
                    data: {
                        type: 'reagent',
                        From_Team_ID: teamId
                    },
                    success: function(data) {
                        // console
                        $('.lab-table tbody').html(juicer($('#lab-tpl').html(), {data: JSON.parse(data)}));

                        // var teamId = teamId;
                        $('#labModal .J_lab_save').on('click', function(e) {
                            var cas = $('.J_CAS').val();
                            var quantity = $('.J_quantity').val();
                            var remain_available = $('.J_available').val();
                            var expiration_time = $('.J_expire').val();
                            var pn = $('.J_PN').val();
                            var no = $('#labModal .J_No').val();
                            var size = $('.J_size').val();
                            var tag = $('.J_add_Tag').val();
                            var local = $('#labModal .J_local').val();

                            if (cas === '' || quantity === '' || remain_available === '' || expiration_time === '' || no === '' || size === '' || tag === '') {
                                alert('请完善表单信息');
                                return;
                            }
                            $.ajax({
                                // url: '/imap 2/src/php/getTeamInfo.php',
                                url: 'http://www.sjtuimap.com/Interface/addLab.php',
                                type: 'get',
                                data: {
                                    CAS: cas,
                                    From_Team_ID: teamId,
                                    Quantity: quantity,
                                    Reamaining_Available: remain_available,
                                    Expiration_Time: expiration_time,
                                    Location: local,
                                    PN: pn,
                                    Art_No: no,
                                    Size: size,
                                    Tag: tag
                                },
                                success: function(data) {
                                    $(e.target).attr('data-dismiss', 'modal');

                                    data = JSON.parse(data);
                                    if (data.status === 'ok') {
                                        location.reload();
                                    }
                                    // console
                                    // $('.task-table tbody').html(juicer($('#task-tpl').html(), {data: JSON.parse(data)}));
                                    // console.log('success')
                                }
                            });
                    });

                    $('#labEdit .J_lab_save').on('click', function(e) {
                        var cas = $('.J_edit_CAS').val();
                        var quantity = $('.J_edit_quantity').val();
                        var remain_available = $('#labEdit .J_available').val();
                        var location = $('.J_edit_location').val()
                        var expiration_time = $('.J_edit_expire').val();
                        var pn = $('.J_edit_PN').val();
                        var no = $('#labEdit .J_No').val();
                        var size = $('.J_edit_size').val();
                        var tag = $('.J_edit_Tag').val();

                        if (cas === '' || quantity === '' || remain_available === '' || expiration_time === '' || size === '' || tag === '') {
                            alert('请完善表单信息');
                            return;
                        }

                        $.ajax({
                            // url: '/imap 2/src/php/getTeamInfo.php',
                            url: 'http://www.sjtuimap.com/Interface/operateOneReagent.php',
                            type: 'post',
                            data: {
                                type: 'update',
                                CAS: cas,
                                From_Team_Id: teamId,
                                Quantity: quantity,
                                Remain_Available: remain_available,
                                Expiration_Time: expiration_time,
                                PN: pn,
                                no: no,
                                size: size,
                                tag: tag,
                                location: location
                            },
                            success: function(data) {
                                $(e.target).attr('data-dismiss', 'modal');

                                data = JSON.parse(data);
                                if (data.status === 'ok') {
                                    window.location.reload();
                                }
                                // console
                                // $('.task-table tbody').html(juicer($('#task-tpl').html(), {data: JSON.parse(data)}));
                                // console.log('success')
                            }
                        });
                    });

                    $('.del-lab').on('click', function(e) {
                        var No_ = $(this).siblings('.J_No_').val();
                        $.ajax({
                            // url: '/imap 2/src/php/getTeamInfo.php',
                            url: 'http://www.sjtuimap.com/Interface/operateOneReagent.php',
                            type: 'get',
                            data: {
                                type: 'delete',
                                 No_: No_
                            },
                            success: function(data) {
                                $(e.target).attr('data-dismiss', 'modal');
                                data = JSON.parse(data);

                                if (data.status === 'ok') {
                                    location.reload();
                                }
                                // console
                                // $('.task-table tbody').html(juicer($('#task-tpl').html(), {data: JSON.parse(data)}));
                                // console.log('success')
                            }
                        });
                    });

                    $('.edit-lab').on('click', function() {
                        var cas = $(this).parent().siblings('.J_cas_val').html();
                        var quantity = $(this).parent().siblings('.J_quantity_val').html();
                        var remain_available = $(this).parent().siblings('.J_remain_val').html();
                        var expiration_time = $(this).parent().siblings('.J_expire_val').html();
                        var pn = $(this).parent().siblings('.J_pn_val').html();
                        var no = $(this).parent().siblings('.J_no_val').html();
                        var size = $(this).parent().siblings('.J_size_val_wrap').children('.J_size_val').html();
                        var tag = $(this).parent().siblings('.J_tag_val').html();
                        var location = $(this).parent().siblings('.J_location_val').html();

                        $('.J_edit_PN').val(pn);
                        $('.J_edit_CAS').val(cas);
                        $('.J_edit_No').val(no);
                        $('.J_edit_quantity').val(quantity);
                        $('.J_edit_location').val(location);
                        $('.J_edit_expire').val(expiration_time);
                        $('.J_edit_size').val(size);
                        $('.J_edit_available').val(remain_available);
                        $('.J_edit_Tag').val(tag);
                    });
                }
            });
            });
            //获取lab信息
           

             //获取lab信息
           

        });
       
    // );

   $('#myModal .J_task_save').on('click', function(e) {
        var issue = $('#myModal .task-issue').val();
        var start = $('#myModal .task-start-year').val() + '-' + $('#myModal .task-start-month').val() + '-' + $('#myModal .task-start-day').val();
        var end = $('#myModal .task-end-year').val() + '-' + $('#myModal .task-end-month').val() + '-' + $('#myModal .task-end-day').val();
        var discription = $('#myModal .task-discription').val();
        var tag = $('#myModal .task-tag').val();
        var participants = '';
        var participantsLi = $('#myModal .show-search-right li');
        participantsLi.each(function(index, elem){
            participants += $(elem).html() + ',';
        });

        if (issue === '' || start === '' || end === '' || discription === '' || tag === '') {
            alert('请完善表单信息');
            return;
        }

        $.ajax({
            // url: '/imap 2/src/php/getTeamInfo.php',
            url: 'http://www.sjtuimap.com/Interface/addATask.php',
            type: 'get',
            data: {
                team_ID: teamId,
                issue: issue,
                startTime: start,
                endTime: end,
                participants: participants,
                discription: discription,
                tag: tag
            },
            success: function(data) {
                $(e.target).attr('data-dismiss', 'modal');
                 data = JSON.parse(data);
                if (data.status === 'ok') {
                    location.reload();
                }
            }
        });
   });

    $('#editTask .J_task_save').on('click', function(e) {
        var issue = $('#editTask .edit-task-issue').val();
        var start = $('#editTask .task-start-year').val() + '-' + $('#editTask .task-start-month').val() + '-' + $('#editTask .task-start-day').val();
        var end = $('#editTask .task-end-year').val() + '-' + $('#editTask .task-end-month').val() + '-' + $('#editTask .task-end-day').val();
        var discription = $('#editTask .edit-task-discription').val();
        var tag = $('#editTask .edit-task-tag').val();
        var participants = '';
        var participantsLi = $('#editTask .show-search-right li');
        participantsLi.each(function(index, elem){
            participants += $(elem).html() + ',';
        });

        if (issue === '' || start === '' || end === '' || discription === '' || tag === '') {
            alert('请完善表单信息');
            return;
        }

        $.ajax({
            // url: '/imap 2/src/php/getTeamInfo.php',
            url: 'http://www.sjtuimap.com/Interface/operateOneTask.php',
            type: 'get',
            data: {
                Task_ID: teamId,
                type: 'update',
                issue: issue,
                startTime: start,
                endTime: end,
                participants: participants,
                status: discription,
                tag: tag
            },
            success: function(data) {
                $(e.target).attr('data-dismiss', 'modal');
                data = JSON.parse(data);
                if (data.status === 'ok') {
                    location.reload();
                }
            }
        });
   });



   $('.J_member_save').on('click', function(e) {
        var name = $('.J_member-name').val();
        var gender = '';
        if ($('.J_member_male').is(':checked')) {
            gender = '男'
        } else if ($('.J_member_female').is(':checked')) {
            gender = '女'
        }
        var age = $('.J_member-age').val();
        var levels = $('.J_member-level').val();
        var accountNumber = $('.J_member-account').val();
        var IGEMPassword = $('.J_member-password').val();
        var identity = $('.J_member-identity').val();

        if (name === '' || gender === '' || age === '' || levels === '' || accountNumber === '' || IGEMPassword === '' || identity === '') {
            alert('请完善表单信息');
            return;
        }

        $.ajax({
            // url: '/imap 2/src/php/getTeamInfo.php',
            url: 'http://www.sjtuimap.com/Interface/operateOneMember.php',
            type: 'post',
            data: {
                type: 'add',
                name: name,
                gender: gender,
                age: age,
                levels: levels,
                accountNumber: accountNumber,
                IGEMPassword: IGEMPassword,
                identity: identity
            },
            success: function(data) {
                $(e.target).attr('data-dismiss', 'modal');

                data = JSON.parse(data);
                if (data.status === 'ok') {
                    alert('添加成功');
                    location.reload();
                }
                
                // console
                // $('.task-table tbody').html(juicer($('#task-tpl').html(), {data: JSON.parse(data)}));
                // console.log('success')
            }
        });
   });

  
    $('.dropdown-menu').on('click', function(e) {
        $(this).prev().prev().attr('value', $(e.target).html());
    });
});  