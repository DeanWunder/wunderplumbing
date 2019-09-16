let instagram_url = "https://www.instagram.com/graphql/query/?query_id=17888483320059182&id=11617191838&first=999999"
$.getJSON(instagram_url, function(data) {
    let edges = data.data.user.edge_owner_to_timeline_media.edges;
    edges.forEach(function(edge) {
        console.log(edge);
        let caption = edge.node.edge_media_to_caption.edges[0].node.text;
        let post = $($('template#instagram-post').html());
        // add the src to the image tag
        post.find('.instagram-picture').attr('src', edge.node.display_url);
        post.find('.instagram-caption').text(caption);
        $('#instagram-container').append(post);
    });
    
});
