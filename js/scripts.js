var pokemonRepository = (function() {
  var repository = [];
  var apiUrl = "https://pokeapi.co/api/v2/pokemon/?limit=900";
  function add(pokemon) {
    if (
      typeof pokemon === "object" &&
      "name" in pokemon &&
      "detailsUrl" in pokemon
    ) {
      repository.push(pokemon);
    } else {
      console.log("add an object");
    }
  }
  function getAll() {
    return repository;
  }
  function addListItem(pokemon) {
    var $pokemonList = $(".pokemon-list");
    var $listItem = $("<li>");
    var $button = $('<button class="my-class">' + pokemon.name + "</button>");
    $listItem.append($button);
    $pokemonList.append($listItem);
    $button.on("click", function(event) {
      showDetails(pokemon);
    });
  }
  function showDetails(item) {
    pokemonRepository.loadDetails(item).then(function() {
      console.log(item);
      showModal(item);
    });
  }
  function loadList() {
    return $.ajax(apiUrl)
      .then(function(json) {
        json.results.forEach(function(item) {
          var pokemon = {
            name: item.name,
            detailsUrl: item.url
          };
          add(pokemon);
          console.log(pokemon);
        });
      })
      .catch(function(e) {
        console.error(e);
      });
  }

  function loadDetails(item) {
    var url = item.detailsUrl;
    return $.ajax(url)
      .then(function(details) {
        item.imageUrl = details.sprites.front_default;
        item.height = details.height;
        item.types = [];
        for (var i = 0; i < details.types.length; i++) {
          item.types.push(details.types[i].type.name);
        }
        if (item.types.includes("grass")) {
          $("#modal-container").css("background-color", "lightgreen");
        } else if (item.types.includes("fire")) {
          $("#modal-container").css("background-color", "red");
        } else if (item.types.includes("psychic")) {
          $("#modal-container").css("background-color", "#FF69B4");
        } else if (item.types.includes("poison")) {
          $("#modal-container").css("background-color", "purple");
        } else if (item.types.includes("water")) {
          $("#modal-container").css("background-color", "blue");
        } else if (item.types.includes("bug")) {
          $("#modal-container").css("background-color", "#3f000f");
        } else if (item.types.includes("rock")) {
          $("#modal-container").css("background-color", "#BC8F8F");
        } else if (item.types.includes("flying")) {
          $("#modal-container").css("background-color", "#2F4F4F");
        } else if (item.types.includes("electric")) {
          $("#modal-container").css("background-color", "gold");
        } else if (item.types.includes("ice")) {
          $("#modal-container").css("background-color", "#4169E1");
        } else if (item.types.includes("ghost")) {
          $("#modal-container").css("background-color", "#8B008B");
        } else if (item.types.includes("ground")) {
          $("#modal-container").css("background-color", "#D2B48C");
        } else if (item.types.includes("fairy")) {
          $("#modal-container").css("background-color", "#EE82EE");
        } else if (item.types.includes("steel")) {
          $("#modal-container").css("background-color", "#708090");
        }
        //loop to get the abilities of a selected pokemon
        item.abilities = [];
        for (var i = 0; i < details.abilities.length; i++) {
          item.abilities.push(details.abilities[i].ability.name);
        }

        item.weight = details.weight;
      })
      .catch(function(e) {
        console.error(e);
      });
  }
  function showModal(item) {
    var $modalContainer = $("#modal-container");
    $modalContainer.empty();
    var modal = $('<div class="modal"></div>');
    var closeButtonElement = $('<button class="modal-close">Close</button>');
    closeButtonElement.on("click", hideModal);
    var nameElement = $("<h1>" + item.name + "</h1>");
    var imageElement = $('<img class="modal-img">');
    imageElement.attr("src", item.imageUrl);
    var heightElement = $("<p>" + "height : " + item.height + "</p>");
    var weightElement = $("<p>" + "weight : " + item.weight + "</p>");
    var typesElement = $("<p>" + "types : " + item.types + "</p>");
    var abilitiesElement = $("<p>" + "abilities : " + item.abilities + "</p>");
    modal.append(closeButtonElement);
    modal.append(nameElement);
    modal.append(imageElement);
    modal.append(heightElement);
    modal.append(weightElement);
    modal.append(typesElement);
    modal.append(abilitiesElement);
    $modalContainer.append(modal);
    $modalContainer.addClass("is-visible");
  }
  function hideModal() {
    var $modalContainer = $("#modal-container");
    $modalContainer.removeClass("is-visible");
  }
  jQuery(window).on("keydown", e => {
    var $modalContainer = $("#modal-container");
    if (e.key === "Escape" && $modalContainer.hasClass("is-visible")) {
      hideModal();
    }
  });
  var $modalContainer = document.querySelector("#modal-container");
  $modalContainer.addEventListener("click", e => {
    var target = e.target;
    if (target === $modalContainer) {
      hideModal();
    }
  });
  return {
    add: add,
    getAll: getAll,
    addListItem: addListItem,
    loadList: loadList,
    loadDetails: loadDetails,
    showModal: showModal,
    hideModal: hideModal
  };
})();
pokemonRepository.loadList().then(function() {
  pokemonRepository.getAll().forEach(function(pokemon) {
    pokemonRepository.addListItem(pokemon);
  });
});
