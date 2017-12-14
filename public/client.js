
var blogPostTemplate = (
  '<li class="js-blogpost-item">' +
    '<p><span class="blogpost-item js-blogpost-item-name"></span></p>' +
    '<div class="blogpost-item-controls">' +
      '<button class="js-blogpost-item-toggle">' +
        '<span class="button-label">check</span>' +
      '</button>' +
      '<button class="js-blogpost-item-delete">' +
        '<span class="button-label">delete</span>' +
      '</button>' +
    '</div>' +
  '</li>'
);

var recipeTemplate = (
  '<div class="recipe js-recipe">' +
    '<h3 class="js-recipe-name"><h3>' +
    '<hr>' +
    '<ul class="js-recipe-ingredients">' +
    '</ul>' +
    '<div class="recipe-controls">' +
      '<button class="js-recipe-delete">' +
        '<span class="button-label">delete</span>' +
      '</button>' +
    '</div>' +
  '</div>'
);


var RECIPES_URL = '/recipes';
var BLOGPOST_LIST_URL = '/blogpost-list';


function getAndDisplayRecipes() {
  console.log('Retrieving recipes')
  $.getJSON(RECIPES_URL, function(recipes) {
    console.log('Rendering recipes');
    var recipesElement = recipes.map(function(recipe) {
      var element = $(recipeTemplate);
      element.attr('id', recipe.id);
      element.find('.js-recipe-name').text(recipe.name);
      recipe.ingredients.forEach(function(ingredient) {
        element.find('.js-recipe-ingredients').append(
          '<li>' + ingredient + '</li>');
      });
      return element;
    });
    $('.js-recipes').html(recipesElement)
  });
}

function getAndDisplayBlogPost() {
  console.log('Retrieving blogpost list');
  $.getJSON(BLOGPOST_LIST_URL, function(items) {
    console.log('Rendering blogpost list');
    var itemElements = items.map(function(item) {
      var element = $(blogPostTemplate);
      element.attr('id', item.id);
      var itemName = element.find('.js-blogpost-item-name');
      itemName.text(item.name);
      element.attr('data-checked', item.checked);
      if (item.checked) {
        itemName.addClass('blogpost-item__checked');
      }
      return element
    });
    $('.js-blogpost-list').html(itemElements);
  });
}

function addRecipe(recipe) {
  console.log('Adding recipe: ' + recipe);
  $.ajax({
    method: 'POST',
    url: RECIPES_URL,
    data: JSON.stringify(recipe),
    success: function(data) {
      getAndDisplayRecipes();
    },
    dataType: 'json',
    contentType: 'application/json'
  });
}

function addblogpostItem(item) {
  console.log('Adding blogpost item: ' + item);
  $.ajax({
    method: 'POST',
    url: BLOGPOST_LIST_URL,
    data: JSON.stringify(item),
    success: function(data) {
      getAndDisplayBlogPost();
    },
    dataType: 'json',
    contentType: 'application/json'
  });
}

function deleteRecipe(recipeId) {
  console.log('Deleting recipe `' + recipeId + '`');
  $.ajax({
    url: RECIPES_URL + '/' + recipeId,
    method: 'DELETE',
    success: getAndDisplayRecipes
  });
}

function deleteblogpostItem(itemId) {
  console.log('Deleting blogpost item `' + itemId + '`');
  $.ajax({
    url: BLOGPOST_LIST_URL + '/' + itemId,
    method: 'DELETE',
    success: getAndDisplayBlogPost
  });
}

function updateRecipe(recipe) {
  console.log('Updating recipe `' + recipe.id + '`');
  $.ajax({
    url: RECIPES_URL + '/' + recipe.id,
    method: 'PUT',
    data: recipe,
    success: function(data) {
      getAndDisplayRecipes();
    }
  });
}

function updateblogpostListitem(item) {
  console.log('Updating blogpost list item `' + item.id + '`');
  $.ajax({
    url: BLOGPOST_LIST_URL + '/' + item.id,
    method: 'PUT',
    data: JSON.stringify(item),
    success: function(data) {
      getAndDisplayBlogPost()
    },
    dataType: 'json',
    contentType: 'application/json'
  });
}


function handleRecipeAdd() {
  $('#js-recipe-form').submit(function(e) {
    e.preventDefault();
    var ingredients = $(
      e.currentTarget).find(
      '#ingredients-list').val().split(',').map(
        function(ingredient) { return ingredient.trim() });
    addRecipe({
      name: $(e.currentTarget).find('#recipe-name').val(),
      ingredients: ingredients
    });
  });
}

function handleBlogPostListAdd() {

  $('#js-blogpost-list-form').submit(function(e) {
    e.preventDefault();
    addblogpostItem({
      name: $(e.currentTarget).find('#js-new-item').val(),
      checked: false
    });
  });

}

function handleRecipeDelete() {
  $('.js-recipes').on('click', '.js-recipe-delete', function(e) {
    e.preventDefault();
    deleteRecipe(
      $(e.currentTarget).closest('.js-recipe').attr('id'));
  });
}

function handleBlogPostListDelete() {
  $('.js-blogpost-list').on('click', '.js-blogpost-item-delete', function(e) {
    e.preventDefault();
    deleteblogpostItem(
      $(e.currentTarget).closest('.js-blogpost-item').attr('id'));
  });
}

function handleBlogPostCheckedToggle() {
  $('.js-blogpost-list').on('click', '.js-blogpost-item-toggle', function(e) {
    e.preventDefault();
    var element = $(e.currentTarget).closest('.js-blogpost-item');

    var item = {
      id: element.attr('id'),
      checked: !JSON.parse(element.attr('data-checked')),
      name: element.find('.js-blogpost-item-name').text()
    }
    updateBlogPostListitem(item);
  });
}

$(function() {
  getAndDisplayBlogPost();
  handleBlogPostListAdd();
  handleBlogPostListDelete();
  handleBlogPostCheckedToggle();

  getAndDisplayRecipes();
  handleRecipeAdd();
  handleRecipeDelete();
});
