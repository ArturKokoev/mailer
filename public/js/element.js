var pathname = window.location.href.split('/');
var path = pathname[0]+"//"+pathname[2]

/*----------------------------------
    Campaigns page function start 
-----------------------------------*/
$(document).ready(function(){ 
    //continue button setting
    $(document).on('click','.ig_camp_next', function(){
        if($('#campaign_name').val()==''){
            $('#campaignError').html('Campaign Name cannot empty.');
            $('#campaignError').addClass('ig_input_error')
        }else{  
            var campaign_name = $('#campaign_name').val();
            //if data not exists in database.
            if($('#campaign-id').val()==0){
                showpreloader();
                $.post('/campaigns/create-campaign',{campaign_name : campaign_name}, function(response){ 
                    hidepreloader();    
                    if(response.status == true){
                        var typeAlert ='ok';
                        isValid(typeAlert, response.message);
                        var a = $('.ig_camp_next').data('next');
                        $('.ig_camp_create').hide();
                        $('.ig_camp_create.step'+a).show();
                        if(a == 2){
                            $('body').addClass('editor_loaded');
                        }else{
                            $('body').removeClass('editor_loaded');
                        }
                        $('.ig_save_btn').attr('campaign-id', response.data.id);
                    }else{
                        var typeAlert ='error';
                        isValid(typeAlert, response.message);
                    }
                });
            }else{
                //if data exists in database.
                var a = $('.ig_camp_next').data('next');
                $('.ig_camp_create').hide();
                $('.ig_camp_create.step'+a).show();
                if(a == 2){
                    $('body').addClass('editor_loaded');
                }else{
                    $('body').removeClass('editor_loaded');
                }
                var id = $('#campaign-id').val();
                showpreloader();
                $.post('/campaigns/dataLink',{id:id},function(response){
                    hidepreloader();    
                    if(response.status==true){
                        if(response.findData.font_family!=""){
                            var font = (response.findData.font_family).toString();
                            var fam = font.split(',')
                            var famObj = '';
                            for(let i=0; i<fam.length; i++){
                                if(famObj!=''){
                                    famObj +='|'+fam[i]
                                }else{
                                    famObj +=fam[i]
                                }
                            }
                            var link = '<link id="fontLink" rel="stylesheet" href="https://fonts.googleapis.com/css?family='+famObj+'" media="all">'
                            $('head').append(link);
                        }else{
                            var link = '<link id="fontLink" rel="stylesheet" href="https://fonts.googleapis.com/css?family=Arial" media="all">'
                            $('head').append(link);
                        }
                    }
                });
                $('.ig_save_btn').attr('campaign-id', $('#campaign-id').val());
            }
        }
    });   

    //show common setting of heading 
    $(document).on('click','[data-element="heading"]', function(){
        $('.font_list').show();
        $('.heading_font_size').show();
        $('.head_color').show();
        $('.para_color').hide();
        $('.para_font_size').hide();
        $('.btn_setting').hide();
        $('.btn_color').hide();
        $('.btn_txt').hide();
        $('.btn_bg_color').hide();
        $('.bd_bg_col').hide();
        $('.temp_bg').hide();
    });

    //show common setting of paragraph 
    $(document).on('click','[data-element="paragraph"]', function(){
        $('.font_list').show(); 
        $('.para_color').show();
        $('.para_font_size').show();
        $('.heading_font_size').hide();
        $('.head_color').hide();
        $('.btn_setting').hide();
        $('.btn_color').hide();
        $('.btn_txt').hide();
        $('.btn_bg_color').hide();
        $('.bd_bg_col').hide();
        $('.temp_bg').hide();
    });

    //show common setting of button
    $(document).on('click','[data-element="button"]', function(){
        $('.font_list').show();
        $('.btn_setting').show();
        $('.btn_color').show();
        $('.btn_txt').show();
        $('.btn_bg_color').show();
        $('.heading_font_size').hide();
        $('.head_color').hide();
        $('.bd_bg_col').hide();
        $('.temp_bg').hide();
        $('.para_color').hide();
        $('.para_font_size').hide();
    });

    //common setting for link
    $(document).on('click','[data-element="link"]', function(){
        $('.head_color').show();
        $('.font_list').hide();
        $('.heading_font_size').hide();
        $('.para_color').hide();
        $('.para_font_size').hide();
        $('.btn_setting').hide();
        $('.btn_color').hide();
        $('.btn_txt').hide();
        $('.btn_bg_color').hide();
        $('.bd_bg_col').hide();
        $('.temp_bg').hide();
    });

    $('.ig_template_wrapper').on('click', function(){
        commonSetting();
    });

    //alredy saved link function
    $(document).on('click','.ig_inner_table tbody .el_element.link a.link', function(){
        $(this).bind('paste', function(e){
            var pastedData = e.originalEvent.clipboardData.getData('text');
            $(this).attr('href',pastedData);
        });
    });

    $(document).on('click','.ig_inner_table tbody tr .active', function(){
        $(this).bind('paste', function(e){
            var pastedData = e.originalEvent.clipboardData.getData('text');
            var para = '<p style="margin:0" contenteditable="true">'+pastedData+'</p>'
            $(this).find('p').replaceWith(para);
        });
    });

    $(document).on('click','.ig_inner_table tbody tr .el_element .temp_button.active', function(){
        $(this).bind('paste', function(e){
            var pastedData = e.originalEvent.clipboardData.getData('text');
            var btnData = '<a class="temp_button active" contenteditable="true" data-element="button" style="font-size: 14px; padding: 10px 20px; background-color: rgb(66, 184, 139); color: rgb(255, 255, 255); display: inline-block; border-radius: 3px;">'+pastedData+'</a>'
            $(this).replaceWith(btnData);
        });
    });

    $(document).on('click','.ig_inner_table tbody tr .el_element .button.active', function(){
        $(this).bind('paste', function(e){
            var pastedData = e.originalEvent.clipboardData.getData('text');
            var btnData = '<a class="button active" contenteditable="true" data-element="button" style="font-size: 14px; padding: 10px 20px; background-color: rgb(66, 184, 139); color: rgb(255, 255, 255); display: inline-block; border-radius: 3px;">'+pastedData+'</a>'
            $(this).replaceWith(btnData);
        });
    });

    /* color setting start */
    $(document).on('input','.color_heading', function(e){
        var color = $(this).val();
        $('.el_element.temp_heading.active').css('color', color);
        $('.el_element.heading.active').css('color', color);
        $('.el_element.temp_link.active a').css('color',color);
        $('.el_element.link.active a').css('color',color);
    });



    $(document).on('input','.size_heading', function(e){
        var size = $(this).val();
        $('.el_element.temp_heading.active').css('font-size', size + 'px');
        $('.el_element.heading.active').css('font-size', size + 'px');
    });
    
    $(document).on('input','.color_body_bg', function(e){
        var color = $(this).val();
        $('[data-element="body"]').css('background-color', color);
    });

    $(document).on('input','.color_template_bg', function(e){
        var color = $(this).val();
        $('[data-element="template"]').css('background-color', color);
    });

    $(document).on('input','.color_paragraph', function(e){
        var color = $(this).val();
        $('.el_element.temp_paragraph.active').css('color', color);
        $('.el_element.paragraph.active').css('color', color);
    });
    $(document).on('input','.size_paragraph', function(e){
        var size = $(this).val();
        $('.el_element.temp_paragraph.active').css('font-size', size + 'px');
        $('.el_element.paragraph.active').css('font-size', size + 'px');
    });

    $(document).on('input','.color_button_bg', function(e){
        var color = $(this).val();
        $('.el_element > a.button.active').css('background-color', color);
        $('.el_element > .temp_button.active').css('background-color', color); 
    });
    $(document).on('input','.color_button', function(e){
        var color = $(this).val();
        $('.el_element > .button.active').css('color', color);
        $('.el_element > .temp_button.active').css('color', color);
    });
    $(document).on('input','.button_text', function(e){
        var link = $(this).val();
        $('.el_element > .button.active').attr('href', link);
        $('.el_element > .temp_button.active').attr('href', link);
    });
    /* color setting end */

    $('#fontlist').on('change', function(e){
        var family = e.target.value;
        if(family){
            var url = 'https://fonts.googleapis.com/css?family='+family;
            $('tr .active').css('font-family',family);
            var link_html = '<link id="fontLink" rel="stylesheet" href="'+url+'" media="all">'
            if($('#fontLink').attr('href')!=undefined){
                var ff=$('#fontLink').attr('href');
                var ff1=ff.split('=');
                var pipeSplit=ff1[1].split('|');
                var arr = '';
                pipeSplit.forEach(function(split){
                    if(split.match(family)){
                        arr += 'true'
                        return true;
                    }
                });
                if(arr == ''){
                    $('#fontLink').attr('href',ff+'|'+family);
                }
            }else{
                $('head').append(link_html);
            }
        }else{
            var url = 'https://fonts.googleapis.com/css?family=Poppins'; 
            var link_html = '<link id="fontLink" rel="stylesheet" href="'+url+'" media="all">'
            $('head').append(link_html);
        }
    });

    //save heading setting
    $(document).on('click','.el_element.temp_heading', function(){
        $('.color_heading').siblings('label').html('Heading color');
        $('.el_element.temp_heading').removeClass('active');
        $('.el_element > .temp_button').removeClass('active');
        $('.el_element.temp_paragraph').removeClass('active');
        $('.el_element.paragraph').removeClass('active');
        $('.el_element.temp_link').removeClass('active');
        $('.el_element.link').removeClass('active');
        $('.el_element .button').removeClass('active');
        $('.el_element.heading').removeClass('active');
        $(this).addClass('active');
    });

    //append heading setting
    $(document).on('click','.el_element.heading', function(){
        $('.color_heading').siblings('label').html('Heading color');
        $('.el_element.heading').removeClass('active');
        $('.el_element.temp_heading').removeClass('active');
        $('.el_element > .temp_button').removeClass('active');
        $('.el_element.temp_link').removeClass('active');
        $('.el_element.link').removeClass('active');
        $('.el_element.temp_paragraph').removeClass('active');
        $('.el_element.paragraph').removeClass('active');
        $('.el_element .button').removeClass('active');
        $(this).addClass('active');
    });

    //save paragraph setting
    $(document).on('click','.el_element.temp_paragraph', function(){
        $('.el_element.temp_paragraph').removeClass('active');
        $('.el_element.temp_heading').removeClass('active');
        $('.el_element > .temp_button').removeClass('active');
        $('.el_element.paragraph').removeClass('active');
        $('.el_element.temp_link').removeClass('active');
        $('.el_element.link').removeClass('active');
        $('.el_element.heading').removeClass('active');
        $('.el_element .button').removeClass('active');
        $(this).addClass('active');    
    });

    //append paragraph setting
    $(document).on('click','.el_element.paragraph', function(){
        $('.el_element.paragraph').removeClass('active');
        $('.el_element.temp_heading').removeClass('active');
        $('.el_element > .temp_button').removeClass('active');
        $('.el_element.temp_paragraph').removeClass('active');
        $('.el_element.temp_link').removeClass('active');
        $('.el_element.link').removeClass('active');
        $('.el_element.heading').removeClass('active');
        $('.el_element .button').removeClass('active');
        $(this).addClass('active');
    });

     //saved link setting
     $(document).on('click','.el_element.temp_link', function(){
        $('.el_element.paragraph').removeClass('active');
        $('.el_element.temp_heading').removeClass('active');
        $('.el_element.link').removeClass('active');
        $('.el_element > .temp_button').removeClass('active');
        $('.el_element.temp_paragraph').removeClass('active');
        $('.el_element.heading').removeClass('active');
        $('.el_element .button').removeClass('active');
        $('.el_element.temp_link').removeClass('active');
        $(this).addClass('active');
        $('.color_heading').siblings('label').html('Link color');
    });

    //append link setting
    $(document).on('click','.el_element.link', function(){
        $('.el_element.paragraph').removeClass('active');
        $('.el_element.temp_heading').removeClass('active');
        $('.el_element.temp_link').removeClass('active');
        $('.el_element > .temp_button').removeClass('active');
        $('.el_element.temp_paragraph').removeClass('active');
        $('.el_element.heading').removeClass('active');
        $('.el_element .button').removeClass('active');
        $('.el_element.link').removeClass('active');
        $(this).addClass('active');
        $('.color_heading').siblings('label').html('Link color');
    });

    //save template button setting
    $(document).on('click','.el_element > .temp_button', function(){
        $('.el_element > .temp_button').removeClass('active');
        $('.el_element.temp_heading').removeClass('active');
        $('.el_element.temp_paragraph').removeClass('active');
        $('.el_element.paragraph').removeClass('active');
        $('.el_element.temp_link').removeClass('active');
        $('.el_element.link').removeClass('active');
        $('.el_element.heading').removeClass('active');
        $('.el_element .button').removeClass('active');
        $(this).addClass('active');
    });

    //append template button setting
    $(document).on('click','.el_element > .button', function(){
        $('.el_element > .button').removeClass('active');
        $('.el_element.temp_heading').removeClass('active');
        $('.el_element.temp_paragraph').removeClass('active');
        $('.el_element .temp_button').removeClass('active');
        $('.el_element.temp_link').removeClass('active');
        $('.el_element.link').removeClass('active');
        $('.el_element.heading').removeClass('active');
        $('.el_element.paragraph').removeClass('active');
        $(this).addClass('active');
    });

    //save button setting.
    $(document).on('click','.ig_save_btn', function(){
        var id = $('.hidden_id').val();
        $('[data-element="heading"]').removeClass('heading');
        $('[data-element="paragraph"]').removeClass('paragraph');
        $('[data-element="button"]').removeClass('button');
        $('[data-element="link"]').removeClass('link');
        $('.el_element.temp_heading').removeClass('active');
        $('.el_element.temp_paragraph').removeClass('active');
        $('.el_element.temp_button').removeClass('active');
        $('.el_element.paragraph').removeClass('active');
        $('.el_element .button').removeClass('active');
        $('.el_element.heading').removeClass('active');
        $('.el_element.link').removeClass('active');
        $('[data-element="heading"]').addClass('temp_heading');
        $('[data-element="paragraph"]').addClass('temp_paragraph');
        $('[data-element="button"]').addClass('temp_button');
        $('[data-element="link"]').addClass('temp_link');
        $('.el_element.temp_link > a.link').each(function(i,v){
            var d= $(this).html();
            var hrefData = $(this).attr('href');
            if(hrefData == ''){
                $(this).attr('href',d);
                var data = $(this).attr('href');
                var splitData = data.split('/');
                var splitPath = splitData[0]+"//"+splitData[2]
                if(splitPath != path){
                    hrefData1 = data.replace(data, path+'/campaigns/link/'+id+'?url='+data)
                    $(this).attr('href',hrefData1);
                }
            }else{
                var data = $(this).attr('href');
                var splitData = data.split('/');
                var splitPath = splitData[0]+"//"+splitData[2]
                console.log((splitPath != path && d !=path))
                if(splitPath != path && d !=path){
                    hrefData1 = data.replace(data, path+'/campaigns/link/'+id+'?url='+data)
                    $(this).attr('href',hrefData1);
                }
            }
        });
        var data = $('head #fontLink').attr('href');
        var data_link = [];
        if(data){
            var d1 = data.split('=');
            data_link.push(d1[1].split('|'))
        }
        var html_data = $('table').prop('outerHTML');
        var id = $(this).attr('campaign-id');
        showpreloader();    
        $.post('/campaigns/create-campaign',{link:JSON.stringify(data_link), data : html_data, id : id}, function(response){
            hidepreloader();    
            if(response.status == true){
                var typeAlert ='ok';
                isValid(typeAlert, response.message);
                setTimeout(function(){window.location.href='/campaigns/';},300);
            }else{
                var typeAlert ='error';
                isValid(typeAlert, response.message);
            }
        });
    });

    //cancel button setting.
    $(document).on('click','.ig_cancel_btn', function(){
        $('#back_campaign_popup').modal('show');
    });

    $(document).on('click','.yes_btn',function(){
        window.location.href='/campaigns/' 
    });

    $(document).on('click','.no_btn',function(){
        $('.back_close_popup').click();
    });

    //cancel button setting.
    $(document).on('click','.ig_camp_cancel', function(){
        window.location.href='/campaigns/'
    });

    //template elements click.
    $('.el_add_element').on('click', function(){
        $('.el_element.temp_heading').removeClass('active');
        $('.el_element.temp_paragraph').removeClass('active');
        $('.el_element > .temp_button').removeClass('active');
        var el1_html = '';
        var el = $(this).data('el');
        if(el == 'image'){      
            $('#input_data').trigger('click');
            $('#input_data').unbind('change').bind('change', function(){
                var data = new FormData();
                $.each($('#input_data')[0].files, function(i, file) {
                    data.append('img', file);
                });
                if(validate()==true){
                    showpreloader();    
                    $.ajax({
                        url: '/campaigns/image',
                        data: data,
                        cache: false,
                        contentType: false,
                        processData: false,
                        method: 'POST',
                        type: 'POST', // For jQuery < 1.9
                        success: function(response){ 
                            hidepreloader();    
                            if(response.status == true){
                                el1_html = '<tr><td class="el_element" data-element="image" align="center" style="padding: 10px;"><img style="max-width:500px" src="'+path+'/uploads/'+response.image+'" alt="" /></td></tr>';
                                $('.el_target_wrapper').append(el1_html); 
                                $('#input_data').val('');
                            }   
                        }
                    });
                }else{
                    validate();
                }
            }); 
        }

        if(el == 'link'){     
            $('.el_element.link > a.link').bind('paste', function(e){
                var pastedData = e.originalEvent.clipboardData.getData('text');
                $(this).attr('href',pastedData);
            });
        }
    }); 

    /* link not clickable */
    $(document).on('click', '.ig_inner_table a', function(e){
        e.preventDefault();
    });

    //delete campaign
    $(document).on('click', '.ig_camp_del', function(){
        $('#delete_campaign_popup').modal('show');
        var id = $(this).attr('del-camp');
        $(this).parents('.col-md-3').addClass('campaign_delete');
        $('#delete_campaign_popup').find('.ig_btn_red').attr('camp-del-id',id);
    });

    $(document).on('click','.ig_btn_red',function(){
        var id = $(this).attr('camp-del-id');
        showpreloader();    
        $.post('/campaigns/deleteCampaign', {id : id}, function(response){
            hidepreloader();    
            if(response.status==true){
                var typeAlert ='ok';
                isValid(typeAlert, response.message);
                $('.del_popup_close').click();
                setTimeout(function(){window.location.href='/campaigns/';},200);
            }else{
                var typeAlert ='error';
                isValid(typeAlert, response.message);
                $('.del_popup_close').click();
            }
        });
    });

    $(document).on('click','.del_cancel', function(){
        $(this).siblings('button').removeAttr('camp-del-id');
    });

    $(document).on('click','.del_popup_close', function(){
        $(this).siblings().find('button.ig_btn_red').removeAttr('camp-del-id');
    });

    /* send test mail popup open */
    $(document).on('click', 'a.test_temp', function(){
        var id = $(this).attr('campaign-id')
        popupShow(id);
    });

    /* send to group popup open */
    $(document).on('click', 'a.group_popup', function(){
        var id = $(this).attr('group-cam-id')
        groupPopup(id);
    });

    /* send to contact popup open */
    $(document).on('click', 'a.contact_popup', function(){
        var id = $(this).attr('contact-cam-id')
        contactPopup(id);
    });

    /* preview template */
    $(document).on('click','.prev_temp', function(){
        var id= $(this).attr('data-id');
        showpreloader();    
        $.post('/campaigns/previewTemplate',{id:id}, function(response){
            hidepreloader();   
            if(response.status==true){
                if(response.data.template){
                    var font 
                    if(response.data.font_family){
                        font = (response.data.font_family).toString();
                    }else{
                        font = '';
                    }
                    var fam = font.split(',')
                    var famObj = '';
                    for(let i=0; i<fam.length; i++){
                        if(famObj!=''){
                            famObj +='|'+fam[i]
                        }else{
                            famObj +=fam[i]
                        }
                    }
                    var link = '<link id="fontLink" rel="stylesheet" href="https://fonts.googleapis.com/css?family='+famObj+'" media="all">'
                    $('head').append(link);
                    $('.preview_body').html(response.data.template)
                    $('.ig_inner_table tbody tr td').removeClass('temp_heading');
                    $('.ig_inner_table tbody tr td').removeClass('temp_paragraph');
                    $('.ig_inner_table tbody tr td').removeClass('temp_button');
                    $('.ig_inner_table tbody tr td').removeClass('link');
                    $('.ig_main_table').css('width','100%');
                    $('.ig_inner_table').css('width','600');
                    $('#preview_template_popup').modal('show');
                    $('.preview_body').find('.editor_el_actions').remove();
                    $('.preview_body').find('.ig_inner_table tbody tr td p').attr('contenteditable', 'false');
                    $('.preview_body').find('.ig_inner_table tbody tr td a').attr('contenteditable', 'false');
                }
            }
        });
    });

    $(document).on('click','.preview_body', function(){ 
        $(this).find('.el_element .editor_el_actions').addClass('pre_bdy');
        $(this).find('.el_element .editor_el_actions.pre_bdy').remove();
    });

    /* mail send to the user from campaigns */
    $(document).on('click', '.btn_send_mail', function(){
        var id = $(this).attr('test-camp-id')
        var subject = $('#test_subject').val();
        var email = $('#test_email').val();
        
        if(testMailValidation()==true){
            showpreloader();    
            $.post('/campaigns/mailSend', {id:id, subject:subject, email:email} , function(response){ 
                hidepreloader();    
                if(response.status == true){
                    $('.btn_send_mail').removeAttr('test-camp-id');
                    $('.test_popup').click();
                    $('#test_subject').val('');
                    $('#test_email').val('');
                    var typeAlert ='ok';
                    isValid(typeAlert, response.message);
                }else{
                    $('.btn_send_mail').removeAttr('test-camp-id');
                    $('.test_popup').click();
                    $('#test_subject').val('');
                    $('#test_email').val('');
                    var typeAlert ='error';
                    isValid(typeAlert, response.message);
                }
            });
        }else{
            testMailValidation();
        }
    });

    /* mail send to the group from campaigns */
    $(document).on('click', '.send_grp', function(){
        var id = $(this).attr('grp-camp-id');
        var subject = $('#send_grp_sub').val();
        var group = $('.camp_grp_list').val();
        var time = $('#grpDate').val();

        if(groupMailValidation()==true){
            showpreloader();    
            $.post('/campaigns/mailSend', {id:id, subject:subject, time:time, group:group}, function(response){
                hidepreloader();    
                if(response.status==true){
                    $('.send_grp').removeAttr('grp-camp-id');
                    $('.grp_popup').click();
                    $('#send_grp_sub').val('');
                    $('#grpDate').val('');
                    $('.camp_grp_list').val('').trigger('change');
                    var typeAlert ='ok';
                    isValid(typeAlert, response.message);
                }else{
                    $('.send_grp').removeAttr('grp-camp-id');
                    $('#send_grp_sub').val('');
                    $('#grpDate').val('');
                    $('.camp_grp_list').val('').trigger('change');
                    $('.grp_popup').click();
                    var typeAlert ='error';
                    isValid(typeAlert, response.message);
                }
            });
        }else{
            groupMailValidation();
        }
    });

    /* mail send to the contact from campaigns */
    $(document).on('click', '.con_btn', function(){
        var id = $(this).attr('con-camp-id');
        var subject = $('#send_con_sub').val();
        var time = $('#mydateTime').val();
        var contactId =JSON.stringify($('.camp_con_list ').val());
          
        if(conMailValidation()==true){
            showpreloader();    
            $.post('/campaigns/mailSend', {id:id, subject:subject, time:time, contactId: contactId}, function(response){
                hidepreloader();    
                if(response.status==true){
                    $('.con_popup').click();
                    $('.con_btn').removeAttr('con-camp-id');
                    $('#send_con_sub').val('');
                    $('#mydateTime').val('');
                    $('.camp_con_list ').val('').trigger('change');
                    var typeAlert ='ok';
                    isValid(typeAlert, response.message);
                }else{
                    $('.con_btn').removeAttr('con-camp-id');
                    $('.con_popup').click();
                    $('#send_con_sub').val('');
                    $('#mydateTime').val('');
                    $('.camp_con_list ').val('').trigger('change');
                    var typeAlert ='error';
                    isValid(typeAlert, response.message);
                }
            });
        }else{
            conMailValidation();
        }
    });

    //close test mail popup
    $(document).on('click','.test_popup', function(){
        $('#testSubjectError').html('');
        $('#testEmailError').html('');
    });

    //close group popup
    $(document).on('click','.grp_popup',function(){
        $('#subGrpError').html('');
        $('#selGrpError').html('');
        $('#send_grp_sub').val('');
        $('#sel_grp').val('').trigger('change.select2');
        $('.grp_date_show').hide();
        $('.grp_date_show').css('display','none');
        $(this).siblings('.ig_popup_body').find('button.cancel_grp_sch').html('<i class="far fa-clock"></i> Schedule');
        $(this).siblings('.ig_popup_body').find('button.cancel_grp_sch').removeClass('cancel_grp_sch');
        $(this).siblings('.ig_popup_body').find('button.ig_btn_primary ').addClass('schedule_grp');
        $(this).siblings('.ig_popup_body').find('button.send_grp').html('Send Now');
        $(this).siblings('.ig_popup_body').find('button.send_grp').removeAttr('grp-camp-id');
    });

    //close contact popup
    $(document).on('click','.con_popup',function(){
        $('#subConError').html('');
        $('#selConError').html('');
        $('#send_con_sub').val('');
        $('#sel_con').val('').trigger('change.select2');
        $('.con_date_show').hide();
        $('.con_date_show').css('display','none');
        $(this).siblings('.ig_popup_body').find('button.cancel_con_sch').html('<i class="far fa-clock"></i> Schedule');
        $(this).siblings('.ig_popup_body').find('button.cancel_con_sch').removeClass('cancel_con_sch');
        $(this).siblings('.ig_popup_body').find('button.ig_btn_primary ').addClass('schedule_con');
        $(this).siblings('.ig_popup_body').find('button.con_btn').html('Send Now');
        $(this).siblings('.ig_popup_body').find('button.con_btn').removeAttr('con-camp-id');
    });

    //show schedule for send to group
    $(document).on('click','.schedule_grp', function(){
        $('.grp_date_show').show();
        $('.grp_date_show').css('display','');
        $(this).removeClass('schedule_grp');
        $(this).addClass('cancel_grp_sch');
        $(this).text('Cancel');
        $(this).siblings().last().text('Schedule');
    });

    //show schedule for send to group
    $(document).on('click','.cancel_grp_sch', function(){
        $('.grp_date_show').hide();
        $('.grp_date_show').css('display','none');
        $(this).removeClass('cancel_grp_sch');
        $(this).addClass('schedule_grp');
        $(this).html('<i class="far fa-clock"></i> Schedule');
        $(this).siblings().last().text('Send Now');
        $(this).siblings().last().removeAttr('grp-camp-id');
    });

    //show schedule for send to contact
    $(document).on('click','.schedule_con', function(){
        $('.con_date_show').show();
        $('.con_date_show').css('display','');
        $(this).removeClass('schedule_con');
        $(this).addClass('cancel_con_sch');
        $(this).text('Cancel');
        $(this).siblings().last().text('Schedule');
    });

    //show schedule for send to group
    $(document).on('click','.cancel_con_sch', function(){
        $('.con_date_show').hide();
        $('.con_date_show').css('display','none');
        $(this).removeClass('cancel_con_sch');
        $(this).addClass('schedule_con');
        $(this).html('<i class="far fa-clock"></i> Schedule');
        $(this).siblings().last().text('Send Now');
        $(this).siblings().last().removeAttr('con-camp-id');
    });

    //date time picker
    $('.dateTime').datetimepicker({
        minDate : moment(),
        stepping : 5
    });
});

