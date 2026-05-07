const rawUrl = window.location.search; 
const parts = rawUrl.split("="); // parts[1] will be the actual show ID
const showId = parts[1]; 

async function loadEpisodes() 
{
    if (showId)
    {
        
        const showUrl = "https://api.tvmaze.com/shows/" + showId;
        try 
        { //fetch the show info
            const showResponse = await fetch(showUrl);
            const showResult = await showResponse.text(); 
            const showData = JSON.parse(showResult); 
            document.getElementById("showTitle").innerHTML = showData.name + " - Episodes"; // set the page title to the show name
        } 
        catch(error) 
        {
            console.log("Error fetching show info:", error);
        }

        
        const url = "https://api.tvmaze.com/shows/" + showId + "/episodes";
        try 
        {
            //fetch the actual episodes
            const response = await fetch(url);
            const result = await response.text();
            const data = JSON.parse(result);
            console.log("(ep.js)*RAW EPISODE DATA (Default TVmaze Order)*:", data);
            const container = document.getElementById("episodeResults"); 
            container.innerHTML = ''; // clear any previous results

            //built-in sort method to sort by rating, highest first
            data.sort( //data is the array of episds.
            function(a, b) //parameters a and b are the two episodes being compared
            {
                let ratingA = 0; // default to 0 if no rating
                if (a.rating.average !== null) 
                { 
                    ratingA = a.rating.average; //.rating.average to access the rating of the episode
                } 
                
                let ratingB = 0;
                if (b.rating.average !== null) 
                { 
                    ratingB = b.rating.average; 
                }
                
                return ratingB - ratingA; 
                console.log("(ep.js)*FULL EPISODE LIST (Sorted by Rating Highest to Lowest)*:", data);
                //return a positive number if b should come before a
                // return a negative number if a should come before b
                // 0 if they are equal
            });

            // loop through the sorted episodes and create a card for each one like in main
            data.forEach(
            function(ep) 
            {
                console.log("*CURRENT EPISODE IN LOOP*:", ep);
                let epImage = "";
                if (ep.image !== null) 
                {
                    epImage = ep.image.original; // the image url for the episode if it exists
                }

                let epSummary = "No summary available.";
                if (ep.summary !== null) 
                { 
                    epSummary = ep.summary; // the summary for the episode which is actually HTML text with tags
                }

                let epRating = "N/A";
                if (ep.rating.average !== null) 
                {
                    epRating = ep.rating.average; // the rating for the episode
                }
                //
                let newCard = "<div class='col-md-4 mb-3'>" +
                              "  <div class='card bg-black text-white border-secondary h-100'>" +
                              "    <div class='d-flex align-items-center justify-content-center bg-black' style='height: 280px;'>";
                              
                if (epImage !== "")
                {
                    newCard += "      <img src='" + epImage + "' style='max-height: 280px; max-width: 100%; object-fit: contain;' alt='Episode Image'>";
                }
                
                newCard +=    "    </div>" +
                              "    <div class='card-body d-flex flex-column'>" +
                              "      <h6 class='text-danger'>Season " + ep.season + " | Episode " + ep.number + "</h6>" +
                              "      <h5 class='card-title'>" + ep.name + "</h5>" +
                              "      <div class='card-text text-secondary'>" + epSummary + "</div>" +
                              "      <p class='card-text mt-auto'>&#x2B50 Rating: " + epRating + " / 10</p>" +
                              "    </div>" +
                              "  </div>" +
                              "</div>";
                              
                container.innerHTML += newCard;
            });
        } 
        catch (error) 
        {
            console.log("Error fetching episodes:", error);
        }
    } 
    else 
    {
        document.getElementById("episodeResults").innerHTML = "<h3>No show selected. Please go back and search.</h3>";
    }
}

//run the function when the page loads
loadEpisodes();