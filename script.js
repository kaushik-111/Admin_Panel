$(document).ready(function () {

  $(".fa-bars").click(function () {

    $('.sidebar ul li b').toggleClass('d-none');

    if ($(".sidebar").hasClass('sidebar-small')) {
      $(".sidebar").removeClass('sidebar-small').addClass('sidebar-large');
    } else {
      $(".sidebar").removeClass('sidebar-large').addClass('sidebar-small');
    }

if ($(".content_main, .Products_main_content, .inbox_main, #pricing_main_content, #team_main_content").hasClass('content-main-small')) {
$(".content_main, .Products_main_content, .inbox_main, #pricing_main_content, #team_main_content")
  .removeClass('content-main-small')
  .addClass('content-main-large');
} else {
$(".content_main, .Products_main_content, .inbox_main, #pricing_main_content, #team_main_content")
  .removeClass('content-main-large')
  .addClass('content-main-small');
}

    
    


  })

});