/* -------------------------------
    Contact page function start 
---------------------------------*/
$(document).ready(function(){
    /* delete contacts */
    $(document).on('click', '.ig_contact_del', function(){
        var id = $(this).attr('contact-id-del');
        $(this).parents('tr').addClass('del_contact');
        $('#delete_contact_popup').modal('show');
        $('#delete_contact_popup').find('.ig_btn_red').attr('con-del-id',id);
    });

    $(document).on('click','.ig_btn_red.contact',function(){
        var contact_id = $(this).attr('con-del-id');
        var group_id = $(this).attr('group-id');
        if(contact_id){
            showpreloader();
            $.post('/contacts/deleteContact', {id : contact_id}, function(response){
                hidepreloader();     
                if(response.status==true){
                    setTimeout(function(){
                        window.location.href='/contacts/'
                    },300); 
                    var typeAlert = 'ok'
                    isValid(typeAlert, response.message);
                    $('.con_popup_close').click();
                }else{
                    var typeAlert ='error';
                    isValid(typeAlert, response.message);
                    $('.con_popup_close').click();
                }
            });
        }else{
            showpreloader();
            $.post('/contacts/deleteGroup', {id : group_id}, function(response){
                hidepreloader();    
                if(response.status==true){
                    var index=1;   
                    $('.group_del').siblings('tr').each(function(i,v){
                        var d = $(this).find('td.tag_count').html(index); 
                        index++;
                    });
                    $('#group_list > option').each(function(i,e){
                        if($(this).attr('value')==group_id){
                            $(this).remove();
                        }
                    });
                    var typeAlert = 'ok'
                    isValid(typeAlert, response.message);
                    $('.con_popup_close').click();
                    $('.ig_group_list > table > tbody').find('tr.group_del').remove();
                }else{
                    var typeAlert ='error';
                    isValid(typeAlert, response.message);
                    $('.con_popup_close').click();
                }
            });
        }
    });

    $(document).on('click','.con_cancel', function(){
        $(this).siblings('button').removeAttr('con-del-id');
        $(this).siblings('button').removeAttr('group-id');
    });

    $(document).on('click','.con_popup_close', function(){
        $(this).siblings().find('button.ig_btn_red').removeAttr('con-del-id');
        $(this).siblings().find('button.ig_btn_red').removeAttr('group-id');
    });

    /* edit contacts */
    $(document).on('click','.ig_contact_edit', function(){
        $('#update_contact_popup').modal('show'); 
        var g_id = $(this).parents('td').siblings('td:eq(4)').attr('gp-id');
        var id = $(this).attr('contact-id');
        var name = $(this).parents('td').siblings('td:eq(1)').html();
        var email = $(this).parents('td').siblings('td:eq(2)').html();
        var group = $(this).parents('td').siblings('td:eq(4)').html();
        $('#ig_upd_name').val(name);
        $('#ig_upd_email').val(email);
        $('#upd_group_list').val(g_id).trigger('change');
        $('.ig_updt_con').attr('contact-id',id);
    });

    /* update contacts. */
    $(document).on('click','.ig_updt_con',function(){
        var name = $('#ig_upd_name').val();
        var email = $('#ig_upd_email').val();
        var id = $(this).attr('contact-id');
        var group =  $('#upd_group_list').val();
        showpreloader();    
        $.post('/contacts/updateContact',{id:id,name:name,email:email,group:group}, function(response){
            hidepreloader();    
            if(response.status==true){
                setTimeout(function(){
                    window.location.href='/contacts';
                },300);
                var typeAlert = 'ok'
                isValid(typeAlert, response.message);
                $('.cont_close').click();
            }else{
                var typeAlert = 'error'
                isValid(typeAlert, response.message)
                $('.cont_close').click();
            }
        });
    });

    /* remove error msg on add group popup close */
    $(document).on('click', '.add_grp_popup', function(){
        $('#groupInputError').html('');
    });

    /* cancel button*/
    $(document).on('click','.ig_create_group_popup_cancel', function(){
        $('#groupInputError').html('');
    });

    /* remove error msg on create new contact */
    $(document).on('click', '.cont_close', function(){
        $('#selInputError').html(''); 
        $('#nameInputError').html('');
        $('#emailInputError').html('');
        $('#ig_input_name').val('');
        $('#ig_input_email').val('');
        $('#group_list').val('');
        $('#ig_input_group').val('');  

    });

    /* group create */
    $(document).on('click', '.ig_crt_grp', function(){
        var group = $('#ig_input_group').val();
        var index = $('.ig_group_list > table > tbody > tr').length+1;
        
        if(newGroupValidation()){
            showpreloader();    
            $.post('/contacts/groupCreate', {group:group}, function(response){
                hidepreloader();    
                if(response.status==true){
                    var newGroupAdd = '<tr>'+
                    '<td class="tag_count">'+index+'</td>'+
                    '<td>'+response.group.name+'</td>'+
                    '<td class="tag_contacts">0</td>'+
                    '<td class="tag_actions">'+
                    '<span class="ig_ta_btn ig_edit_grp" group-id="'+response.group.id+'"><i class="fa fa-edit"></i></span>'+
                    '<span class="ig_ta_btn ig_del_grp" group-id="'+response.group.id+'"><i class="fa fa-trash"></i></span>'+
                    '</td>'+
                    '</tr>'
                    $('.ig_group_list > table > tbody').append(newGroupAdd);
                    $('#ig_input_group').val('');
                    var newOption = new Option(response.group.name, response.group.id, true, true);
                    $('#group_list').append(newOption).trigger('change');
                    var typeAlert = 'ok'
                    isValid(typeAlert, response.message);
                    $('.cont_close').click();
                }else{
                    var typeAlert = 'error'
                    isValid(typeAlert, response.message)
                    $('.cont_close').click();
                }
            });
        }else{
            newGroupValidation()
        }
    });

    /* delete group */
    $(document).on('click','.ig_delete_group', function(){
        var id = $(this).attr('group-id');
        $(this).parents('tr').addClass('group_del');
        $('#delete_contact_popup').modal('show');
        $('#delete_contact_popup').find('.ig_btn_red').attr('group-id',id)
    });

    /* edit group */
    $(document).on('click','.ig_edit_grp', function(){
        var id = $(this).attr('group-id');
        var groupName = $(this).parents('tr').find('td:eq(1)').text();
        $('#ig_input_group').val(groupName);
        $('.btn').removeClass('ig_crt_grp');
        $('.btn').addClass('update_grp');
        $('.btn').html('Update');
        $('.btn').attr('gp-id',id);        
    });

    /* update group */
    $(document).on('click','.update_grp', function(){
        var group = $('#ig_input_group').val();  
        var id = $(this).attr('gp-id');
        showpreloader();
        $.post('/contacts/groupUpdate',{id:id, group:group}, function(response){
            hidepreloader();
            if(response.status==true){
                $('.ig_group_list > table tbody tr').each(function(i,e){
                    if(($(this).find('.ig_edit_grp').attr('group-id'))==id){
                        $(this).find('td:eq(1)').html(group);
                        $('#ig_input_group').val('');
                    }
                });

                $('#group_list > option').each(function(i,e){
                    if($(this).attr('value')==id){
                        $(this).val().trigger('change');
                        $(this).html(group);
                    }
                });
                var typeAlert = 'ok'
                isValid(typeAlert, response.message);
                $('.cont_close').click();
            }else{
                var typeAlert = 'error'
                isValid(typeAlert, response.message)
                $('.cont_close').click();
            }
        });
    });

    /* contact create */
    $(document).on('click', '.ig_crt_con', function(){
        var name = $('#ig_input_name').val();
        var email = $('#ig_input_email').val();
        var group 
        if($('#group_list').val()==null){
            group = $('#group_list > option').last().val();
        }else if($('#group_list').val()=='Select Group'){
            group='';
        }else{
            group = $('#group_list').val();
        }

        if(contactValidation()==true){
            showpreloader();
            $.post('/contacts/', {name:name,email:email,group:group}, function(response){
                hidepreloader();
                if(response.status==true){
                    var typeAlert = 'ok'
                    isValid(typeAlert, response.message)
                    setTimeout(function(){
                        window.location.href = '/contacts/'
                    },300);
                    $('.cont_close').click();
                }else{
                    var typeAlert = 'error'
                    isValid(typeAlert, response.message)
                    $('.cont_close').click();
                }
            });
        }else{
            contactValidation();
        }
    });

    $('#contact_det').DataTable();
});

