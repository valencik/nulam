(function(){

    $(document).ready(function(){
        squares = $('#squares');
        input = $('#input');
        method = $('#method');
        message = $('#message');

        input.keyup(function(){
            if(method.val() == methods.REGEX){
                try {
                    criteria = new RegExp($(this).val());
                    runVisualization();
                } catch (e) {
                    message.addClass('invalid').text('invalid');
                }
            } else if(method.val() == methods.MATH){
                criteria = [];
                try {
                    var equation = $(this).val();
                    var conditions = equation.split(/&&|\|\|/);
                    $(conditions).each(function(){
                        var condition = this.trim();
                        var operator = condition.match(/==|>=|<=|>|</g);
                        if(operator.length === 1){
                            var terms = condition.split(new RegExp(operator));
                            if(terms.length == 2){
                                $(terms).each(function(i){
                                    terms[i] = this.trim();
                                });
                                criteria.push({
                                    lhTerm: terms[0],
                                    operator: operator[0],
                                    rhTerm: terms[1]
                                });
                            } else {
                                throw "Invalid number of terms";
                            }
                        } else {
                            throw "Invalid number of operators";
                        }
                        runVisualization();
                    });
                } catch (e){
                    message.addClass('invalid').text('invalid');
                }
            }
        });

        for(var i = 0; i < 200; i++){
            data.push(i);
        }

        for(var elem in data){
            squares.append('<div class="square red">' + (parseInt(elem) + 1) + '</div>');
        }

        runVisualization();
    });

    var data = [];

    //dom elements
    var squares;
    var input;
    var method;
    var message;

    var criteria;

    var methods = {
        REGEX: 0,
        MATH: 1
    };

    function runVisualization(){
        var matches = 0;
        squares.find('.square').each(function(){
            var square = $(this);
            square.addClass('red').removeClass('green');
            var content = square.text();
            if(method.val() == methods.REGEX && criteria.test(content)){
                square.addClass('green').removeClass('red');
                matches++;
            } else if(method.val() == methods.MATH) {
                var valid = true;
                $(criteria).each(function(){
                    var lhTerm = parseFloat(this.lhTerm.replace('x', content));
                    var rhTerm = parseFloat(this.rhTerm.replace('x', content));
                    switch(this.operator){
                        case "==":
                            if(!(lhTerm == rhTerm)){
                                return valid = false;
                            }
                            break;
                        case ">=":
                            if(!(lhTerm >= rhTerm)){
                                return valid = false;
                            }
                            break;
                        case "<=":
                            if(!(lhTerm <= rhTerm)){
                                return valid = false;
                            }
                            break;
                        case ">":
                            if(!(lhTerm > rhTerm)){
                                return valid = false;
                            }
                            break;
                        case "<":
                            if(!(lhTerm < rhTerm)){
                                return valid = false;
                            }
                            break;
                    }
                });
                if(valid){
                    square.addClass('green').removeClass('red');
                    matches++;
                }
            }
        });
        message.removeClass('invalid').text(matches + ' matches');
    }

}());