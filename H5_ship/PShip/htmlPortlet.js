function renderPage(request, response){
    var html += '<!doctype html>';
    html += '<html lang="en">';
    html += '<head>';
    html += '<meta charset="utf-8">';
    html += '<title>accordion demo</title>';
    html += '<link rel="stylesheet" href="//code.jquery.com/ui/1.11.4/themes/smoothness/jquery-ui.css">';
    html += '<script src="//code.jquery.com/jquery-1.10.2.js"></script>';
    html += '<script src="//code.jquery.com/ui/1.11.4/jquery-ui.js"></script>';
    html += '</head>';
    html += '<body>';
    html += '<div id="accordion">';
    html += '<h3>Section 1</h3>';
    html += '<div><p>Mauris mauris ante, blandit et, ultrices a, suscipit eget.Integer ut neque. Vivamus nisi metus, molestie vel, gravida in,condimentum sit amet, nunc. Nam a nibh. Donec suscipit eros.Nam mi. Proin viverra leo ut odio.</p></div><h3>Section 2</h3><div><p>Sed non urna. Phasellus eu ligula. Vestibulum sit amet purus.Vivamus hendrerit, dolor aliquet laoreet, mauris turpis velit,faucibus interdum tellus libero ac justo.</p></div><h3>Section 3</h3><div><p>Nam enim risus, molestie et, porta ac, aliquam ac, risus.Quisque lobortis.Phasellus pellentesque purus in massa.</p><ul><li>List item one</li><li>List item two</li><li>List item three</li></ul></div></div></body></html>';
    response.writePage(html);
}