/* -------------------------------
    Setting page function start 
---------------------------------*/
$(document).ready(function(){
    $(document).on('click','.save_user_detail', function(){
        var id = $(this).attr('user-id');
        var name = $('#user_name').val();
        var password = $('#user_pass').val();

        if(profileValidation()==true){
            showpreloader();
            $.post('/settings/',{id:id, name:name, password:password}, function(response){
                hidepreloader();
                if(response.status==true){
                    $('#user_pass').val('');
                    $('#user_cpass').val('');
                    var typeAlert = 'ok'
                    isValid(typeAlert, response.message)
                }else{
                    var typeAlert = 'error'
                    isValid(typeAlert, response.message)
                }
            });
        }else{
            profileValidation();
        }
    });

    /* Schedule delete function. */
    $(document).on('click','.sch_del', function(){
        var sch_id = $(this).attr('sch-del-id');
        $(this).parents('tr').addClass('ig_sch_del');
        $('#setting_schedule_popup').modal('show');
        $('#setting_schedule_popup').find('.ig_btn_red.setting').attr('sch-id',sch_id);
    });

    $(document).on('click','.mail_del', function(){
        var mailLog_id = $(this).attr('mail-log-id');
        $(this).parents('tr').addClass('mail_log_del');
        $('#setting_schedule_popup').modal('show');
        $('#setting_schedule_popup').find('.ig_btn_red.setting').attr('mailLog-id',mailLog_id);
    });  

    $(document).on('click','.ig_btn_red.setting',function(){
        var sch_id = $(this).attr('sch-id');
        var mailLog_id = $(this).attr('mailLog-id');
        if(sch_id){
            showpreloader();
            $.post('/settings/deleteSchedule', {id : sch_id}, function(response){
                hidepreloader();
                if(response.status==true){
                    var index=1;   
                    $('.ig_sch_del').siblings('tr').each(function(i,v){
                        var d = $(this).find('td.sorting_1').html(index); 
                        index++;
                    });
                    $('.ig_sch_del').remove();
                    var len =$('#sch_list tbody tr').length;
                    $('#sch_list_info').html('Showing 1 to '+len+' of '+len+' entries');
                    if(len == 0){
                        var html = '<tr class="odd"><td valign="top" colspan="6" class="dataTables_empty">No data available in table</td></tr>'
                        $('#sch_list tbody').append(html);
                        $('#sch_list_info').html('Showing '+len+' to '+len+' of '+len+' entries');
                        $('.current').remove();
                    }
                    var typeAlert = 'ok'
                    isValid(typeAlert, response.message);
                    $('.setting_popup_close').click();
                }else{
                    var typeAlert ='error';
                    isValid(typeAlert, response.message);
                    $('.setting_popup_close').click();
                }
            });
        }else{
            showpreloader();
            $.post('/settings/deleteMailDelivery', {id : mailLog_id}, function(response){
                hidepreloader();
                if(response.status==true){
                    var i=1;   
                    $('.mail_log_del').siblings('tr').each(function(i,v){
                        var d = $(this).find('td.sorting_1').html(i); 
                        i++;
                    });
                    $('.mail_log_del').remove();
                    var len =$('#delivery_list tbody tr').length;
                    $('#delivery_list_info').html('Showing 1 to '+len+' of '+len+' entries');
                    if(len == 0){
                        var html = '<tr class="odd"><td valign="top" colspan="6" class="dataTables_empty">No data available in table</td></tr>'
                        $('#delivery_list tbody').append(html);
                        $('.current').remove();
                    }
                    var typeAlert = 'ok'
                    isValid(typeAlert, response.message);
                    $('.setting_popup_close').click();
                }else{
                    var typeAlert ='error';
                    isValid(typeAlert, response.message);
                    $('.setting_popup_close').click();
                }
            });
        }
    });


    $(document).on('click','.setting_cancel', function(){
        $(this).siblings('button').removeAttr('sch-id');
        $(this).siblings('button').removeAttr('mailLog-id');
        $('.sch_del').parents('tr').removeClass('ig_sch_del');
        $('.mail_del').parents('tr').removeClass('mail_log_del');
    });

    $(document).on('click','.setting_popup_close', function(){
        $(this).siblings().find('button.ig_btn_red').removeAttr('con-del-id');
        $(this).siblings().find('button.ig_btn_red').removeAttr('mailLog-id');
        $('.sch_del').parents('tr').removeClass('ig_sch_del');
        $('.mail_del').parents('tr').removeClass('mail_log_del');
    });

    $(document).on('click','.sch_edit', function(){
        $('#schedule_edit_popup').modal('show');
        var id = $(this).attr('sch-id')
        showpreloader();
        $.post('/settings/getEditSchedule',{id:id}, function(response){
            hidepreloader();
            if(response.status==true){
                $('#schTime').val(response.getSch.schedule_time);
                $('.upd_sch').attr('sch-upd-id',id);
            }else{
                var typeAlert = 'error'
                isValid(typeAlert, response.message)
            }
        });
    });

    $(document).on('click','.upd_sch', function(){
        var id = $(this).attr('sch-upd-id');
        var time = $('#schTime').val();
        showpreloader();
        $.post('/settings/updateSchedule',{id:id, time:time}, function(response){
            hidepreloader();
            if(response.status==true){
                $('#sch_list').find('tbody tr').each(function(){
                    if(($(this).find('td:eq(1)').attr('sh-id'))==id){
                        $(this).find('td:eq(1)').html(time);
                    }
                });
                $('.sch_edit_cancel').click();
                var typeAlert = 'ok'
                isValid(typeAlert, response.message)
            }else{
                var typeAlert = 'error'
                isValid(typeAlert, response.message)
            }
        });
    });

    $(document).on('click','.save_smtp_details', function(){
        var email = $('#smtp_email').val();
        var pass = $('#smtp_pass').val();
        var port = $('#smtp_port').val();
        var host = $('#smtp_host').val();
        var service = $('#smtp_service').val();
        var id =  $(this).attr('smtp-id');
        if(smtpValidation()==true){
            if(id){
                showpreloader();
                $.post('/settings/smptpDetailsUpdate',{email:email, pass:pass, port:port, host:host, service:service, id:id}, function(response){
                    hidepreloader();
                    if(response.status==true){
                        $('#smtp_email').val(email);
                        $('#smtp_pass').val('');
                        $('#smtp_port').val(port);
                        $('#smtp_host').val(host);
                        $('#smtp_service').val(service);
                        $('.col-md-12').find('.ig_tab_wrapper li.profile').removeClass('active'); 
                        $('.col-md-12').find('.ig_tab_wrapper li.mail_delivery').removeClass('active');
                        $('.col-md-12').find('.ig_tab_wrapper li.sched').removeClass('active');
                        $('.col-md-12').find('.ig_tab_wrapper li.smtp_setting').addClass('active');
                        var typeAlert = 'ok'
                        isValid(typeAlert, response.message)
                    }else{
                        var typeAlert = 'error'
                        isValid(typeAlert, response.message)
                    }
                });
            }else{
                showpreloader();
                $.post('/settings/smptpDetailsCreate',{email:email, pass:pass, port:port, host:host, service:service}, function(response){
                    hidepreloader();
                    if(response.status==true){
                        $('#smtp_email').val(email);
                        $('#smtp_pass').val('');
                        $('#smtp_port').val(port);
                        $('#smtp_host').val(host);
                        $('#smtp_service').val(service);
                        $('.col-md-12').find('.ig_tab_wrapper li.profile').removeClass('active'); 
                        $('.col-md-12').find('.ig_tab_wrapper li.mail_delivery').removeClass('active');
                        $('.col-md-12').find('.ig_tab_wrapper li.sched').removeClass('active');
                        $('.col-md-12').find('.ig_tab_wrapper li.smtp_setting').addClass('active');
                        var typeAlert = 'ok'
                        isValid(typeAlert, response.message)
                    }else{
                        var typeAlert = 'error'
                        isValid(typeAlert, response.message)
                    }
                });
            }
        }else{
            smtpValidation();
        }
    });
    $('#sch_list').DataTable();
    $('#delivery_list').DataTable();
});

