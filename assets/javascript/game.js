
// Initial array of movies
var giphyAnimnal = ["Duck", "Rabbit", "Chicken"];
var giphyURL = [];
var imgURL = [];
var giphySelectCount;
var offsetCount = 0
var rating = [];
var test

$(document).ready(function () {

    function renderButtons() {
        $("#buttons-view").empty();
        for (var i = 0; i < giphyAnimnal.length; i++) {
            var a = $("<button>")
            a.addClass("btn btn-primary  btn-block giphy-btn ")
            a.attr("giphy-name", giphyAnimnal[i])
            a.html(giphyAnimnal[i])
            $("#buttons-view").append(a);
            //  debugger;
        }
    }

    $("#add-giphy").on("click", function (event) {
        event.preventDefault();
        var giphy = $("#giphy-input").val().trim();
        console.log(giphy);
        giphyAnimnal.push(giphy);
        console.log(giphyAnimnal)
        renderButtons();
    })


    renderButtons();

    function displaygiphyInfo() {
        // giphyURL = [];
        // imgURL = [];
        gifIndex = 0;
        $("#giphy-view").empty();
        $("#filter").empty();
        //recreating the Show All filter button

        var spanShowAll = $("<span>")
        spanShowAll.addClass("badge badge-light ml-2")
        spanShowAll.attr("id", "filterResult")
        // b.html(testRatingCount[z])

        var filtrShowAll = $("<button>")
        filtrShowAll.addClass("btn btn-primary filter mr-1")
        filtrShowAll.attr("type", "button")
        filtrShowAll.attr("rating", "none")
        filtrShowAll.html("Show All")
        // a.attr("giphy-name", giphyAnimnal[i])
        // b.html(testRating[z]+)
        // $("#buttons-view").append(a);
        filtrShowAll.append(spanShowAll)
        $("#filter").append(filtrShowAll);



        var giphySelect = $(this).attr("giphy-name");
        if (giphySelectCount == giphySelect) {

            offsetCount++
        } else {
            giphySelectCount = giphySelect
            offsetCount = 0
            giphyURL = [];
            imgURL = [];
            rating = [];
        }

        var offset = offsetCount * 10
        console.log("user selected: " + giphySelect)
        console.log("limit: " + offset)

        var giphyKey = "sxvF5hviCq56z4ClpvVIYDIpEpCieO0Y"
        var queryURL = "https://api.giphy.com/v1/gifs/search?q=" + giphySelect + "&api_key=" + giphyKey + "&limit=10&offset=" + offset;
        // Creating an AJAX call for the specific giphy button being clicked
        $.ajax({
            url: queryURL,
            method: "GET",

        }).then(function (response) {
            console.log(response);
            console.log(queryURL);

            for (var i = 0; i < response.data.length; i++) {

                // Creating a div to hold the giphy

                // Storing the rating data

                rating.push(response.data[i].rating)
                imgURL.push(response.data[i].images.fixed_width_still.url)
                giphyURL.push(response.data[i].images.fixed_width.url)
            }

            console.log("length of rating array: " + rating.length);
            console.log(rating)
            var ratingCounts = {};
            for (var k = 0; k < rating.length; k++) {
                ratingCounts[rating[k]] = 1 + (ratingCounts[rating[k]] || 0);
            }

            console.log(ratingCounts);

            var testRating = [];
            var testRatingCount = [];

            for (var x in ratingCounts) {
                testRating.push(x)
                testRatingCount.push(ratingCounts[x])
            }

            console.log(testRating)
            console.log(testRating.length)
            console.log(testRatingCount)

            $("#filterResult").html(rating.length);


            for (var z = 0; z < testRating.length; z++) {
                var b = $("<span>")
                b.addClass("badge badge-light ml-2")
                b.attr("id", testRating[z])
                b.html(testRatingCount[z])

                var filtrBtn = $("<button>")
                filtrBtn.addClass("btn btn-primary filter mr-1")
                filtrBtn.attr("type", "button")
                filtrBtn.attr("rating", testRating[z])
                filtrBtn.html(testRating[z])
                // a.attr("giphy-name", giphyAnimnal[i])
                // b.html(testRating[z]+)
                // $("#buttons-view").append(a);
                filtrBtn.append(b)
                $("#filter").append(filtrBtn);
            }




            for (var j = 0; j < rating.length; j++) {
                var giphyDiv = $("<div class='giphy float-left'>");
                // var pOne = $("<p>").html("Rating: " + rating[j]);
                // giphyDiv.append(pOne);
                var image = $("<img>");
                image.attr("src", imgURL[j])
                image.addClass("stillimage m-1")
                image.attr("id", [j])
                image.attr("rating", rating[j])
                // Appending the image
                giphyDiv.append(image);
                // Putting the entire giphy above the previous giphy
                $("#giphy-view").append(giphyDiv);
            }

        });
    }

    $(document).on("click", ".giphy-btn", displaygiphyInfo);
    $(document).on("click", ".stillimage", function () {
        alert("gif selected");
        $(this).removeClass("stillimage").addClass("restore")
        var gifAttr = $(this).attr("id")
        console.log("attribute of selected gif: " + gifAttr)
        var gifIndex = parseInt(gifAttr);
        console.log(gifIndex);
        $("#" + [gifIndex]).attr("src", giphyURL[gifIndex]);
    })

    $(document).on("click", ".restore", function () {
        $(this).removeClass("restore").addClass("stillimage")
        var gifAttr = $(this).attr("id")
        console.log("attribute of selected gif: " + gifAttr)
        var gifIndex = parseInt(gifAttr);
        console.log(gifIndex);
        $("#" + [gifIndex]).attr("src", imgURL[gifIndex]);
    });

    $(document).on("click", ".filter", function () {
        var filterAttr = $(this).attr("rating")
        $("img").each(function () {
            $(this).removeClass("hide")
        })
        if (filterAttr == "none") {
            console.log("show all selected")
            $("img").each(function () {
                $(this).removeClass("hide")
            })
        } else {
            console.log("button selected: " + filterAttr)
            $("img").each(function () {
                var filterRating = $(this).attr("rating")
                if (filterRating != filterAttr) {
                    $(this).addClass("hide")
                }
            });
        }




    })

});