let instagram_url = "/feed.json";
$.getJSON(instagram_url, function(data) {
	data.data.user.edge_owner_to_timeline_media.edges.forEach(function(edge) {
        console.log(edge);
		let htmlPost = $($('template#instagram-post').html());
		let date = new Date(1000 * edge.node.taken_at_timestamp);
		htmlPost.find('.datetime').text(date.toLocaleDateString(undefined, {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }));
        // add the src to the image tag
        htmlPost.find('.instagram-picture').attr('src', edge.node.display_url);
        htmlPost.find('.instagram-caption').text(edge.node.edge_media_to_caption.edges[0].node);

        $('#instagram-container').append(htmlPost);
		
	});
    initMasonry();
});

function initMasonry() {
    $(document).ready(function() {
        $('.grid').imagesLoaded(function () {
            console.log('images loaded');
            $('.grid').masonry({
                itemSelector: '.grid-item',
                columnWidth: '.grid-item',
            });
        });
    });
}
