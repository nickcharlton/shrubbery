window.addEvent('domready', function() {
    var editor = CodeMirror.fromTextArea('code', {
        parserfile: ["parsepython.js"],
        stylesheet: "static/env/codemirror/css/pythoncolors.css",
        path: "static/env/codemirror/js/",
        lineNumbers: true,
        textWrapping: false,
        indentUnit: 4,
        height: "160px",
        fontSize: "9pt",
        autoMatchParens: true,
        parserConfig: {'pythonVersion': 2, 'strictErrors': true},
        initCallback: rest
    });

    $('clearoutput').addEvent('click', function(e) {
        e.stop();
        $('edoutput').set('text', '');
    });

    function rest(editor) {
        editor.focus();
        editor.grabKeys(function(e) {
                    if (e.keyCode === 13) {
                        var output = $('edoutput');
                        var outf = function(text) {
                            output.set('html', output.get('html') + text.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "<br/>"));
                        };
                        Sk.configure({output:outf});
                        if (e.ctrlKey) {
                            e.stop();
                            eval(Sk.importMainWithBody("<stdin>", false, editor.getCode()));
                            new Fx.Scroll('edoutput').toBottom();
                        }
                        else if (e.shiftKey) {
                            e.stop();
                            eval(Sk.importMainWithBody("<stdin>", false, editor.selection()));
                            new Fx.Scroll('edoutput').toBottom();
                        }
                    }
                }, function(e) {
                    return (e.ctrlKey || e.shiftKey) && e.keyCode === 13;
                });
    }
});
