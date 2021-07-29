const Modal = {
  open(){
    // Abrir Modal
    // Adicionar a classe active ao modal
    document.querySelector(".modal-overlay")
      .classList.add("active")
  },
  close(){
    // fechar o modal
    // remover a classe active do modal
    document.querySelector(".modal-overlay")
      .classList.remove("active")
  }
}

/* =============== Darkmode =============== */
const html = document.querySelector("html")
const checkbox = document.querySelector("input[name=theme]")

const getStyle = (element, style) =>
  window
    .getComputedStyle(element)
    .getPropertyValue(style)

const initialColors = {
  bg: getStyle(html, "--bg"),
  modal: getStyle(html, "--modal"),
  white: getStyle(html, "--white"),
  footer: getStyle(html, "--footer"),
  darkBlue: getStyle(html, "--dark-blue"),
  dataTable: getStyle(html, "--data-table"),
  dataTabletitles: getStyle(html, "--data-table-titles"),
}

const darkMode = {
  bg: "#191919",
  modal: "#232323",
  white: "#232323",
  footer: "#232323",
  darkBlue: "#F8F8F8",
  dataTable: "#F8F8F8",
  dataTabletitles: "#F8F8F8",
}

const transformKey = key => 
    "--" + key.replace(/([A-Z])/g, "-$1").toLowerCase()

const changeColors = (colors) => {
  Object.keys(colors).map(key => 
    html.style.setProperty(transformKey(key) , colors[key])
  )
  }  
checkbox.addEventListener("change", ({target}) => {
  target.checked ? changeColors(darkMode) : changeColors(initialColors)
})

const isExistLocalStorage = (key) => 
  localStorage.getItem(key) != null

const createOrEditLocalStorage = (key, value) => 
  localStorage.setItem(key, JSON.stringify(value))

const getValeuLocalStorage = (key) =>
  JSON.parse(localStorage.getItem(key))

checkbox.addEventListener("change", ({target}) => {
  if (target.checked) {
    changeColors(darkMode) 
    createOrEditLocalStorage('modo','darkMode')
  } else {
    changeColors(initialColors)
    createOrEditLocalStorage('modo','initialColors')
  }
})

if(!isExistLocalStorage('modo'))
  createOrEditLocalStorage('modo', 'initialColors')


if (getValeuLocalStorage('modo') === "initialColors") {
  checkbox.removeAttribute('checked')
  changeColors(initialColors);
} else {
  checkbox.setAttribute('checked', "")
  changeColors(darkMode);
}