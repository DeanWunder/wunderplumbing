let instagram_url = "https://wunderplumbing.com.au/instagram_downloaded.json"
$.getJSON(instagram_url, function(data) {
	data.forEach(function(post) {
		let htmlPost = $($('template#instagram-post').html());
		let date = new Date(1000*post.date);
		htmlPost.find('.datetime').text(date.toLocaleDateString(undefined, {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }));
        // add the src to the image tag
        htmlPost.find('.instagram-picture').attr('src', 'img/' + post.image_url);
        htmlPost.find('.instagram-caption').text(post.caption);

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
