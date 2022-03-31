function createLayout(elem, am, index) {
  let root = document.getElementById("root");

  const divContainer = document.createElement("div");
  divContainer.className = "project";
  divContainer.id = "chapter-" + elem.title;

  root.appendChild(divContainer);

  //console.log("bg", elem.background);

  var p = document.getElementsByClassName("project")[index];
  p.style.backgroundColor = elem.background;

  const divImgContainer = document.createElement("div");
  divImgContainer.className = "gallery";
  divContainer.appendChild(divImgContainer);

  var imagenums = elem.images.length;
  console.log("imgs", elem.images);

  var filetype = String(elem.images);

  if (filetype.includes(".mp4")) {
    console.log("vide gefunden");
    var video = myVideo(elem.title, elem.images);
    divImgContainer.appendChild(video);
  }

  if (filetype.includes(".gif") || filetype.includes(".jpg") || filetype.includes(".png")) {
    for (var i = 0; i < imagenums; i++) {
      var img = myImage(elem.title, elem.images[i], imagenums);
      divImgContainer.appendChild(img);
    }
  }

  //var imagenums = elem.images.length;

  const divTextContainer = document.createElement("div");
  divTextContainer.className = "text";
  divContainer.appendChild(divTextContainer);

  // CREATE TITLE
  var l = document.createElement("h1");
  var t = document.createTextNode(elem.title.toUpperCase() + " (" + elem.year + ")");
  l.appendChild(t);
  divTextContainer.appendChild(l);

  /*
  $("h1").click(function () {
    $(this).closest(".project").toggleClass("table");
  });
*/

  // CREATE YEAR
  /*
  var l = document.createElement("div");
  var t = document.createTextNode(elem.year);
  l.appendChild(t);
  divTextContainer.appendChild(l);
  l.classList.add("year");
  */

  // CREATE TEXT
  var article = document.createElement("article");
  var t = document.createTextNode(elem.text);
  article.appendChild(t);
  //divTextContainer.appendChild(article);

  // CREATE TOOL CLOUD
  var ul = document.createElement("ul");
  divTextContainer.appendChild(ul);

  var res;

  if (typeof elem.background !== "undefined") {
    mycolor = brighten(elem.background, 0.6); // "e.g. #ff0000"
  }
  if (elem.background == "#000000") {
    mycolor = "#999999";
  }

  for (var i = 0; i < elem.tools.length; i++) {
    var l = document.createElement("li");
    l.style.borderColor = mycolor;
    l.style.backgroundColor = mycolor;

    l.style.color = "#ffffff";

    var t = document.createTextNode(elem.tools[i]);
    l.appendChild(t);

    //ul.appendChild(l);
  }
}

function myImage(dir, filename, imagenums) {
  var randomWidth = randomInteger(300, 500) + "px";
  var image = document.createElement("IMG");

  image.setAttribute("src", "img/" + dir + "/" + filename);
  image.setAttribute("loading", "lazy");

  var minSize = (100 / imagenums) * 1;
  var maxSize = (100 / imagenums) * 1;

  image.style.maxWidth = randomInteger(minSize, maxSize) + "%";

  return image;
}

function myVideo(dir, filename) {
  var video = document.createElement("video");

  video.setAttribute("src", "img/" + dir + "/" + filename);
  video.muted = true;
  video.autoplay = true;
  video.loop = true;
  video.playsInline = true;
  video.controls = true;
  video.load();

  // video.setAttribute("class", "cloud");

  return video;
}

function select(value) {
  fetch("json/showcase.json")
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      filterProjects(data, value);
    });
}

function filterProjects(data, value) {
  var num = 0;
  if (value == "table") {
    $(".gallery").toggleClass("gallerytoggle");
    var project = document.getElementsByClassName("project");

    var count = 0;
    $(".project").each(function () {
      $(this).toggleClass("table");
      $(this).toggleClass("list img");
    });
  } else {
    function list(tools, index) {
      if (!data.project[index].tools.includes(value)) {
        var project = document.getElementsByClassName("project");
      }
    }
    data.project.forEach(list);
  }
}

function fetchData() {
  fetch("json/showcase.json")
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      let amount = data.project.length;

      data.project.forEach((element, index) => createLayout(element, amount, index));
    })
    .catch(function (e) {
      console.log("error: " + e);
    });
}

window.onload = function () {
  fetchData();
};

function randomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/*
var chapter = 0;
var flag = true;
var randomColor;


window.addEventListener("scroll", function (e) {
  var fromtop = document.querySelectorAll(".project")[chapter].getBoundingClientRect().top;

  if (flag) {
    randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
    var p = document.getElementsByClassName("project")[chapter];
    p.style.backgroundColor = randomColor;
    // p.style.transition = "5s all ease";

    var q = document.getElementsByClassName("project")[chapter + 1];
    q.style.backgroundColor = randomColor;
    q.style.transition = "4s all ease";

    flag = false;
  }

  if (fromtop <= 0) {
    console.log("fromtop", fromtop, randomColor);
    chapter += 1;
    console.log("ich bin da", fromtop, chapter);
    flag = true;
  }
});
*/

function brighten(color, c) {
  const calc = (sub1, sub2) =>
    Math.min(255, Math.floor(parseInt(color.substr(sub1, sub2), 16) * c))
      .toString(16)
      .padStart(2, "0");
  return `#${calc(1, 2)}${calc(3, 2)}${calc(5, 2)}`;
}

var chap = document.getElementsByClassName("project");
var scrollcount = 0;
var info = document.getElementById("info");
var ch;

function scrollNext() {
  if (scrollcount == chap.length - 1) {
    scrollcount = 0;
  } else {
    scrollcount += 1;
  }

  ch = chap[scrollcount].id;
  var next = document.getElementById("next");
  next.setAttribute("href", "#" + ch);

  // console.log("chap", ch, scrollcount);
  //  info.innerHTML = "#" + ch;

  return false;
}

function scrollPrev() {
  if (scrollcount == 0) {
    scrollcount = chap.length - 1;
  } else {
    scrollcount -= 1;
  }
  ch = chap[scrollcount].id;
  var next = document.getElementById("prev");
  next.setAttribute("href", "#" + ch);

  // console.log("chap", ch, scrollcount);
  // info.innerHTML = "#" + ch;

  return false;
}

var currentScroll;
var lastScroll;
var info = document.getElementById("info");
var scrollpercent;

window.addEventListener("scroll", function (e) {
  var pagefulllheight = document.body.scrollHeight;
  var scrollposition = window.pageYOffset;
  var windowviewheight = window.innerHeight;

  scrollpercent = (scrollposition / (pagefulllheight - windowviewheight)) * 100;

  info.innerHTML = Math.floor(scrollpercent) + "%";

  currentScroll = scrollposition;

  if (lastScroll < currentScroll) {
    document.getElementById("down").style.color = "#EE82EE";
    document.getElementById("up").style.color = "#0000ff";
  }
  if (lastScroll > currentScroll) {
    document.getElementById("up").style.color = "#EE82EE";
    document.getElementById("down").style.color = "#0000ff";
  }

  lastScroll = currentScroll;
});
