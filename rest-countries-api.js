var ALL_COUNTRIES_JSON;

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

function createCountryDetails(pEvent, pID) {
              singleCountryJSON(pID == undefined ? pEvent.currentTarget.id : pID, "flags,name,tld,cca3,currencies,capital,region,subregion,languages,borders,population")
                .then((response) => {
                  var name = response.name.common,
                    nativeName = Object.values(response.name.nativeName)[0].official,
                    population = response.population,
                    region = response.region,
                    subregion = response.subregion,
                    capital = response.capital[0],
                    flag = response.flags.png,
                    topLevelDomain = response.tld[0],
                    currencies = Object.values(response.currencies)[0].name,
                    languages = Object.values(response.languages).toString(),
                    borderCountries = $("<h3>Border Countries:&nbsp;</h4>");

                  Object.values(response.borders).forEach(function(pCountryID){
                    var countryButton = $("<button class='light-mode box-shadow'>" + ALL_COUNTRIES_JSON.find(element => element.cca3 == pCountryID).name.common + "</button>"),
                      id = pCountryID;
                    countryButton.click(function(_pEvent){
                      $("#back-btn").trigger("click");
                      createCountryDetails(_pEvent, id)});
                    borderCountries.append(countryButton);
                  });
                   
                  $("#parameters").hide();
                  $("#countries").hide();
                  $("#back-btn").show();
                  $("#country-preview").toggleClass("hide").toggleClass("showFlexBox");
                  
                  $("#country-preview-flag").append("<img src='" + flag + "' alt='flag'/>");
                  $("#country-preview-details")
                    .append("<h2>" + name + "</h2>")
                    .append($("<div/>")
                      .append($("<div/>")
                        .append("<h3>Naitive Name:&nbsp;<p>" + nativeName + "</p>")
                        .append("<h3>Population:&nbsp;<p>" + population + "</p>")
                        .append("<h3>Region:&nbsp;<p>" + region + "</p>")
                        .append("<h3>Region:&nbsp;<p>" + subregion + "</p>")
                        .append("<h3>Capital:&nbsp;<p>" + capital + "</p>"))
                      .append($("<div/>")
                        .append("<h3>Top Level Domain:&nbsp;<p>" + topLevelDomain + "</p>")
                        .append("<h3>Currencies:&nbsp;<p>" + currencies + "</p>")
                        .append("<h3>Languages:&nbsp;<p>" + languages + "</p>")))
                    .append(borderCountries);
                })
                .catch((error) => console.error({ error }));
}

function createCountryPreview(value) {
  var name = value.name.common,
    id = value.cca3,
    population = value.population,
    region = value.region,
    capital = value.capital[0],
    flag = value.flags.png,
    details = $("<div class='country-card-details'/>")
      .append("<h2>" + name + "</h2>")
      .append("<h3>Population:&nbsp;<p>" + population + "</p>")
      .append("<h3>Region:&nbsp;<p>" + region + "</p>")
      .append("<h3>Capital:&nbsp;<p>" + capital + "</p>"),
    country = $("<div id='" + id + "' class='country-card box-shadow light-mode'/>")
    .append("<div><img src='" + flag + "' alt='flag'></div")
    .append(details);
    
    country.click(createCountryDetails);
    $("#countries").append(country);
}

$(document).ready(function(){
  allCountriesJSON("flags,name,cca3,capital,region,population")
    .then((response) => { ALL_COUNTRIES_JSON = response; response.forEach(createCountryPreview);})
    .catch((error) => console.error({ error }));
  
  $("#dark-mode-btn").click(function(){
    var selector = $("body").hasClass("light-mode") ? $(".light-mode") : $(".dark-mode");
    selector.toggleClass("light-mode").toggleClass("dark-mode");
  });

  $("#continents-btn").click(function(){
    $("#continents-list").toggleClass("hide").toggleClass("showFlexBox");
  });
  
  $("#back-btn").click(function(){
    $("#country-preview-flag").empty();
    $("#country-preview-details").empty();
    $("#parameters").show();
    $("#countries").show();
    $("#back-btn").hide();
    $("#country-preview").toggleClass("hide").toggleClass("showFlexBox");
  });

  $("#continents-list>button").click(function(e){
    var regionFilter = e.target.innerText;

    $("#countries").children().hide()
    $( "div:contains('" + regionFilter +"')" ).parent().show()
    $("#continents-list").toggleClass("hide").toggleClass("showFlexBox");
  })

});


