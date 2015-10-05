jQuery(document).ready(function($){

	$('.inafx-likes').live('click',
	    function() {
    		var link = $(this);
    		if(link.hasClass('active')) return false;
		
    		var id = $(this).attr('id'),
    			postfix = link.find('.inafx-likes-postfix').text();
			
    		$.post(inafx_likes.ajaxurl, { action:'inafx-likes', likes_id:id, postfix:postfix }, function(data){
    			link.html(data).addClass('active').attr('title','You already like this');
    		});
		
    		return false;
	});
	
	if( $('body.ajax-inafx-likes').length ) {
        $('.inafx-likes').each(function(){
    		var id = $(this).attr('id');
    		$(this).load(inafx.ajaxurl, { action:'inafx-likes', post_id:id });
    	});
	}

});