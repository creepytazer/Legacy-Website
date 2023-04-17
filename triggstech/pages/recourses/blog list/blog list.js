if (document.readyState == "loading") {
    document.addEventListener("DOMContentLoaded", ready);
} else {
    ready();
}
function ready() {
    hideSubPosts();
    postEventInitiater();
}

// Start Page, Only Show First Six SubBlogs
function hideSubPosts() {
    subPosts = document.getElementById("sub-posts").children
    if (subPosts.length <= 1) {
        return
    }
    for (i = 1; i < subPosts.length; i++) {
        subPosts[i].style.height = '0px';
    }
    const dropDown = document.getElementById('show-more');
    const dropUp = document.getElementById('show-less');

    dropDown.addEventListener('click', showMore);
    dropUp.addEventListener('click', showLess)
    updateDisplayBars(1)
}

// Hide and Show Content
var subPostIndex = 1
function showMore() {
    var subPosts = document.getElementById("sub-posts").children
    if (subPostIndex < subPosts.length) {
        unCollapse(subPosts[subPostIndex])
        subPostIndex++
    }
    updateDisplayBars(subPostIndex)
}
function unCollapse(target) {
  var sectionHeight = target.scrollHeight;

  target.style.height = sectionHeight + 'px';

  target.addEventListener('transitionend', function(e) {
    target.removeEventListener('transitionend', arguments.callee);
    
    target.style.height = null;
  });
  
}

function showLess() {
    var subPosts = document.getElementById("sub-posts").children
    if (subPostIndex - 1 > 0) {
        collapse(subPosts[subPostIndex - 1]);
        subPostIndex--;
    }
    updateDisplayBars(subPostIndex)
}
function collapse(target) {
    var height = target.scrollHeight;
    var targetTransition = target.style.transition;

    requestAnimationFrame(function() {
        target.style.height = height + 'px';
        target.style.transition = targetTransition
        requestAnimationFrame(function() {
            target.style.height = '0px'
        })
    })
}

function updateDisplayBars(index) {
    
    var subPostsLength = document.getElementById("sub-posts").children.length
    var displayBars = document.getElementById('showMoreLess').children
    if (subPostsLength == 1) {
        return
    }
    if (index > 1 && index < subPostsLength) {
        displayBars[0].classList.add('show-bar')
        displayBars[1].classList.add('show-bar')
    } else if (index <= 1) {
        displayBars[0].classList.add('show-bar')
        displayBars[1].classList.remove('show-bar')
    } else {
        displayBars[0].classList.remove('show-bar')
        displayBars[1].classList.add('show-bar')
    }
}

function postEventInitiater() {
    var posts = document.getElementsByClassName('blog-post')
    for (var i = 0; i < posts.length; i++) {
        posts[i].addEventListener('mouseover', (event) => {
            var element = event.currentTarget
            console.log(element)
            element.style.border = '7px solid rgba(216, 216, 216, 0.850)';
            element.style['box-shadow'] = '0 5px 10px 15px rgba(90, 93, 109, 0.1),0 15px 40px rgba(255, 255, 255, 0.774)';
        })
        posts[i].addEventListener('mouseout', (event) => {
            var element = event.currentTarget
            console.log(element)
            element.style.border = '7px solid rgba(245, 244, 244, 0.973)';
            element.style['box-shadow'] = '0 5px 10px 15px rgba(154,160,185,.1),0 15px 40px rgba(255, 255, 255, 0.774)';
        })
    }
}