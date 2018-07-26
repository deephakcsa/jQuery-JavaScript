var users = [];
var posts = [];
var comments = [];
if (localStorage.getItem("users_id") && localStorage.getItem("comments_id") && localStorage.getItem("posts_id") && localStorage.getItem("users") && localStorage.getItem("posts") && localStorage.getItem("comments")) {
    users = JSON.parse(localStorage.getItem("users") || "[]");
    posts = JSON.parse(localStorage.getItem("posts") || "[]");
    comments = JSON.parse(localStorage.getItem("comments") || "[]");
    posts_id = localStorage.getItem("posts_id");
    comments_id = localStorage.getItem("comments_id");
    users_id = localStorage.getItem("users_id");

    $(".container").append('<button id="add_post_btn">Add Post</button>');
    $(".container").append(`<form id="add_post">
        name: 
        <input type="text" name="name" required><br>
        title: 
        <input type="text" name="title" required><br>
        body:<br>
        <textarea rows="4" cols="100" name="body" required></textarea><br>
        <input type="submit" value="Submit">
      </form>`);
    $('#add_post_btn').click(function () {
        $('#add_post').slideToggle('slow');
    });
    $('#add_post').css({ 'display': 'none' });
    $('#add_post').submit(function () {
        var obj = {};
        var elements = this.querySelectorAll("input, select, textarea");
        for (var i = 0; i < elements.length; ++i) {
            var element = elements[i];
            var name = element.name;
            var value = element.value;
            if (name) {
                obj[name] = value;
            }
        }
        obj["id"] = posts_id++;
        obj["userId"] = users_id++;
        var obj_usr = { "id": obj["userId"], "name": obj["name"] };
        delete obj["name"];
        posts.push(obj);
        users.push(obj_usr);
        localStorage.setItem("users", JSON.stringify(users));
        localStorage.setItem("posts", JSON.stringify(posts));
        localStorage.setItem("users_id", users_id);
        localStorage.setItem("posts_id", posts_id);
        console.log(users);
        console.log(posts);
    });

    var post_count = 0;

    jQuery(window).on('scroll', function () {
        if ($(this).scrollTop() + window.innerHeight >= $(this).innerHeight()) {
            //load_posts(post_count++);
            if(post_count<posts.length){
                for (var i = post_count; i<post_count+20 && i<posts.length; i++) {
                    var name = get_name(JSON.parse(posts[i].userId));
                    var title = (posts[i].title);
                    var body = (posts[i].body);
                    var post_comments = get_comments(JSON.parse(posts[i].id));
                    viewPost(posts[i], name, post_comments);
                }
                post_count = post_count+20;
            }
        }
    })


    if(post_count == 0){
        for (var i = post_count; i<post_count+20 && i<posts.length; i++) {
            var name = get_name(JSON.parse(posts[i].userId));
            var title = (posts[i].title);
            var body = (posts[i].body);
            var post_comments = get_comments(JSON.parse(posts[i].id));
            viewPost(posts[i], name, post_comments);
        }
        post_count = post_count+20;
    }

    function viewPost(post, name, post_comments) {
        var div = '<div id="post_' + post.id + '"></div>';
        $(".container").append(div);
        $("#post_" + post.id).append("<p>" + name + "</p>");
        $("#post_" + post.id).append("<p>" + post.title + "</p>");
        $("#post_" + post.id).append("<p>" + post.body + "</p>");
        $("#post_" + post.id).append('<button id="like_btn_' + post.id + '"></button>');
        if (post.like == true) {
            $("#like_btn_" + post.id).html('Unlike');
        } else {
            $("#like_btn_" + post.id).html('Like');
        }
        $("#like_btn_" + post.id).click(function () {
            if (post.like == true) {
                $("#like_btn_" + post.id).html('Like');
                let index = posts.indexOf(post);
                posts[index].like = false;
            } else {
                $("#like_btn_" + post.id).html('Unlike');
                let index = posts.indexOf(post);
                posts[index].like = true;
            }
            localStorage.setItem("posts", JSON.stringify(posts));
            console.log(posts);
        });
        $("#post_" + post.id).append('<button id="del_btn_' + post.id + '">Delete</button>');
        $("#del_btn_" + post.id).click(function () {
            posts.removeValue('id', post.id);
            comments.removeValue('postId', post.id);
            localStorage.setItem("posts", JSON.stringify(posts));
            localStorage.setItem("comments", JSON.stringify(comments));
            console.log(posts);
            console.log(comments);
            $("#post_" + post.id).next().remove();
            $("div").remove("#post_" + post.id);
        });
        $("#post_" + post.id).append('<button id="add_cmnt_' + post.id + '">Add Comment</button>');
        $("#post_" + post.id).append('<button id="p_' + post.id + '">Comments</button>');
        $('#add_cmnt_' + post.id).click(function () {
            $('#add_comments_' + post.id).slideToggle('slow');
        });
        $("#post_" + post.id).append("<br><br>");
        $("#post_" + post.id).append(`<form id="add_comments_` + post.id + `">
        name: 
        <input type="text" name="name" required><br>
        email: 
        <input type="text" name="email" required><br>
        body:<br>
        <textarea rows="4" cols="100" name="body" required></textarea><br>
        <input type="submit" value="Submit">
      </form>`);
        $('#add_comments_' + post.id).submit(function () {
            var obj = {};
            var elements = this.querySelectorAll("input, select, textarea");
            for (var i = 0; i < elements.length; ++i) {
                var element = elements[i];
                var name = element.name;
                var value = element.value;
                if (name) {
                    obj[name] = value;
                }
            }
            obj["id"] = comments_id++;
            obj["postId"] = post.id
            comments.push(obj);
            localStorage.setItem("comments_id", JSON.stringify(comments_id));
            localStorage.setItem("comments", JSON.stringify(comments));
        });
        $("#post_" + post.id).append('<div id="comments_' + post.id + '"></div>');
        for (var i = 0; i < post_comments.length; i++) {
            postComments(post_comments[i], post.id);
        }
        $(".container").append("<br>");
        $("#post_" + post.id).css({
            'padding': '1%', 'width': '98%', 'background-color': '#F1F1F1', 'border-radius': '5px'
        });
        $('#add_comments_' + post.id).css({ 'display': 'none' });
        $('#comments_' + post.id).css({ 'display': 'none' });
        $('#p_' + post.id).click(function () {
            $('#comments_' + post.id).slideToggle('slow');
        });
    }

    function postComments(comment, postid) {
        var div = '<div id="comment_' + comment.id + '"></div>';
        $('#comments_' + postid).append(div);
        $('#comment_' + comment.id).append("<p>" + comment.name + "</p>");
        $('#comment_' + comment.id).append("<p>" + comment.email + "</p>");
        $('#comment_' + comment.id).append("<p>" + comment.body + "</p>");
        $('#comment_' + comment.id).append('<button id="like_cmnt_' + comment.id + '"></button>');
        if (comment.like == true) {
            $("#like_cmnt_" + comment.id).html('Unlike');
        } else {
            $("#like_cmnt_" + comment.id).html('Like');
        }
        $("#like_cmnt_" + comment.id).click(function () {
            if (comment.like == true) {
                $("#like_cmnt_" + comment.id).html('Like');
                let index = comments.indexOf(comment);
                comments[index].like = false;
            } else {
                $("#like_cmnt_" + comment.id).html('Unlike');
                let index = comments.indexOf(comment);
                comments[index].like = true;
            }
            localStorage.setItem("comments", JSON.stringify(comments));
            console.log(comments);
        });
        $('#comment_' + comment.id).append('<button id="del_cmnt_' + comment.id + '">Delete</button>');
        $("#del_cmnt_" + comment.id).click(function () {
            comments.removeValue('id', comment.id);
            localStorage.setItem("comments", JSON.stringify(comments));
            console.log(comments);
            $('#comment_' + comment.id).next().remove();
            $("div").remove('#comment_' + comment.id);
        });
        $('#comments_' + postid).append('<br>')
        $('#comment_' + comment.id).css({
            'padding': '1%', 'width': '80%', 'background-color': 'white', 'border-radius': '5px'
        });
    }

    Array.prototype.removeValue = function (name, value) {
        var array = $.map(this, function (v, i) {
            return v[name] === value ? null : v;
        });
        this.length = 0;
        this.push.apply(this, array);
    }


    function get_name(id) {
        let obj = users.find(x => x.id === id);
        return obj.name;
    }

    function get_comments(id) {
        var post_comments = [];
        for (var i = 0; i < comments.length; i++) {
            if (id == comments[i].postId) {
                post_comments.push(comments[i]);
            }
        }
        return post_comments;
    }


} else {
    $(".container").append('<button id="fetch_data">Fetch Data</button>');
    $("#fetch_data").click(function () {

        $.ajax({
            dataType: "json",
            url: "https://jsonplaceholder.typicode.com/posts",
        }).then(function (data) {
            $.each(data, function (i, x) {
                var id = x.id;
                var userId = x.userId;
                var title = x.title;
                var body = x.body;
                var like = false;
                var obj = { "id": id, "userId": userId, "title": title, "body": body, "like": like };
                posts.push(obj);
            });
            localStorage.setItem("posts", JSON.stringify(posts));
            localStorage.setItem("posts_id", posts.length + 1);
        });

        $.ajax({
            dataType: "json",
            url: "https://jsonplaceholder.typicode.com/users",
        }).then(function (data) {
            $.each(data, function (i, x) {
                var id = x.id;
                var name = x.name;
                var obj = { 'id': id, 'name': name };
                users.push(obj);
            });
            localStorage.setItem("users", JSON.stringify(users));
            localStorage.setItem("users_id", users.length + 1);
        });

        $.ajax({
            dataType: "json",
            url: "https://jsonplaceholder.typicode.com/comments",
        }).then(function (data) {
            $.each(data, function (i, x) {
                var id = x.id;
                var postId = x.postId;
                var name = x.name;
                var email = x.email;
                var body = x.body;
                var like = false;
                var obj = { "id": id, "postId": postId, "name": name, "email": email, "body": body, "like": like };
                comments.push(obj);
            });
            localStorage.setItem("comments", JSON.stringify(comments));
            localStorage.setItem("comments_id", comments.length + 1);
        });

        $(document).ajaxStop(function() { location.reload(true); });

    });
}