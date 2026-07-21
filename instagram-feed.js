$(document).ready(function() {
    $('.grid').masonry({
        itemSelector: '.grid-item',
        columnWidth: '.grid-item',
        percentPosition: true
    });

    // Instagram's embed.js renders each blockquote into an iframe
    // asynchronously with no load event we can hook, so re-layout after
    // a delay once the embeds have had time to render at their real height.
    setTimeout(function() {
        $('.grid').masonry('layout');
    }, 2000);
});
