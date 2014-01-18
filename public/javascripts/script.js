(function(){

    $(function(){
        var squares = $('#squares');

        for(var i = 0; i < 100; i++){
            data.push(i);
        }

        for(var elem in data){
            squares.append('<div class="square red">' + elem + '</div>');
        }

        squares.find('.square').each(function(){
            var square = $(this);
            square.addClass('red').removeClass('green');
            var content = square.text();
            if(regex.test(content)){
                square.addClass('green').removeClass('red');
            }
        });
    });

    var data = [];

    var regex = /^[1-5]|[2]$/;

}());