(function(window, $){

    var urlConfig = {
        tasks: 'data/data-source.json'
    };

    function DataService(){
        var self = this;

        self.tasks = {
            get:  function(){
                var promise = $.ajax({
                    type : 'GET',
                    dataType : 'json',
                    async: false,
                    url: urlConfig.tasks
                });

                // TODO: add handling for success/error if required

                return promise;
            }
        };

        return self;
    }

    window.addToNamespace('GTDapp', {
        dataService: new DataService()
    });

}) (window, jQuery);