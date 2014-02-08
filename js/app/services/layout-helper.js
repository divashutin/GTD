(function (window, $) {

    var cardTemplateSelector = '#cardTemplate';

    var deckContainerSelector = '#deckContainer';
    var cardHolderSelector = '.card-list';

    var editModalSelector = '#editModal';
    var editCardIdSelector = '#editCardId';
    var editCardTextSelector = '#editCardText';
    var editCardTypeSelector = '#editCardType';

    var saveChangesSelector = '.save-changes';
    var addCardSelector = '.add-card';

    var draggableCardSelector = '.draggable-card';

    var newEditDialogClasses = {
        newMode: 'new',
        editMode: 'edit'
    }

    var markup = {
        containers: {
            todo: 'todoList',
            progress: 'progressList',
            done: 'doneList'
        }
    };

    function LayoutHelper() {
        var self = this;

        var eventNames = GTDapp.config.events;

        self.addCard = function (card) {
            // todo: add null checks
            var containerId = markup.containers[
                GTDapp.config.cardStatusMap[card.status]
                ];

            var $card = createCard(card);

            $('#' + containerId).append($card);
        };

        self.deleteCard = function (card) {
            var $card = $(deckContainerSelector)
                .find('#' + card.guid);

            unsubscribeCard($card);

            $card.remove();
        };

        self.moveCard = function (card) {
            self.deleteCard(card);
            self.addCard(card);
        };

        self.updateCard = function (card) {
            var $card = createCard(card);

            $(deckContainerSelector)
                .find('#' + card.guid)
                .replaceWith($card);
        };

        self.attachContainerHandlers = function () {
            $(cardHolderSelector).droppable({
                drop: function (event, ui) {

                    var e = jQuery.Event(eventNames.GTDCardMove);

                    var card = ui.draggable.first();
                    var targetList = this;

                    e.cardStatus = $(targetList).data('status');
                    e.cardId = card.attr('id')

                    $(document).trigger(e);

                    // HACK: remove style added by jquery ui to change cursor on drag,
                    // TODO: check what event is not fired to return cursor back to auto
                    $('body').css('cursor', 'auto');
                },
                hoverClass: 'drop-hover'
            });

            /* EDIT and DELETE functionality */
            $(cardHolderSelector)
                .on('click', '.glyphicon-edit', function (e) {

                    var e = jQuery.Event(eventNames.GTDCardEdit);

                    e.cardId = $(this).parents(draggableCardSelector).attr('id')

                    $(deckContainerSelector).trigger(e);
                })
                .on('click', '.glyphicon-remove', function (e) {
                    var e = jQuery.Event(eventNames.GTDCardDelete);

                    e.cardId = $(this).parents(draggableCardSelector).attr('id')

                    $(deckContainerSelector).trigger(e);
                });

            /* NEW CARD functionality */
            $(addCardSelector).click(function (e) {
                var e = jQuery.Event(eventNames.GTDCardNew);
                $(deckContainerSelector).trigger(e);
            });

            /* SAVE CHANGES functionality */
            $(editModalSelector).find(saveChangesSelector).click(function (ev) {
                var editModal = $(this).parents(editModalSelector);

                var e = jQuery.Event(eventNames.GTDCardSave);

                e.isNew = editModal.hasClass(newEditDialogClasses.newMode);

                e.cardId = editModal.find(editCardIdSelector).val();
                e.cardText = editModal.find(editCardTextSelector).val();
                e.cardType = editModal.find(editCardTypeSelector).val();

                editModal.modal('hide')

                $(deckContainerSelector).trigger(e);
            });
        };

        self.loadTemplates = function (successHandler, errorHandler) {
            $(deckContainerSelector)
                .load(GTDapp.config.templates.deck, function (response, status, xhr) {
                    if (status != 'error') {
                        self.attachContainerHandlers();

                        if (successHandler) {
                            successHandler();
                        }
                    } else {
                        if (errorHandler) {
                            errorHandler();
                        }
                    }
                });
        };

        self.showEditCardDialog = function (card) {
            showNewEditDialog(
                card,
                newEditDialogClasses.editMode,
                newEditDialogClasses.newMode);
        };

        self.showNewCardDialog = function (card) {
            showNewEditDialog(
                card,
                newEditDialogClasses.newMode,
                newEditDialogClasses.editMode);
        };

        function showNewEditDialog(card, classToAdd, classToRemove) {
            var $editModal = $(editModalSelector);

            $editModal.removeClass(classToRemove).addClass(classToAdd);

            $editModal.find(editCardIdSelector).val(card.guid);
            $editModal.find(editCardTextSelector).val(card.text);

            if (card.type) {
                $editModal.find(editCardTypeSelector).val(card.type);
            }

            $editModal.modal('show');
        }

        function createCard(card) {
            var $card = $($(cardTemplateSelector).render(card));

            subscribeCard($card);

            return $card;
        }

        function subscribeCard($card) {
            $card.draggable({
                cursor: 'move',
                revert: true
            });
        }

        function unsubscribeCard($card) {
            $card.draggable('destroy');
        }



        return self;
    }

    window.addToNamespace('GTDapp', {
        layoutHelper: new LayoutHelper()
    });

})(window, jQuery);