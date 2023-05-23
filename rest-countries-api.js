function allCountriesJSON(fields) {
	const root = "https://restcountries.com/v3.1/all";
	const url = root + "?fields=" + fields;
	const promise = fetch(url)
	                .then((response) => response.json());
	return promise;
}

function singleCountryJSON(id, fields) {
  const root = "https://restcountries.com/v3.1/alpha/";
  const url = root + id + "?fields=" + fields;
	const promise = fetch(url)
	                .then((response) => response.json());
	return promise;
}

function createCountryDetails(event) {
              singleCountryJSON(event.currentTarget.id, "flags,name,tld,cca3,currencies,capital,region,subregion,languages,borders,population")
                .then((response) => {
                  console.log(response)
                  $("#parameters").hide();
                  $("#countries").hide();
                  $("#back-btn").show();
                  $("#country-preview").toggleClass("hide").toggleClass("showFlexBox");
                  $("#country-preview")
                    .append("<div id='country-preview-flag' class='box-shadow'><img src='" + response.flags.png + "'/></div")
                    .append("<div id='country-preview-details' />");

                    console.log(Object.values(response.name.nativeName)[0].official);
                    console.log(response.population);
                    console.log(response.region);
                    console.log(response.subregion);
                    console.log(response.capital[0]);

                    console.log(response.tld[0]);
                    console.log(Object.values(response.currencies)[0].name);
                    console.log(Object.values(response.languages).toString());
                })
                .catch((error) => console.error({ error }));
}

function createCountryPreview(value) {
  var name = value.name.common,
    id = value.cca3,
    population = value.population,
    region = value.region,
    capital = value.capital,
    flag = value.flags.png,
    details = $("<div class='country-card-details'/>")
      .append("<p class='preview-country-name'>" + name + "</p>")
      .append("<p class='preview-detail-prefix'>Population: " + population + "</p>")
      .append("<p class='preview-detail-prefix'>Region: " + region + "</p>")
      .append("<p class='preview-detail-prefix'>Capital: " + capital + "</p>"),
    country = $("<div id='" + id + "' class='country-card box-shadow light-mode'/>")
    .append("<div><img src=" + flag + "></div")
    .append(details);
    
    country.click(createCountryDetails);
    $("#countries").append(country);
}

$(document).ready(function(){
  allCountriesJSON("flags,name,cca3,capital,region,population")
    .then((response) => {response.forEach(createCountryPreview)})
    .catch((error) => console.error({ error }));

  https://restcountries.com/v3.1/alpha/ita?fields=name // for borders
  
  $("#dark-mode-btn").click(function(){
    var selector = $("body").hasClass("light-mode") ? $(".light-mode") : $(".dark-mode");
    selector.toggleClass("light-mode").toggleClass("dark-mode");
  });

  $("#continents-btn").click(function(){
    $("#continents-list").toggleClass("hide").toggleClass("showFlexBox");
  });
  
  $("#back-btn").click(function(){
    $("#country-preview").empty();
    $("#parameters").show();
    $("#countries").show();
    $("#back-btn").hide();
    $("#country-preview").toggleClass("hide").toggleClass("showFlexBox");
  });

  $("#continents-list>button").click(function(e){
    var regionFilter = e.target.innerText;

    $("#countries").children().hide()
    $( "div:contains('" + regionFilter +"')" ).parent().show()
    $("#continents-list").addClass("hide")
  })

});


