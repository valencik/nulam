(function(){

    $(document).ready(function(){
        squares = $('#squares');
        input = $('#input');
        method = $('#method');
        message = $('#message');

        buildDefaultData();
        populateSquares();

        input.keyup(onInput);
        method.change(function(event){
           if($(this).val() == methods.OEIS){
               event.stopImmediatePropagation();
           }
        });
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
        BOOLEAN: 2,
        OEIS: 3
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
            targets: {
                value:0,
                index:1,
                row:2,
                column:3
            },
            target:2,
            test: function(value, index, x, y){
                var checkValue;
                switch(this.target){
                    case this.targets.index:
                        checkValue = index;
                        break;
                    case this.targets.row:
                        checkValue = y;
                        break;
                    case this.target.column:
                        checkValue = x;
                        break;
                    case this.targets.value:
                    default:
                        checkValue = parseFloat(value);
                        break;
                }
                var thisCriteria = this.input.replace(/n/g, index.toString());
                thisCriteria = thisCriteria.replace(/x/g, value);
                thisCriteria = thisCriteria.replace(/r/g, y);
                thisCriteria = thisCriteria.replace(/c/g, x);
                return eval(thisCriteria) === checkValue;
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

    var rows = 21;
    var columns = 21;

    var oesiTimeout;

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
                case methods.OEIS:

                    criteria = {
                        smartInput : userInput
                    };
                    if(oesiTimeout){
                        clearTimeout(oesiTimeout);

                    }
                    oesiTimeout = setTimeout(function(){
                        input.addClass('loading');
                        $.ajax({
                            type: "POST",
                            url: "/smartGrab",
                            data: criteria,
                            dataType: "json",
                            success: function(smartResults){
                                input.removeClass('loading');
                                console.log("AJAX", smartResults);
                                var criteria = criteriaOEIS();
                                criteria.input = smartResults;
                                startVisualization(criteria);
                            },
                            error: function(error){
                                input.removeClass('loading');
                                throw "Ajax error!";
                            }
                        });
                    }, 1000);

                    break;
                case methods.REGEX:
                default:
                    criteria = criteriaRegex();

            }
            criteria.input = userInput;
            startVisualization(criteria);
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

    function buildDefaultData(){
        for(var i = 0; i < 441; i++){
            data.push(i);
        }
    }

    function populateSquares(){
        $(data).each(function(){
            squares.append('<div class="square red" title="' + (parseInt(this) + 1) + '">' + (parseInt(this) + 1) + '</div>');
        });
    }
}());
