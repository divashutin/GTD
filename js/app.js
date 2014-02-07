(function (window, $) {

    var eventNames = GTDapp.config.events;
    var layoutHelper = GTDapp.layoutHelper;
    var statuses = GTDapp.config.cardStatusInverseMap;

    var localStorageCardsKey = 'GTDCards';

    // Note: plain model, move to models namespace
    function Card(guid, id, status, type, text) {
        var self = this;

        self.guid = guid;
        self.id = id;
        self.text = text;
        self.type = type
        self.status = status || 0;

        return self;
    }

    // TODO: consider moving to separate file (or renaming app.js to cardManager.js)
    function CardManager() {
        var self = this;

        self.cards = [];

        self.init = function () {
            loadCards(loadCompleteHandler)
        }

        function loadCards(successCallback) {

            var isLoaded = false;
            if (Modernizr.localstorage) {
                isLoaded = loadFromLocalStorage();
            }

            if (!isLoaded) {
                loadFromServer(successCallback);
            } else {
                successCallback();
            }
        };

        function saveCards() {
            if (Modernizr.localstorage) {
                saveInLocalStorage();
            } else {
                saveOnServer();
            }
        }

        function loadFromLocalStorage() {
            var cards = JSON.parse(localStorage[localStorageCardsKey]);

            self.cards = cards || [];

            return !!cards;
        }

        function loadFromServer(successCallback) {
            GTDapp.dataService.tasks.get()
                .success(function (data) {

                    if (data) {
                        // Note: data should be plain json array
                        self.cards = data;

                        successCallback();
                    }
                })
                .error(function (data) {
                    alert('If you are using Chrome, use "--allow-file-access-from-files"'
                        + ' key at startup to allow local json file upload');
                });
        }

        function saveInLocalStorage() {
            localStorage[localStorageCardsKey] = JSON.stringify(self.cards);
        }

        function saveOnServer() {
            // TODO: we do not support server-side save at the moment
        }

        function loadCompleteHandler() {
            layoutHelper.loadTemplates(function () {
                renderData();
            });

            $(document)
                .on(eventNames.GTDCardNew, newCardHandler)
                .on(eventNames.GTDCardEdit, editCardHandler)
                .on(eventNames.GTDCardMove, moveCardHandler)
                .on(eventNames.GTDCardSave, saveCardHandler)
                .on(eventNames.GTDCardDelete, deleteCardHandler);
        }

        function renderData() {
            for (var i = 0, length = self.cards.length; i < length; ++i) {
                layoutHelper.addCard(self.cards[i]);
            }
        };

        function newCardHandler(e) {
            var guid = newGuid();

            var card = new Card(guid, null, 0);

            layoutHelper.showNewCardDialog(card);
        }

        function editCardHandler(e) {
            var guid = e.cardId;

            var card = $($.grep(self.cards, function (c) {
                return c.guid === guid;
            })).get(0);

            layoutHelper.showEditCardDialog(card);
        }

        function moveCardHandler(e) {
            var guid = e.cardId;

            var card = $($.grep(self.cards, function (c) {
                return c.guid === guid;
            })).get(0);

            var cardStatus = statuses[e.cardStatus];
            if (card.status != cardStatus) {
                card.status = cardStatus;
                layoutHelper.moveCard(card);

                saveCards();
            }
        }

        function saveCardHandler(e) {
            if (e.isNew) {
                newCard(e)
            } else {
                updateCard(e);
            }

            saveCards();
        }

        function deleteCardHandler(e) {
            deleteCard(e);

            saveCards();
        }

        function newCard(e) {
            var newDisplayId = getMaxValue(self.cards, 'id') + 1;
            var card = new Card(e.cardId, newDisplayId, 0, e.cardType, e.cardText);

            self.cards.push(card);

            layoutHelper.addCard(card);
        }

        function updateCard(e) {
            var guid = e.cardId;

            var card = $($.grep(self.cards, function (c) {
                return c.guid === guid;
            })).get(0);


            card.text = e.cardText;
            card.type = e.cardType;

            layoutHelper.updateCard(card);
        }

        function deleteCard(e) {
            var guid = e.cardId;

            var card = $($.grep(self.cards, function (c) {
                return c.guid === guid;
            })).get(0);

            self.cards.splice($.inArray(card, self.cards), 1);

            layoutHelper.deleteCard(card);
        }

        return self;
    }

    var cardManager = new CardManager();

    cardManager.init();

})(window, jQuery);