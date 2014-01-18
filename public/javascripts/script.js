(function(){

    $(document).ready(function(){
        squares = $('#squares');
        input = $('#input');
        method = $('#method');
        message = $('#message');

        buildData();

        input.keyup(onInput);
        method.change(onInput);

        onInput();
    });

    var data = [];

    //dom elements
    var squares;
    var input;
    var method;
    var message;

    var methods = {
        REGEX: 0,
        MATH: 1,
        BOOLEAN: 2
    };

    var rows = 10;
    var columns = 20;

    function onInput(){
        var criteria = input.val();
        if(criteria.length){
            if(method.val() == methods.REGEX){
                startVisualization(new RegExp(criteria));
            } else if(method.val() == methods.MATH || method.val() == methods.BOOLEAN){
                startVisualization(criteria);
            }
        }
    }

    function startVisualization(criteria){
        try {
            runVisualization(criteria);
        } catch (e) {
            message.addClass('invalid').text('invalid');
            squares.find('.square').addClass('red').removeClass('green');
        }
    }

    function runVisualization(criteria){
        var matches = 0;
        squares.find('.square').each(function(i){
            var square = $(this);
            square.addClass('red').removeClass('green');
            function match(){
                square.addClass('green').removeClass('red');
                matches++;
            }
            var content = square.text();
            if(method.val() == methods.REGEX && criteria.test(content)){
                match();
            } else if(method.val() == methods.MATH || method.val() == methods.BOOLEAN){
                var row = Math.floor(i / columns) + 1;
                var column = (i % columns) + 1;
                var thisCriteria = criteria.replace(/n/g, i.toString());
                thisCriteria = thisCriteria.replace(/x/g, content);
                thisCriteria = thisCriteria.replace(/r/g, row);
                thisCriteria = thisCriteria.replace(/c/g, column);
                if(method.val() == methods.MATH && eval(thisCriteria) === parseFloat(content)){
                    match();
                }
                if(method.val() == methods.BOOLEAN && eval(thisCriteria) === true) {
                    match();
                }
            }
        });
        message.removeClass('invalid').text(matches + ' matches');
    }

    function buildData(){
        for(var i = 0; i < 200; i++){
            data.push(i);
        }

        for(var elem in data){
            squares.append('<div class="square red">' + (parseInt(elem) + 1) + '</div>');
        }
    }
}());