(function (angular) {
    'use strict';
    angular.module('colorbreaker')
    .controller('gameController', function($scope) {
        var emptyRow = [null, null, null, null].map(function() {return {color: '', active: false};}),
            emptyFeedback = ['', '', '', ''];
        $scope.colors = ['red', 'orange', 'yellow', 'green', 'teal', 'blue', 'purple', 'brown'];
        $scope.activePin = null;
        $scope.rows = [];
        $scope.victory = false;
        $scope.showHelp = false;

        function codeMaker() {
            var _hiddenCombination = [null, null, null, null];

            function resetHiddenCombination() {
                var colors = angular.copy($scope.colors);
                _hiddenCombination = [null, null, null, null].map(function() {
                    return colors.splice(Math.floor(Math.random() * colors.length), 1)[0];
                });
            }

            function giveFeedback() {
                var feedbackPinIter = 0;
                var lastRow = $scope.rows[$scope.rows.length-1];
                hiddenCombinationClone = angular.copy(_hiddenCombination);
                // Checking for black pegs
                lastRow.pins.forEach(function(pin, pinIndex) {
                    if(hiddenCombinationClone[pinIndex] === pin.color) {
                        lastRow.feedback[feedbackPinIter] = 'black';
                        hiddenCombinationClone[pinIndex] = 'checked';
                        feedbackPinIter++;
                    }
                });
                // Checking for white pegs
                lastRow.pins.forEach(function(pin, pinIndex) {
                    var combinationPinIndex = hiddenCombinationClone.indexOf(pin.color);
                    if(combinationPinIndex >= 0) {
                        lastRow.feedback[feedbackPinIter] = 'white';
                        hiddenCombinationClone[combinationPinIndex] = 'checked';
                        feedbackPinIter++;
                    }
                });
                lastRow.feedback.sort(function(a, b) {
                    return !b || a < b ? -1 : 1;
                });
                var win = lastRow.feedback.every(function(color) {
                    return color === 'black';
                });
                if(win) {
                    $scope.victory = true;
                } else {
                    createNewRow();
                }
            }

            return {
                resetHiddenCombination: resetHiddenCombination,
                giveFeedback: giveFeedback
            };
        }

        function createNewRow() {
            $scope.rows.push({pins: angular.copy(emptyRow), feedback: angular.copy(emptyFeedback)});
        };

        $scope.play = function() {
            $scope.victory = false;
            $scope.rows = [];
            createNewRow();
            $scope.codeMaker.resetHiddenCombination();
        };

        $scope.pinClicked = function(pin) {
            if($scope.activePin) {
                $scope.activePin.active = false;
            }
            $scope.activePin = pin;
            $scope.activePin.active = true;
        };

        $scope.selectColor = function(color) {
            $scope.activePin.color = color;
            $scope.activePin.active = false;
            $scope.activePin = null;
        };

        $scope.getPinClass = function(pin) {
            var classes = [];
            if(pin.active) {
                classes.push('active');
            }
            if(pin.color) {
                classes.push(pin.color + '-pin');
            } else {
                classes.push('hole-pin');
            }
            return classes;
        };

        $scope.getFeedbackPinClass = function(pin) {
            return pin ? pin + '-feedback-pin' : '';
        };

        $scope.lastRowIsFilled = function() {
            return $scope.rows[$scope.rows.length-1].pins.every(function(pin) {
                return pin.color;
            });
        };
        
        $scope.showHelpModal = function() {
            $scope.showHelp = true;
        };

        $scope.codeMaker = codeMaker();

        $scope.play();
    });
})(angular);