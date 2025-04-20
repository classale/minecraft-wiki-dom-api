const burgerButton = document.querySelector(".burger")
const overlay = document.querySelector(".overlay")
const close = document.querySelector("#close")

burgerButton.onclick = close.onclick = () => {
    overlay.className = overlay.classList.contains("disabled") ? "overlay" : "overlay disabled"
}