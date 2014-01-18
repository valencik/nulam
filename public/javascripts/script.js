(function(){

    $(document).ready(function(){
        squares = $('#squares');
        input = $('#input');
        smartInput = $('#smart-input');
        method = $('#method');
        message = $('#message');

        buildData();

        input.keyup(onInput);
        method.change(onInput);
        smartInput.keydown(function( event ) {
          if ( event.which == 13 ) {
          onSmartInput();
          }
        });

        onInput();
    });

    var data = [];

    //dom elements
    var squares;
    var input;
    var smartInput;
    var method;
    var message;

    var methods = {
        REGEX: 0,
        MATH: 1,
        BOOLEAN: 2
    };

    function criteriaRegex(){
        return {
            type: 0,
            input: "",
            test: function(value){
                return new RegExp(this.input).test(value);
            }
        }
    }

    function criteriaMath(){
        return {
            type: 1,
            input: "",

            test: function(value, index, x, y){
                var thisCriteria = this.input.replace(/n/g, index.toString());
                thisCriteria = thisCriteria.replace(/x/g, value);
                thisCriteria = thisCriteria.replace(/r/g, y);
                thisCriteria = thisCriteria.replace(/c/g, x);
                return eval(thisCriteria) === parseFloat(value);
            }
        }
    }

    function criteriaBoolean(){
        return {
            type: 1,
            input: "",
            target: true,
            test: function(value, index, x, y){
                var thisCriteria = this.input.replace(/n/g, index.toString());
                thisCriteria = thisCriteria.replace(/x/g, value);
                thisCriteria = thisCriteria.replace(/r/g, y);
                thisCriteria = thisCriteria.replace(/c/g, x);
                return eval(thisCriteria) === this.target;
            }
        }
    }

    function criteriaOEIS(){
        return {
            type: 1,
            input: [],
            test: function(value){
                return $.inArray(parseFloat(value), this.input) !== -1;
            }
        }
    }

    var rows = 10;
    var columns = 20;

    function onInput(){
        var userInput = input.val();
        if(userInput.length){
            var criteria;
            switch(parseInt(method.val())){
                case methods.MATH:
                    criteria = criteriaMath();
                    break;
                case methods.BOOLEAN:
                    criteria = criteriaBoolean();
                    break;
                case methods.REGEX:
                default:
                    criteria = criteriaRegex();

            }
            criteria.input = userInput;
            startVisualization(criteria);
        }
    }

    function onSmartInput(){
        var criteria = {
            smartInput : smartInput.val()
        };
       
        if(criteria.smartInput.length){
            //Jquery/AJAX POST of request
            $.ajax({
                type: "POST",
                url: "/smartGrab",
                data: JSON.stringify(criteria),
                dataType: "json",
                success: function(smartResults){
                    console.log("AJAX", smartResults);
                    var criteria = criteriaOEIS();
                    criteria.input = smartResults;
                    startVisualization(criteria);
                }
            });
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
            var y = Math.floor(i / columns) + 1;
            var x = (i % columns) + 1;
            if(criteria.test(content, i, x, y)){
                match();
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
