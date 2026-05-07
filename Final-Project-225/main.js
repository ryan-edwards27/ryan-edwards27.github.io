async function search() 
{
    const showInput = document.getElementById("textInput"); // get the show the user typed in
    const url = "https://api.tvmaze.com/search/shows?q=" + showInput.value; // create the url to fetch
    
    try 
    {
        const response = await fetch(url); // fetch the data from the api
        const result = await response.text(); // read the reponse 
        const data = JSON.parse(result); //create a JS object from the plain text

        console.log("*(main.js)FULL PARSED ARRAY (All Search Results - orderded by relevance score by api)*:", data);

        const container = document.getElementById("results");  // get the div where we want to put the results

        container.innerHTML = ''; // clear any previous results

        data.forEach(function(item) 
        { //item is the current element in the array, and it has a score and a show property
                console.log("*(main.js)CURRENT RAW ITEM IN LOOP (Contains 'score' and 'show')*:", item); 
                const currentShow = item.show; // .show to access info about the show itself, like name, language, type, image, etc.
                console.log("*(main.js)ISOLATED SHOW DATA (Name, Image, ID, etc.)*:", currentShow); 
                let imageUrl = ""; 
                if (currentShow.image !== null) //.image to access the image url
                { 
                    imageUrl = currentShow.image.original; //the image src 
                }

                let newCard = "<div class='col-md-4 mb-3'>" + // 3 cards per row, mb-3 for spacing between rows 
                            "  <div class='card bg-black text-white border-secondary h-100'>" + // h-100 to make all cards the same height
                            "    <div class='d-flex align-items-center justify-content-center bg-black' style='height: 280px;'>"; // make the image container a fixed height and use flexbox to center the image
                          
                if (imageUrl !== "") // only add the img tag if we have an image url
                {
                    newCard += "      <img src='" + imageUrl + "' style='max-height: 280px; max-width: 100%; object-fit: contain;' alt='Poster'>"; // make sure the image fits within the container without being cropped
                }
                //display the show name, language, type, and a button to view episodes. button at bottom of the card
                newCard +="    </div>" + 
                          "    <div class='card-body d-flex flex-column'>" +
                          "      <h5 class='card-title'>" + currentShow.name + "</h5>" + 
                          "      <p class='card-text text-secondary'>Language: " + currentShow.language + "</p>" +
                          "      <p class='card-text text-secondary'>Type: " + currentShow.type + "</p>" +
                          "      <a href='episodes.html?showId=" + currentShow.id + "' class='btn btn-danger mt-auto'>View Episodes</a>" +
                          "    </div>" +
                          "  </div>" +
                          "</div>";
                          
                container.innerHTML += newCard; // add the new card to the container
            });
        } 
        catch (error) 
        {
            
            console.log("Error:", error);
        }
}