/* show popup */
function popupShow(id){
    $('#test_template_popup').modal('show');
    $('.btn_send_mail').attr('test-camp-id', id);
}

function groupPopup(id){
    $('#sendto_group_popup').modal('show');
    $('.send_grp').attr('grp-camp-id', id);
}

function contactPopup(id){
    $('#sendto_contact_popup').modal('show');
    $('.con_btn').attr('con-camp-id', id);
}

function commonSetting(){
    $('.bd_bg_col').show();
    $('.temp_bg').show();
    $('.font_list').hide();
    $('.para_color').hide();
    $('.para_font_size').hide();
    $('.heading_font_size').hide();
    $('.head_color').hide();
    $('.btn_setting').hide();
    $('.btn_color').hide();
    $('.btn_txt').hide();
    $('.btn_bg_color').hide();
}
/*-----------------------------------------------------
	Fix Toastr
-----------------------------------------------------*/
function isValid(typeAlert,message) { 
	if(typeAlert=='ok')
	{
		$('.ig_alert_wrapper').addClass('alert_open');
		$('.ig_alert_wrapper').addClass('success');
		$(".ig_alert").text(message);
		setTimeout(function(){ $('.ig_alert_wrapper').removeClass('alert_open'); }, 3000);
		setTimeout(function(){
            setTimeout(function(){
                $('.ig_alert_wrapper').removeClass('success'); 
            },300);
        }, 3000);
	}
	else if(typeAlert=='info')
	{
        $('.ig_alert_wrapper').addClass('alert_open');
        $('.ig_alert_wrapper').addClass('info');
        $(".ig_alert").text(message);
        setTimeout(function(){ $('.ig_alert_wrapper').removeClass('alert_open'); }, 3000);
        setTimeout(function(){ 
            setTimeout(function(){
                $('.ig_alert_wrapper').removeClass('info');
            }, 300);
        }, 3000);

    }
    else
	{
        $('.ig_alert_wrapper').addClass('alert_open');
        $('.ig_alert_wrapper').addClass('error');
        $(".ig_alert").text(message);
        setTimeout(function(){ $('.ig_alert_wrapper').removeClass('alert_open'); }, 3000);
        setTimeout(function(){ 
            setTimeout(function(){                 
                $('.ig_alert_wrapper').removeClass('error'); 
            }, 300);
        }, 3000);
	}
}

