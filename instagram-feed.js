document.addEventListener('DOMContentLoaded', function () {
    var button = document.getElementById('instagram-show-more');
    var more = document.getElementById('instagram-more');
    var container = document.getElementById('instagram-container');
    if (!button || !more || !container) {
        return;
    }

    button.addEventListener('click', function () {
        container.appendChild(more.content.cloneNode(true));
        if (window.instgrm) {
            window.instgrm.Embeds.process();
        }
        button.parentNode.remove();
    });
});
