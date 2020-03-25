function beforeLoad(type, form) {
    if (nlapiGetRecordId() != '' && nlapiGetRecordId() != null) {
        AddSnapshotButton(form);
    }
}

function AddSnapshotButton(form){
    nlapiLogExecution('debug', 'button clicked');
    form.setScript('customscript_h5_snap_vendorbill_blue');
    form.addButton('custpage_snapshot', 'Snapshot', 'screenshotPage()');
}


function docparserFile(){
    var url = 'https://api.docparser.com/v1/document/media/QE9xW_A7UC_hnLOOJTKmvfEhvpZvzjJEwxbBvHoM1Xkk3Nyu_jX--KS4awwdYL2EGyXL4MoVOxFT0BOqr7REVc_afIQ8A3M3OzkmmhpaFPQ';
    var response = nlapiRequestURL(url);
    var contents = response.getBody();
    nlapiLogExecution('debug', 'test', contents);
    var fileObj = nlapiCreateFile('docparser.pdf', 'PDF', contents);
    fileObj.setFolder('13175813');
    nlapiSubmitFile(fileObj);
}




function urlsToAbsolute(nodeList) {
        if (!nodeList.length) {
            return [];
        }
        var attrName = 'href';
        if (nodeList[0].__proto__ === HTMLImageElement.prototype || nodeList[0].__proto__ === HTMLScriptElement.prototype) {
            attrName = 'src';
        }
        nodeList = [].map.call(nodeList, function (el, i) {
            var attr = el.getAttribute(attrName);
            if (!attr) {
                return;
            }
            var absURL = /^(https?|data):/i.test(attr);
            if (absURL) {
                return el;
            } else {
                return el;
            }
        });
        return nodeList;
    }

function screenshotPage() {
    nlapiLogExecution('debug', 'start snapshot');
    var recordId = nlapiGetRecordId();
        urlsToAbsolute(document.images);
        urlsToAbsolute(document.querySelectorAll("link[rel='stylesheet']"));
        var screenshot = document.documentElement.cloneNode(true);
        var b = document.createElement('base');
        b.href = document.location.protocol + '//' + location.host;
        var head = screenshot.querySelector('head');
        head.insertBefore(b, head.firstChild);
        screenshot.style.pointerEvents = 'none';
        screenshot.style.overflow = 'scroll';
        screenshot.style.webkitUserSelect = 'none';
        screenshot.style.mozUserSelect = 'none';
        screenshot.style.msUserSelect = 'none';
        screenshot.style.oUserSelect = 'none';
        screenshot.style.userSelect = 'none';
        screenshot.dataset.scrollX = window.scrollX;
        screenshot.dataset.scrollY = window.scrollY;
        var script = document.createElement('script');
        script.textContent = '(' + addOnPageLoad_.toString() + ')();';
        screenshot.querySelector('body').appendChild(script);
        var blob = new Blob([screenshot.outerHTML], {
            type: 'text/html'
        });

    nlapiLogExecution('debug', 'raw  ', screenshot.outerHTML);
    var url = 'https://tstdrv1555013.app.netsuite.com/app/site/hosting/scriptlet.nl?script=179&deploy=1';
    var recId = recordId;
    var response = nlapiRequestURL(url, screenshot.outerHTML);
    var fileId = response.getBody();
    nlapiLogExecution('debug', 'recordId ', recId);
    nlapiLogExecution('debug', 'response from Suitelet', fileId);
    alert('File ' + fileId + ' was saved');


    }

function addOnPageLoad_() {
        window.addEventListener('DOMContentLoaded', function (e) {
            var scrollX = document.documentElement.dataset.scrollX || 0;
            var scrollY = document.documentElement.dataset.scrollY || 0;
            window.scrollTo(scrollX, scrollY);
        });
    }

function generate() {
        nlapiLogExecution('debug', 'made it to generate');
        window.URL = window.URL || window.webkitURL;
        window.open(window.URL.createObjectURL(screenshotPage()));
    }