/* loader function */
function showpreloader(){
    $('.ms_preloader_wrapper').addClass('preloader_open');
}

function hidepreloader(){
    $('.ms_preloader_wrapper').remove('preloader_open');
}

/* Validation for image extension */
function validate(){
    var ext=['jpg','jpeg','png','gif']
    var file_ext=document.getElementById('input_data').value.split('.').pop().toLowerCase();
    var valid = false;

        for(var index in ext){
            if(file_ext === ext[index]){
            valid = true;
            break;
            }
        }
        if(!valid){
            var typeAlert = 'error'
            var message = "Only JPG, JPEG, PNG and GIF files are allowed."
            isValid(typeAlert,message)
        }
    return valid;
}

/* campaign test email validation */
function testMailValidation(){
    testEmailError.innerHTML= '';
    testSubjectError.innerHTML='';
    var mail1=0; var sub=0;

    if (test_email.value == '' || test_email.value != ''){
        var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        if (test_email.value == '' || !filter.test(test_email.value)) {
            var text = "Please enter a valid email.";
            testEmailError.innerHTML= text;
            testEmailError.classList.add('ig_input_error');
            mail1=0;
        }else{
            mail1=1;
            testEmailError.classList.remove('ig_input_error');
        }
    }

    if(test_subject.value=='' || test_subject.value==null){
        var text = "Please enter subject.";
        testSubjectError.innerHTML= text;
        testSubjectError.classList.add('ig_input_error');
        sub=0;
    }else{
        sub=1;
        testSubjectError.classList.remove('ig_input_error');
    }
    
    if(mail1 && sub){
        return true;
    }else{
        return false;
    }
}

