// helpers
htmlRenderImg = function(src, type){
    return $('<img/>', {src: src, class: 'img-thumbnail img-responsive'});
};

htmlRenderEmpty = function(src, type){
    var el = $('<div/>', {src: src, class: 'img-thumbnail img-empty'});
    $('<div/>', {class: 'fa fa-file-text fa-3x', style: ""}).appendTo(el);
    return el;
};

inputHtmlByType = function(src, type){
    // map mimetype to html
    if(type.startsWith("image/")){
        return htmlRenderImg(src, type);
    } else {
        return htmlRenderEmpty(src, type);
    }
}

// media class element wrapper
$.fn.media = function() {
    // iterate all media elements
    this.each(function(){
        var t = $(this);
        var input_src = t.attr('src');
        var input_type = t.attr('type');
        var input_name = t.attr('name');
        var input_size = t.attr('size');
        // img wrapper
        var media = $('<div/>', {class: "media-wrapper"});
        var media_img = $('<div/>', {class: "media-img col-sm-4"});
        // select different type wrapper
        inputHtmlByType(input_src, input_type).appendTo(media_img);
        media_img.appendTo(media);
        // media info body
        var media_body = $('<div/>', {class: "media-body col-sm-8"});
        var name = $('<p/>', {class: "file-name", style: "word-wrap: break-word;", text: input_name});
        name.appendTo(media_body);
        var type = $('<p/>', {class: "file-type", text: input_type});
        type.appendTo(media_body);
        var size = $('<p/>', {class: "file-size", text: input_size+ "Kb"});
        size.appendTo(media_body);
        media_body.appendTo(media);
        // replace html
        $(this).replaceWith(media);
    })

    // this.each(function() {
    //   var this = $(this);
    //   console.log(this);
    //   var html = $this.data('media.origHTML');
    //   if (html)
    //     $this.replaceWith(html);
    // });


};
