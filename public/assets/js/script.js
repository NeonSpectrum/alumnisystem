function init() {
  setTimeout(function() {
    $('main')
      .children()
      .bootstrapMaterialDesign()
  })
}

$(document).ready(function() {
  $('.nav-link')
    .not('.dropdown-toggle')
    .click(function() {
      if ($(window).width() < 480 || $(window).height() < 480) {
        $('.collapse').collapse('hide')
      }
    })
})
