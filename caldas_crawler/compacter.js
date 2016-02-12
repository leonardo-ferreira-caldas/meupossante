exports.compact = function(url) {

    var stringsToRemove = [
        "https://www.webmotors.com.br/anunciante/login?action=salvaranuncio&returnUrl=",
        "http://www.webmotors.com.br/anunciante/login?action=salvaranuncio&returnUrl=",
        "https://www.webmotors.com.br/anunciante/login?action=login&returnUrl=",
        "http://www.webmotors.com.br/anunciante/login?action=login&returnUrl=",
        ":80",
        "http://www.webmotors.com.br",
        "http://webmotors.com.br"
    ];

    for (var i = 0; i < stringsToRemove.length; i++) {
        url = url.toString().replace(stringsToRemove[i], "").trim();
    }

    return url;

};

exports.uncompact = function(url) {
    return "http://www.webmotors.com.br" + url;
};