'use strict';
angular.module('services').factory('ErrorAdapter', ['ErrorReporter', function (ErrorReporter) {
    var errorAdapter = {
        removeErrorsForQuestion: removeErrorsForQuestion,
        hasErrorForQuestion: hasErrorForQuestion,
        getErrorsForQuestion: getErrorsForQuestion
    };

    function removeErrorsForQuestion(question) {
        ErrorReporter.removeError(question.id);
        ErrorReporter.removeErrors(question.relatedQuestionIds);
    }

    function hasErrorForQuestion(question) {
        return ErrorReporter.hasErrorsFor(question.id);
    }

    function getErrorsForQuestion(question) {
        return ErrorReporter.getErrors(question.id);
    }

    return errorAdapter;
}
]);
