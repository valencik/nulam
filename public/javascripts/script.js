(function(){

    $(function(){
        for(var i = 0; i < 100; i++){
            data.push(i);
        }

        for(var elem in data){
            $('#squares').append('<div class="square red">' + elem + '</div>');
        }
    });

    var data = [];

}());