/* global $ */

$(document).ready(function() {
    //console.log('loaded!!!!!');
    $('.getSuggestion').on('click', function() {
        $('.getSuggestion').prop('disabled',true);
        //console.log('boo ???');
        $('.titleBox').val('');
        // $('.titleBox').val($('.urlBox').val());
        var url = $('.urlBox').val();
        $.get(`https://decodemtl-day14-reddit-nodejsapi-pluk74-1.c9users.io/getTitle?url=`+url,
        function(title){
            $('.titleBox').val(title);
            $('.getSuggestion').prop('disabled',false);
        });
        
        
    });
    
    $('.upVote').on('submit', function(event) {
        // $(this).serialize();
        event.preventDefault();
        // console.log($(this));
        //var $this = $(this);
        var data = $(this).serialize();
        
        $.post(`https://decodemtl-day14-reddit-nodejsapi-pluk74-1.c9users.io/vote`
        , data
        , function(response) {
            //$.get(`https://decodemtl-day14-reddit-nodejsapi-pluk74-1.c9users.io/getVote?postId`)
            console.log('aardvark: ' + response.score);
            $('#voteScore'+response.postId).text(response.score);
        }
        );
    });
    
    $('.downVote').on('submit', function(event) {
        // $(this).serialize();
        event.preventDefault();
        // console.log($(this));
        //var $this = $(this);
        var data = $(this).serialize();
        
        $.post(`https://decodemtl-day14-reddit-nodejsapi-pluk74-1.c9users.io/vote`
        , data
        , function(response) {
            //$.get(`https://decodemtl-day14-reddit-nodejsapi-pluk74-1.c9users.io/getVote?postId`)
            //console.log('aardvark: ' + response.score);
            $('#voteScore'+response.postId).text(response.score);
        }
        );
    });
    
});
