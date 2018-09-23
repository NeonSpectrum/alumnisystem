function init() {
  setTimeout(function() {
    $('main')
      .children()
      .bootstrapMaterialDesign()
  })
}

function initDataTable() {
  if ($.fn.dataTable.isDataTable('.dataTable')) return
  setTimeout(function() {
    $('.dataTable').DataTable({
      language: { search: '' }
    })
    $('.dataTables_filter')
      .find('input[type=search]')
      .addClass('form-control')
      .attr('placeholder', 'Search')
    $('.dataTables_length')
      .find('select')
      .addClass('form-control')
      .css({
        width: 'unset',
        display: 'inline'
      })
    $('.dataTable').show()
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
