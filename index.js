var jsdom = require("jsdom");
$ = require("jquery")(jsdom.jsdom().defaultView);
var CLI = require('clui'),
clc = require('cli-color');

clearWindow();
getData();
setInterval(getData, 90000);

function getData(id){

    $.ajax({
        url: 'https://api.github.com/repos/jam3sn/ClickPalette/releases',
        method: 'GET',
        success: function(data){
            var rows = [];
            data.forEach(function(release, index){
                var row = {};
                row.version = String(release.tag_name);

                release.assets.forEach(function(asset){
                    if ( asset.name.toLowerCase().includes('mac') ){
                        row.mac = String(asset.download_count);
                    } else if ( asset.name.toLowerCase().includes('win') ){
                        row.win = String(asset.download_count);
                    }
                });
                rows.push(row);


            });

            display(rows);
        },
        error: function(error){
            console.log(error);
        }
    });
}


function display(rows){
    var Line      = CLI.Line,
    LineBuffer    = CLI.LineBuffer;

    var outputBuffer = new LineBuffer({
        x: 2,
        y: 1,
        width: 'console',
        height: 'console'
    });

    var line = new Line(outputBuffer)
    .column('------------------------------------------------------------', 60, [clc.blackBright])
    .fill()
    .store();

    var message = new Line(outputBuffer)
    .column('|', 20, [clc.blackBright])
    .column('    ClickPalette ', 18, [clc.green])
    .column(' ', 20, [clc.blackBright])
    .column('|', 1, [clc.blackBright])
    .fill()
    .store();

    var line = new Line(outputBuffer)
    .column('------------------------------------------------------------', 60, [clc.blackBright])
    .fill()
    .store();

    var blankLine = new Line(outputBuffer)
    .fill()
    .store();

    var header = new Line(outputBuffer)
    .column('Version', 20, [clc.cyan])
    .column('macOS', 20, [clc.cyan])
    .column('Windows', 20, [clc.cyan])
    .fill()
    .store();

    var line = new Line(outputBuffer)
    .column('------------------------------------------------------------', 60, [clc.blackBright])
    .fill()
    .store();

    if ( rows != undefined && rows != false ){
        rows.forEach(function(row, index){
            line = new Line(outputBuffer)
            .column(row.version, 20, [clc.white])
            .column(row.mac, 20, [clc.white])
            .column(row.win, 20, [clc.white])
            .fill()
            .store();
        });
    }

    outputBuffer.output();

}

function clearWindow(){
    var lines = process.stdout.getWindowSize()[1];
    for(var i = 0; i < lines; i++) {
        console.log('\r\n');
    }
}
