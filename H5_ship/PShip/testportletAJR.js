/**
 *@NApiVersion 2.x
 *@NScriptType Portlet
 */
define([],
    function() {
        function render(params) {
            params.portlet.title = 'PSS HTML Portlet';
            var content = '<td><span><b>Ninja inline HTML</b></span></td>';
            params.portlet.html = content;
        }
        return {
            render: render
        };
    });