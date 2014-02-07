(function(window, $){

    var eventNames = {
        GTDCardNew: 'GTDCardNew',
        GTDCardDelete: 'GTDCardDelete',
        GTDCardEdit: 'GTDCardEdit',
        GTDCardMove: 'GTDCardMove',
        GTDCardSave: 'GTDCardSave'
    };

    window.addToNamespace('GTDapp.config', {
        events: eventNames
    });

}) (window, jQuery);