/* send to group email validation */
function groupMailValidation(){
    subGrpError.innerHTML='';
    selGrpError.innerHTML='';
    var sb=0; var sel=0;
    if(send_grp_sub.value ==''){
        var text='Please enter subject.'
        subGrpError.innerHTML=text;
        subGrpError.classList.add('ig_input_error');
        sb=0;
    }else{
        sb=1;
        subGrpError.classList.remove('ig_input_error');
    }

    if(sel_grp.value == ''){
        var text='Please select an option.'
        selGrpError.innerHTML=text;
        selGrpError.classList.add('ig_input_error');
        sel=0;
    }else{
        sel=1;
        selGrpError.classList.remove('ig_input_error');
    }

    if(sb && sel){
        return true
    }else{
        return false
    }
}

/* send to contact mail validation */
function conMailValidation(){
    subConError.innerHTML='';
    selConError.innerHTML='';
    var sb1=0; var sel1=0;
    if(send_con_sub.value ==''){
        var text='Please enter subject.'
        subConError.innerHTML=text;
        subConError.classList.add('ig_input_error');
        sb1=0;
    }else{
        sb1=1;
        subConError.classList.remove('ig_input_error');
    }

    if(sel_con.value == ''){
        var text='Please select an option.'
        selConError.innerHTML=text;
        selConError.classList.add('ig_input_error');
        sel1=0;
    }else{
        sel1=1;
        selConError.classList.remove('ig_input_error');
    }

    if(sb1 && sel1){
        return true
    }else{
        return false
    }
}

