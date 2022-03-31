const viewport = {
  small: 450,
  tablet: 1024,
};

let isMobile = false;

const root_dir = "projects/";
const homeUrl = window.location.origin + window.location.pathname;

const items = 20;
const modal = document.getElementById("modal");
const modal_id = document.getElementById("modal_id");
const project_count = document.getElementById("project_count");

var range = document.getElementById("range");

const gallery = document.getElementById("gallery");

function setGridItems(items, save = true) {
  let menge = "";
  const amount = "1fr ";
  for (i = 0; i < items; i++) {
    menge += amount;
  }
  gallery.style.gridTemplateColumns = menge;

  const btn = document.getElementById("grid_2");
  btn.style.borderColor = "#ff0000";

  if (save) {
    localStorage.setItem("grid", items);
  }
}

function createGalleryItem(id, data) {
  const link = document.createElement("a");
  var linkText = document.createTextNode("" + data.project[id].title + id);
  link.href = "#" + id;

  gallery.appendChild(link);

  galleryItem = document.createElement("div");
  galleryItem.setAttribute("class", "gallery__item");

  galleryItemInfo = document.createElement("div");
  galleryItemInfo.setAttribute("class", "gallery__item__info");

  // const galleryItemTags = document.createElement("span");
  //  galleryItemTags.setAttribute("class", "gallery__item__tags");

  const x = document.createTextNode(data.project[id].tools);

  gallery.appendChild(galleryItem);
  link.appendChild(galleryItem);

  galleryItem.appendChild(galleryItemInfo);
  galleryItemInfo.appendChild(x);

  galleryItemInfo.innerHTML = data.project[id].title;

  //console.log(galleryItemTags);

  const currentGalleryItem = document.querySelectorAll(".gallery__item")[id];
  currentGalleryItem.style.backgroundImage = `url( ${
    root_dir + data.project[id].images[0]
  } )`;
}

function initModal(data) {
  window.addEventListener("hashchange", function () {
    openModal(data);
  });
}

function mountGallery(data) {
  let items = data.project.length - 1;
  for (id = 0; id <= items; id++) {
    createGalleryItem(id, data);
  }
  setGridItems(localStorage.getItem("grid"));
}

function openModal(data) {
  const currentId = getIdFromUrl();
  const currentProject = data.project[currentId];
  console.log("id", currentId);
  modal.style.visibility = "visible";
  modal_id.innerHTML = currentId + currentProject.title;

  const img = document.createElement("img");
  const imageSet = currentProject.images.length;

  console.log(imageSet);
  for (i = 0; i < imageSet; i++) {
    img.src = root_dir + data.project[currentId].images[i];

    modal_id.appendChild(img);
  }
}

function updateProjectCount(count) {
  let count_start = 0;
  setInterval(function () {
    if (count_start < count) {
      project_count.innerHTML = count_start += 1;
    }
  }, 100);
}

function closeModal() {
  modal.style.visibility = "hidden";
  window.history.pushState(null, null, homeUrl);
}

function getIdFromUrl() {
  return window.location.href.split("#")[1];
}

function init() {
  fetch("json/showcase.json")
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      mountGallery(data);
      initModal(data);
      updateProjectCount(Object.keys(data.project).length);
    });
}

init();

window.addEventListener("resize", windowSize);

function windowSize() {
  const currentWidth = window.innerWidth;

  if (currentWidth < viewport.small) {
    setGridItems(2, false);
    isMobile = true;
  }
  if (currentWidth > viewport.small && isMobile) {
    lastGridItem = localStorage.getItem("grid");
    setGridItems(lastGridItem);
    isMobile = false;
  }
}
