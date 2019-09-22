let instagram_url = "https://www.instagram.com/graphql/query/?query_id=17888483320059182&id=11617191838&first=999999"
$.getJSON(instagram_url, function(data) {
    let edges = data.data.user.edge_owner_to_timeline_media.edges;
    edges.forEach(function(edge) {
        let caption = edge.node.edge_media_to_caption.edges[0].node.text;
        let post = $($('template#instagram-post').html());
        console.log(edge.node.taken_at_timestamp);
        let date = new Date(1000*edge.node.taken_at_timestamp);
        console.log(date);
        post.find('.datetime').text(date.toLocaleDateString(undefined, {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }));
        // add the src to the image tag
        post.find('.instagram-picture').attr('src', edge.node.thumbnail_resources[4].src);
        post.find('.instagram-caption').text(caption);
        
        $('#instagram-container').append(post);
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
