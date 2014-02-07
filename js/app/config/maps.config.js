(function(window, $){

    var cardStatusMap = {
        0: 'todo',
        1: 'progress',
        2: 'done'
    };

    /* Note: stupid quick solution. */
    var cardStatusInverseMap = {
        'todo': 0,
        'progress': 1,
        'done': 2
    };

    window.addToNamespace('GTDapp.config', {
        cardStatusMap: cardStatusMap,
        cardStatusInverseMap: cardStatusInverseMap
    });

}) (window, jQuery);