/* group name not null validation */
function newGroupValidation(){
    groupInputError.innerHTML='';
    
    if(ig_input_group.value == ''){
        var text = "Please enter a group name.";
        groupInputError.innerHTML= text;
        groupInputError.classList.add('ig_input_error');
        return false;
    }else{
        if(!(/^[a-zA-Z0-9]*$/g.test(ig_input_name.value))) { 
            var text = "Please enter a group name.";
            groupInputError.innerHTML= text;
            groupInputError.classList.add('ig_input_error');
            return false;
        }else{
            groupInputError.classList.remove('ig_input_error');
            return true;
        }
    }
}

/* add contact validation */
function contactValidation(){
    emailInputError.innerHTML='';
    nameInputError.innerHTML = '';

    var name = 0; var mail=0;
    if (ig_input_email.value == '' || ig_input_email.value != ''){
        var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        if (ig_input_email.value == '' || !filter.test(ig_input_email.value)) {
            var text = "Please enter a valid email.";
            emailInputError.innerHTML= text;
            emailInputError.classList.add('ig_input_error');
            mail=0;
        }else{
            mail=1;
            emailInputError.classList.remove('ig_input_error');
        }
    }

    /* name validation */
    if(ig_input_name.value==''){
        var text = "Please enter a name.";
        nameInputError.innerHTML = text;
        nameInputError.classList.add('ig_input_error');
        name = 0;
    }else{
        if(!(/^[a-zA-Z]*$/g.test(ig_input_name.value))){ 
            var text = "Please enter a name.";
            nameInputError.innerHTML = text;
            nameInputError.classList.add('ig_input_error');
            name = 0;
        }else{
            name = 1;
            nameInputError.classList.remove('ig_input_error');
        }
    }

    if(mail && name){
        return true;
    }else{
        return false;
    }
}

