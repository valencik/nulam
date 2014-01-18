(function(){

    $(document).ready(function(){
        squares = $('#squares');
        input = $('#regex-input');
        message = $('#message');

        input.keyup(function(){
            try {
                regex = new RegExp($(this).val());
                runRegex();
            } catch (e) {
                message.text('invalid');
            }
        });

        for(var i = 0; i < 200; i++){
            data.push(i);
        }

        for(var elem in data){
            squares.append('<div class="square red">' + (parseInt(elem) + 1) + '</div>');
        }
    });

    var data = [];

    var squares;
    var input;
    var message;

    var regex = /^[1-5]|[2]$/;

    function runRegex(){
        var matches = 0;
        squares.find('.square').each(function(){
            var square = $(this);
            square.addClass('red').removeClass('green');
            var content = square.text();
            if(regex.test(content)){
                square.addClass('green').removeClass('red');
                matches++;
            }
        });
        message.text(matches + ' matches');
    }

}());