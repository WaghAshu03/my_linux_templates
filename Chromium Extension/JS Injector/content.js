const comments_div = document.getElementById("comments_div");
const { origin } = window.location;

if (
  comments_div &&
  comments_div.classList.contains("row") &&
  comments_div.classList.contains("gallery_second") &&
  comments_div.classList.length === 2 &&
  !document.getElementById("load_more")
) {
  console.log("hello", comments_div, $, window.location.origin);
  const load_more_button = document.createElement("button");
  load_more_button.id = "load_more";
  load_more_button.classList.add("btn");
  load_more_button.classList.add("btn-primary");
  load_more_button.classList.add("view_link");
  load_more_button.innerHTML = `<i class="fa fa-angle-down"></i> View More`;
  load_more_button.style.marginRight = "10px";

  const load_all_button = document.createElement("button");
  load_all_button.id = "load_all";
  load_all_button.classList.add("btn");
  load_all_button.classList.add("btn-primary");
  load_all_button.classList.add("view_link");
  load_all_button.innerHTML = `<i class="fa fa-angle-double-down"></i> View All`;

  const theDiv = document.createElement("div");
  theDiv.style.textAlign = "center";
  theDiv.appendChild(load_more_button);
  theDiv.appendChild(load_all_button);
  theDiv.style.marginTop = "10px";

  comments_div.appendChild(theDiv);

  // ---------------------------------------------

  $("#load_more").click(function (e) {
    $.ajax({
      url: "/inc/thumbs_loader.php",
      type: "POST",
      data: {
        server: $("#load_server").val(),
        u_id: $("#gallery_id").val(),
        g_id: $("#load_id").val(),
        img_dir: $("#load_dir").val(),
        visible_pages: $(".gallery_th:visible").length,
        total_pages: $("#load_pages").val(),
        type: 1,
      },
      success: function (response) {
        $("#append_thumbs").append(response);

        if ($(".gallery_th:visible").length == $("#load_pages").val()) {
          $(".view_link").hide();
        }

        (function () {
          function logElementEvent(eventName, element) {
            console.log(
              Date.now(),
              eventName,
              element.getAttribute("data-src")
            );
          }
          var callback_error = function (element) {
            element.src = `${origin}/images/load_error.png`;
          };
          var ll = new LazyLoad({
            threshold: 0,
            callback_error: callback_error,
          });
        })();
      },
    });
  });

  $("#load_all").click(function (e) {
    $.ajax({
      url: "/inc/thumbs_loader.php",
      type: "POST",
      data: {
        server: $("#load_server").val(),
        u_id: $("#gallery_id").val(),
        g_id: $("#load_id").val(),
        img_dir: $("#load_dir").val(),
        visible_pages: $(".gallery_th:visible").length,
        total_pages: $("#load_pages").val(),
        type: 2,
      },
      success: function (response) {
        $("#append_thumbs").append(response);

        if ($(".gallery_th:visible").length == $("#load_pages").val()) {
          $(".view_link").hide();
        }

        (function () {
          function logElementEvent(eventName, element) {
            console.log(
              Date.now(),
              eventName,
              element.getAttribute("data-src")
            );
          }
          var callback_error = function (element) {
            element.src = `${origin}/images/load_error.png`;
          };
          var ll = new LazyLoad({
            threshold: 0,
            callback_error: callback_error,
          });
        })();
      },
    });
  });
}

if (
  !!document.querySelector(".next_img img#gimg") &&
  !!document.querySelector(".filtered_reader")
) {
  const pre_img = $(".pre_img")[0];

  pre_img.style.cursor = "pointer";
  pre_img.onclick = () => {
    $(".nav_next")[0].click();
  };
}
