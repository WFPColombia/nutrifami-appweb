nf2.filter("trust", ['$sce', function ($sce) {
        return function (htmlCode) {
            return $sce.trustAsHtml(htmlCode);
        };
    }]);

nf2.filter('format', function () {
    return function (input) {
        input = input || '';
        if (input.slice(0, 3) !== '<p>') {
            input = "<p>" + input + "</p>";

        }
        return input;
    };
});


nf2.filter('stripHTML', function () {
    return function (input) {
        input = input || '';
        input.replace(/<(?:.|\n)*?>/gm, '');
        return input;
    };
});
