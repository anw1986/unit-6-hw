
// Initial array of movies
var giphyAnimnal = ["Duck", "Rabbit", "Chicken"];
var giphyURL = [];
var imgURL = [];
var giphySelectCount;
var offsetCount = 0
var rating = [];
var test

$(document).ready(function () {

    // function to initialize buttons when page is loaded
    function renderButtons() {
        $("#buttons-view").empty();
        for (var i = 0; i < giphyAnimnal.length; i++) {
            var a = $("<button>")
            a.addClass("btn btn-primary  btn-block giphy-btn ")
            a.attr("giphy-name", giphyAnimnal[i])
            a.html(giphyAnimnal[i])
            $("#buttons-view").append(a);
        }
    }

    // Add giphy button on the list
    $("#add-giphy").on("click", function (event) {
        event.preventDefault();
        var giphy = $("#giphy-input").val().trim();
        console.log(giphy);
        giphyAnimnal.push(giphy);
        console.log(giphyAnimnal)
        renderButtons();
    })

    // function is called when the page loads
    renderButtons();

    function displaygiphyInfo() {
        // Initialize and clear giphy div and filter buttons div
        // show filter text and column
        gifIndex = 0;
        $("#giphy-view").empty();
        $("#filter").empty();
        $(".filterText").removeClass("d-none")
        $(".filterCol").removeClass("d-none")

        //create the Show All filter button

        var spanShowAll = $("<span>")
        spanShowAll.addClass("badge badge-light ml-2")
        spanShowAll.attr("id", "filterResult")

        var filtrShowAll = $("<button>")
        filtrShowAll.addClass("btn btn-primary filter mr-2")
        filtrShowAll.attr("type", "button")
        filtrShowAll.attr("rating", "none")
        filtrShowAll.html("Show All")

        filtrShowAll.append(spanShowAll)
        $("#filter").append(filtrShowAll);

        // store user selection giphy in a variable
        // check if the user has clicked on the button to check slection
        // offset by 10 records if the user press the same button repeatedly
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

        // API key and URL string with search giphy, API key, limit and offeset
        var giphyKey = "sxvF5hviCq56z4ClpvVIYDIpEpCieO0Y"
        var queryURL = "https://api.giphy.com/v1/gifs/search?q=" + giphySelect + "&api_key=" + giphyKey + "&limit=10&offset=" + offset;
        // Creating an AJAX call for the specific giphy button being clicked
        $.ajax({
            url: queryURL,
            method: "GET",

        }).then(function (response) {
            // console log response and query URL
            console.log(response);
            console.log(queryURL);

            // store reponse data into rating, still image & animate array
            // push elements into array
            for (var i = 0; i < response.data.length; i++) {

                rating.push(response.data[i].rating)
                imgURL.push(response.data[i].images.fixed_width_still.url)
                giphyURL.push(response.data[i].images.fixed_width.url)
            }

            console.log("length of rating array: " + rating.length);
            console.log(rating)

            // creating an object for rating array. This will provide unique count for every rating
            // these unique count is used in creating the filter buttons
            var ratingCounts = {};
            for (var k = 0; k < rating.length; k++) {
                ratingCounts[rating[k]] = 1 + (ratingCounts[rating[k]] || 0);
            }

            console.log(ratingCounts);

            // creating an array to holding rating and it's respective counts
            var testRating = [];
            var testRatingCount = [];

            // looping through the object ratingCounts and pushing the object key-value pair in arrays
            for (var x in ratingCounts) {
                testRating.push(x)
                testRatingCount.push(ratingCounts[x])
            }

            console.log(testRating)
            console.log(testRating.length)
            console.log(testRatingCount)

            // print the result on the Show All result
            $("#filterResult").html(rating.length);

            // create buttons equal to the length of the testRating array
            // Note: the Show All filter button was created at the beginning
            for (var z = 0; z < testRating.length; z++) {
                var b = $("<span>")
                b.addClass("badge badge-light ml-2")
                b.attr("id", testRating[z])
                b.html(testRatingCount[z])

                var filtrBtn = $("<button>")
                filtrBtn.addClass("btn btn-primary filter mr-2")
                filtrBtn.attr("type", "button")
                filtrBtn.attr("rating", testRating[z])
                filtrBtn.html(testRating[z])
                filtrBtn.append(b)
                $("#filter").append(filtrBtn);
            }

            // dynamically create image tag and append to the gipy-view div
            for (var j = 0; j < rating.length; j++) {
                var giphyDiv = $("<div class='giphy float-left'>");
            
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

    // click event the when the user clicks on the giphy button
    $(document).on("click", ".giphy-btn", displaygiphyInfo);

    // click event the user clicks on the sill still image
    // class is added and removed to listen for additional clicks
    $(document).on("click", ".stillimage", function () {
        alert("gif selected");
        $(this).removeClass("stillimage").addClass("restore")
        var gifAttr = $(this).attr("id")
        console.log("attribute of selected gif: " + gifAttr)
        var gifIndex = parseInt(gifAttr);
        console.log(gifIndex);
        // the source of the image is updated to animate
        $("#" + [gifIndex]).attr("src", giphyURL[gifIndex]);
    })

    // click event the user clicks on the animate gif
    $(document).on("click", ".restore", function () {
        $(this).removeClass("restore").addClass("stillimage")
        var gifAttr = $(this).attr("id")
        console.log("attribute of selected gif: " + gifAttr)
        var gifIndex = parseInt(gifAttr);
        console.log(gifIndex);
        $("#" + [gifIndex]).attr("src", imgURL[gifIndex]);
    });

    // on click event for the filter buttons
    $(document).on("click", ".filter", function () {
        var filterAttr = $(this).attr("rating")
        // remove class hide when any filter button is clicked
        // defined a filter class hide in CSS
        // .each() method used to loop through the image tags and check condition
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