function profileValidation() {
    nameError.innerHTML = '';
    passError.innerHTML = '';
    cpassError.innerHTML = '';
    var nm=0; var pss=0;

    if(user_name.value == ''){
        var text="Please enter name."
        nameError.innerHTML = text;
        nameError.classList.add('ig_input_error');
        nm=0;
    }else{
        if(!(/^[a-zA-Z]*$/g.test(user_name.value))){
            var text="Please enter name."
            nameError.innerHTML = text;
            nameError.classList.add('ig_input_error');
            nm=0;
        }else{
            nm=1;
            nameError.classList.remove('ig_input_error');
        }
    }

    if(user_pass.value==''){
        var text = "Password is required.";
        passError.innerHTML=text;
        passError.classList.add('ig_input_error');
        pss=0;
    }else if(user_pass.value != ''){
        if(user_pass.value < 6){
            var text = "Password length atleast 6 digit or character.";
            passError.innerHTML=text;
            passError.classList.add('ig_input_error');
            pss=0;
        }else if(user_cpass.value == ''){
            var text = "Password not match.";
            cpassError.innerHTML=text;
            cpassError.classList.add('ig_input_error');
            pss=0;
        }else if(user_pass.value != user_cpass.value){
            var text = "Password not match.";
            cpassError.innerHTML=text;
            cpassError.classList.add('ig_input_error');
            pss=0;
        }else{
            pss=1;
            passError.classList.remove('ig_input_error');
        }
    }   

    if(nm && pss){
        return true
    }else{
        return false
    }
}

function smtpValidation(){
    serviceError.innerHTML= '';
    hostError.innerHTML='';
    portError.innerHTML='';
    smtpEmailError.innerHTML='';
    smtpPassError.innerHTML='';

    var mail=0; var pass=0; var p=0; var serv=0;var host=0;

    if (smtp_email.value == '' || smtp_email.value != ''){
        var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        if (smtp_email.value == '' || !filter.test(smtp_email.value)) {
            var text = "Please enter a valid email.";
            smtpEmailError.innerHTML= text;
            smtpEmailError.classList.add('ig_input_error');
            mail=0;
        }else{
            mail=1;
            smtpEmailError.classList.remove('ig_input_error');
        }
    }

    if(smtp_pass.value==''){
        var text = "Please enter password.";
        smtpPassError.innerHTML=text;
        smtpPassError.classList.add('ig_input_error');
        pass=0;
    }else{
        if(smtp_pass.value < 6){
            var text = "Password length atleast 6 digit or character.";
            smtpPassError.innerHTML=text;
            smtpPassError.classList.add('ig_input_error');
            pass=0;
        }else {
            pass=1;
            smtpPassError.classList.remove('ig_input_error');
        }
    }   

    if(smtp_port.value==''){
        var text = "Please enter port.";
        portError.innerHTML=text;
        portError.classList.add('ig_input_error');
        p=0;
    }else if(smtp_port.value!=''){
        if(smtp_port.value.length > 3){
            var text = "Port length will be 3.";
            portError.innerHTML=text;
            portError.classList.add('ig_input_error');
            p=0;
        }else{
            p=1;
            portError.classList.remove('ig_input_error');
        }
    }   

    if(smtp_service.value=='' || smtp_service.value==null){
        var text = "Please enter smtp service.";
        serviceError.innerHTML= text;
        serviceError.classList.add('ig_input_error');
        serv=0;
    }else{
        serv=1;
        serviceError.classList.remove('ig_input_error');
    }

    if(smtp_host.value=='' || smtp_host.value==null){
        // var filter = /^([a-zA-Z0-9_\.\])+\(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        // if (smtp_host.value == '' || !filter.test(smtp_host.value)) {
            var text = "Please enter smtp Host.";
            hostError.innerHTML= text;
            hostError.classList.add('ig_input_error');
            host=0;
        }else{
            hostError.classList.remove('ig_input_error');
            host=1;
        }
    // }

    if(mail && pass && serv && p && host){
        return true;
    }else{
        return false;
    }
}
