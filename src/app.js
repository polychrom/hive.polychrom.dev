const viewport = {
  small: 450,
  tablet: 1024,
};

let isMobile = false;
let listOfViewedProjects = [];

const root_dir = "projects/";
const homeUrl = window.location.origin + window.location.pathname;
const logoSubText = [
  "output x process",
  "open 24/7",
  "design + engineering",
  "100% synthetic",
];

const items = 20;
const modal = document.getElementById("modal");
const project_count = document.getElementById("project_count");

var range = document.getElementById("range");

const gallery = document.getElementById("gallery");

function setGridItems(items, elemx, save = true) {
  btnActiveGrid = document.querySelectorAll(".btn-active-grid");
  console.log("button", btnActiveGrid);

  [].forEach.call(btnActiveGrid, function (el) {
    el.classList.remove("btn-active-grid");
  });

  if (elemx) {
    elemx.classList.add("btn-active-grid");
  }

  let menge = "";
  const amount = "1fr ";
  for (i = 0; i < items; i++) {
    menge += amount;
  }
  gallery.style.gridTemplateColumns = menge;

  if (save) {
    localStorage.setItem("grid", items);
  }
}

function createGalleryItem(id, data) {
  const project_dir = data.project[id].project_dir;
  const project_name = project_dir;
  const project_tools = data.project[id].tools;
  const project_year = data.project[id].year;

  const link = document.createElement("a");
  link.href = "#" + project_dir;
  link.setAttribute("data-year", project_year);
  link.setAttribute("data-name", project_name);
  link.setAttribute("data-tools", project_tools);

  gallery.appendChild(link);

  galleryItem = document.createElement("div");
  galleryItem.setAttribute("class", "gallery__item");

  galleryItemInfo = document.createElement("div");
  galleryItemInfo.setAttribute("class", "gallery__item__info");

  const galleryItemIcons = document.createElement("div");
  galleryItemIcons.setAttribute(
    "class",
    "gallery__item__icons icon icon-video"
  );

  const x = document.createTextNode(data.project[id].tools);

  gallery.appendChild(galleryItem);
  link.appendChild(galleryItem);

  galleryItem.appendChild(galleryItemInfo);
  galleryItem.appendChild(galleryItemIcons);

  galleryItemInfo.appendChild(x);

  galleryItemInfo.innerHTML = data.project[id].title;

  const currentGalleryItem = document.querySelectorAll(".gallery__item")[id];
  currentGalleryItem.style.backgroundImage = `url( ${
    root_dir + project_dir + "/" + data.project[id].images[0]
  } )`;
}

const viewed = document.getElementById("viewed");
const logoSub = document.getElementById("logo-sub");

function initModal(data) {
  window.addEventListener("hashchange", function () {
    openModal(data);
    // viewed.innerHTML = getViewedProjects();
    console.log("modal opened", getViewedProjects());

    logoSub.innerHTML = getRandomLogoSub();
  });
}

function mountGallery(data) {
  let items = data.project.length - 1;
  for (id = 0; id <= items; id++) {
    createGalleryItem(id, data);
  }
  // setGridItems(localStorage.getItem("grid"));
}

function filter(year = 0, activeElement) {
  const timeline = document.getElementById("timeline");
  console.log("timeline", timeline);
  timeline.innerHTML = year == 0 ? "All" : year;

  x = document.querySelectorAll(".btn-active");

  [].forEach.call(x, function (el) {
    el.classList.remove("btn-active");
  });

  if (activeElement) {
    activeElement.classList.add("btn-active");
  }

  console.log(activeElement);

  const items = document.getElementsByTagName("a");
  year = year.toString();
  let toRemove = 0;

  for (item of items) {
    item.classList.remove("gallery__item__hide");
  }

  for (item of items) {
    if (item.dataset.year != year && year != 0) {
      toRemove += 1;
      item.setAttribute("class", "gallery__item__hide");
    }
  }
  updateProjectCount(items.length - toRemove);
}

function openModal(data) {
  const mod = document.getElementById("modal_id");
  if (mod != null) {
    mod.remove();
  }

  const currentId = getIdFromHash(data);
  const currentProject = data.project[getIdFromHash(data)];

  console.log("id", currentId);
  const modal_id = document.createElement("div");
  modal_id.setAttribute("id", "modal_id");

  modal.appendChild(modal_id);

  const div = document.createElement("div");
  div.setAttribute("class", "modal__wrapper");
  modal_id.appendChild(div);

  /* MODAL HEAD INFOS */
  h1_project_name = document.createElement("h1");
  h1_project_name.setAttribute("class", "modal_project_name");
  h1_project_name.innerHTML = currentProject.project_dir.toUpperCase();
  div.appendChild(h1_project_name);

  /* MODAL YEAR */
  li_year = document.createElement("li");
  li_year.innerHTML = currentProject.year;
  div.appendChild(li_year);

  /* MODAL TEXT */
  const textbox = document.createElement("div");
  textbox.innerHTML = currentProject.text;
  textbox.setAttribute("class", "textbox");
  div.appendChild(textbox);

  modal.style.visibility = "visible";

  const imageSet = currentProject.images.length;

  for (i = 0; i < imageSet; i++) {
    const img = document.createElement("img");

    img.src =
      root_dir +
      currentProject.project_dir +
      "/" +
      data.project[getIdFromHash(data)].images[i];

    div.appendChild(img);
  }
  saveViewedProjects(currentProject.project_dir);
}

function updateProjectCount(count) {
  let count_start = 0;
  setInterval(function () {
    if (count_start < count) {
      //project_count.innerHTML = count_start += 1;
    }
  }, 100);
}

function closeModal() {
  modal.style.visibility = "hidden";
  window.history.pushState(null, null, homeUrl);
}

function getIdFromHash(data) {
  const allProjects = Object.keys(data.project).length;
  const hash = window.location.href.split("#")[1];

  for (id = 0; id < allProjects; id++) {
    if (data.project[id].project_dir == hash) {
      return id;
    }
  }
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

const search = document.getElementById("search");
if (search) {
  search.addEventListener("input", searchFilter);
}

function searchFilter(e) {
  const term = e.target.value;
  const items = document.getElementsByTagName("a");

  for (item of items) {
    item.classList.remove("gallery__item__hide");
  }

  for (item of items) {
    console.log("year", item.dataset.year);
    console.log("tools", item.dataset.tools);

    if (item.dataset.tools.indexOf(term) == -1) {
      item.setAttribute("class", "gallery__item__hide");
    }
  }
  console.log("items", items);
}

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

function getRandomLogoSub() {
  const randomNumber = Math.floor(Math.random() * logoSubText.length);
  return logoSubText[randomNumber];
}

function getViewedProjects() {
  return localStorage.getItem("list");
}

function saveViewedProjects(currentProject) {
  listOfViewedProjects.push(currentProject);
  localStorage.setItem("list", listOfViewedProjects.join(","));
}
