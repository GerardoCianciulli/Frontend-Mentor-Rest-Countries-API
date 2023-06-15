jQuery.expr[':'].icontains = function(a, i, m) {
  return jQuery(a).text().toUpperCase()
      .indexOf(m[3].toUpperCase()) >= 0;
};

var ALL_COUNTRIES_JSON,
  darkMode = false;

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
                  console.log(response.flags.svg)
                  var name = response.name.common,
                    nativeName = Object.values(response.name.nativeName)[0].official,
                    population = response.population,
                    region = response.region,
                    subregion = response.subregion,
                    capital = response.capital[0],
                    flag = response.flags,
                    topLevelDomain = response.tld[0],
                    currencies = Object.values(response.currencies)[0].name,
                    languages = Object.values(response.languages).toString(),
                    borderCountries = $("<div id='country-preview-borders'/>");

                  Object.values(response.borders).forEach(function(pCountryID){
                    var countryButton = $("<button class='" + (darkMode ? "dark-mode" : "light-mode") + " box-shadow'>" + ALL_COUNTRIES_JSON.find(element => element.cca3 == pCountryID).name.common + "</button>"),
                      id = pCountryID;
                    countryButton.click(function(_pEvent){
                      $("#country-preview-flag").empty();
                      $("#country-preview-details").empty();
                      createCountryDetails(_pEvent, id)});
                    borderCountries.append(countryButton);
                  });
                   
                  $("#parameters").hide();
                  $("#countries").hide();
                  $("#back-btn").show();
                  $("#country-preview").removeClass("hide").addClass("showFlexBox");
                  
                  $("#country-preview-flag").append("<img src='" + flag.svg + "' alt='" + flag.alt + "'/>");
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
                    .append($("<h3>Border Countries:</h4>"))
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
    flag = value.flags,
    details = $("<div class='country-card-details'/>")
      .append("<h2>" + name + "</h2>")
      .append("<h3>Population:&nbsp;<p>" + population + "</p>")
      .append("<h3>Region:&nbsp;<p>" + region + "</p>")
      .append("<h3>Capital:&nbsp;<p>" + capital + "</p>"),
    country = $("<div id='" + id + "' class='country-card box-shadow light-mode'/>")
    .append("<div><img src='" + flag.png + "' alt='" + flag.alt + "'></div")
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
    darkMode = !darkMode;
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
    if (regionFilter == "Show All") {
      $("#countries").children().show();
    } else {
      $("#countries").children().hide();
      $( "div:contains('" + regionFilter +"')" ).parent().show()
    }

    $("#continents-list").toggleClass("hide").toggleClass("showFlexBox");
  })

  $("#search>input").change(function(e){
    var searchValue = $("#search>input").val();
    $("#countries").children().hide();
    $( "div:icontains('" + searchValue +"')" ).parent().show()
  });
});


