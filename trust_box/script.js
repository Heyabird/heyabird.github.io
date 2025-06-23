// Application state
let filmRolls = []
let selectedItem = null
let isDeveloping = false
let showCarousel = false
let currentIndex = 0

// Generate film rolls data
function generateFilmRolls() {
  const rolls = []

  for (let rollId = 1; rollId <= 4; rollId++) {
    let position = 0

    // For each roll, create 9 groups of (note + 3 photos)
    for (let group = 0; group < 9; group++) {
      // Add note
      const note = {
        id: `roll-${rollId}-note-${group + 1}`,
        type: "note",
        src: `trust_box/logbooks/box${rollId}/1.png`,
        // text: `Handwritten note ${group + 1}`,
        photographer: `Photographer ${String.fromCharCode(65 + (group % 4))}`, // A, B, C, D cycling
        rollId,
        position: position++,
      }
      rolls.push(note)

      // Add 3 photos
      for (let photoInGroup = 0; photoInGroup < 3; photoInGroup++) {
        const photoNumber = group * 3 + photoInGroup + 1
        const photo = {
          id: `roll-${rollId}-photo-${photoNumber}`,
          type: "photo",
          src: `trust_box/photos/box${rollId}/${photoNumber}.png`,
          title: `Roll ${rollId} - Photo ${photoNumber}`,
          rollId,
          position: position++,
        }
        console.log(`photoInGroup: ${photoInGroup}`)
        console.log(`rollId: ${rollId}`)
        console.log(`photoNumber: ${photoNumber}`)
        console.log(`position: ${position}`)
        rolls.push(photo)
      }
    }
  }

  return rolls
}

// Get items for a specific roll
function getCurrentRollItems(rollId) {
  return filmRolls.filter((item) => item.rollId === rollId)
}

// Get all photos (excluding notes)
function getAllPhotos() {
  return filmRolls.filter((item) => item.type === "photo")
}

// Handle item click
function handleItemClick(itemId) {
  const item = filmRolls.find((f) => f.id === itemId)
  if (!item) return

  selectedItem = itemId

  if (item.type === "note") {
    // For notes, show note modal
    showNoteModal(item)
    return
  }

  // For photos, simulate developing
  const allPhotos = getAllPhotos()
  const photoIndex = allPhotos.findIndex((photo) => photo.id === itemId)
  currentIndex = photoIndex

  showDevelopingModal(item)

  // Simulate developing process
  setTimeout(() => {
    hideDevelopingModal()
    showPhotoModal()
  }, 3000)
}

// Show developing modal
function showDevelopingModal(item) {
  const modal = document.getElementById("developing-modal")
  const image = document.getElementById("developing-image")
  const title = document.getElementById("developing-title")

  image.src = item.src
  title.textContent = item.title
  modal.classList.remove("hidden")
  isDeveloping = true
}

// Hide developing modal
function hideDevelopingModal() {
  const modal = document.getElementById("developing-modal")
  modal.classList.add("hidden")
  isDeveloping = false
}

// Show note modal
function showNoteModal(item) {
  const modal = document.getElementById("note-modal")
  const image = document.getElementById("note-image")
  // const photographer = document.getElementById("note-photographer")
  // const text = document.getElementById("note-text")

  image.src = item.src
  // photographer.textContent = `Next photos by: ${item.photographer}`
  // text.textContent = `"${item.text}"`
  modal.classList.remove("hidden")
  showCarousel = true
}

// Hide note modal
function hideNoteModal() {
  const modal = document.getElementById("note-modal")
  modal.classList.add("hidden")
  showCarousel = false
  selectedItem = null
}

// Show photo modal
function showPhotoModal() {
  const modal = document.getElementById("photo-modal")
  const allPhotos = getAllPhotos()

  updatePhotoModal()
  generateThumbnails()
  modal.classList.remove("hidden")
  showCarousel = true
}

// Hide photo modal
function hidePhotoModal() {
  const modal = document.getElementById("photo-modal")
  modal.classList.add("hidden")
  showCarousel = false
  selectedItem = null
}

// Update photo modal content
function updatePhotoModal() {
  const allPhotos = getAllPhotos()
  const currentPhoto = allPhotos[currentIndex]

  if (!currentPhoto) return

  const image = document.getElementById("photo-main")
  const title = document.getElementById("photo-title")
  const counter = document.getElementById("photo-counter")

  image.src = currentPhoto.src
  image.alt = currentPhoto.title
  title.textContent = currentPhoto.title
  counter.textContent = `Photo ${currentIndex + 1} of ${allPhotos.length}`

  selectedItem = currentPhoto.id
}

// Generate thumbnails
function generateThumbnails() {
  const allPhotos = getAllPhotos()
  const thumbnailStrip = document.getElementById("thumbnail-strip")

  // Clear existing thumbnails
  thumbnailStrip.innerHTML = ""

  // Show 11 thumbnails centered around current index
  const start = Math.max(0, currentIndex - 5)
  const end = Math.min(allPhotos.length, start + 11)

  for (let i = start; i < end; i++) {
    const photo = allPhotos[i]
    const thumbnail = document.createElement("button")
    thumbnail.className = `relative w-12 h-8 rounded overflow-hidden border-2 transition-all flex-shrink-0 ${
      i === currentIndex ? "border-white" : "border-transparent opacity-60 hover:opacity-80"
    }`
    thumbnail.onclick = () => {
      currentIndex = i
      updatePhotoModal()
      generateThumbnails()
    }

    const img = document.createElement("img")
    img.src = photo.src
    img.alt = photo.title
    img.className = "w-full h-full object-cover"

    thumbnail.appendChild(img)
    thumbnailStrip.appendChild(thumbnail)
  }
}

// Navigation functions
function nextItem() {
  const selectedItemData = filmRolls.find((item) => item.id === selectedItem)
  if (!selectedItemData) return

  if (selectedItemData.type === "note") {
    // Navigate through all items in current roll
    const rollItems = getCurrentRollItems(selectedItemData.rollId)
    const currentIdx = rollItems.findIndex((item) => item.id === selectedItem)
    const nextIdx = (currentIdx + 1) % rollItems.length
    const nextItem = rollItems[nextIdx]

    selectedItem = nextItem.id
    if (nextItem.type === "note") {
      showNoteModal(nextItem)
    }
  } else {
    // Navigate through photos only
    const allPhotos = getAllPhotos()
    currentIndex = (currentIndex + 1) % allPhotos.length
    updatePhotoModal()
    generateThumbnails()
  }
}

function prevItem() {
  const selectedItemData = filmRolls.find((item) => item.id === selectedItem)
  if (!selectedItemData) return

  if (selectedItemData.type === "note") {
    // Navigate through all items in current roll
    const rollItems = getCurrentRollItems(selectedItemData.rollId)
    const currentIdx = rollItems.findIndex((item) => item.id === selectedItem)
    const prevIdx = (currentIdx - 1 + rollItems.length) % rollItems.length
    const prevItem = rollItems[prevIdx]

    selectedItem = prevItem.id
    if (prevItem.type === "note") {
      showNoteModal(prevItem)
    }
  } else {
    // Navigate through photos only
    const allPhotos = getAllPhotos()
    currentIndex = (currentIndex - 1 + allPhotos.length) % allPhotos.length
    updatePhotoModal()
    generateThumbnails()
  }
}

// Render film rolls
function renderFilmRolls() {
  const container = document.getElementById("film-rolls")
  container.innerHTML = ""

  for (let rollId = 1; rollId <= 4; rollId++) {
    const rollItems = getCurrentRollItems(rollId)

    const rollDiv = document.createElement("div")
    rollDiv.innerHTML = `
            <h2 class="text-2xl font-bold text-white mb-6 text-center">Film Roll ${rollId}</h2>
            <div class="bg-yellow-900 bg-opacity-100 p-6 backdrop-blur-sm border-white border-opacity-0 bg-white rounded-lg border shadow-sm">
                <!-- Film strip header -->
                <div class="flex items-center space-x-2 mb-4">
                    <div class="w-4 h-4 bg-white rounded-full"></div>
                    <div class="flex-1 h-2 bg-white rounded"></div>
                    <div class="text-xs text-white font-mono">ROLL ${rollId}</div>
                    <div class="flex-1 h-2 bg-white rounded"></div>
                    <div class="w-4 h-4 bg-white rounded-full"></div>
                </div>

                <div class="overflow-x-auto">
                    <div class="flex space-x-3 pb-4" style="width: max-content;" id="roll-${rollId}-items">
                        <!-- Items will be added here -->
                    </div>
                </div>

                <!-- Film strip footer -->
                <div class="flex items-center space-x-2 mt-4">
                    <div class="w-4 h-4 bg-white rounded-full"></div>
                    <div class="flex-1 h-2 bg-white rounded"></div>
                    <div class="text-xs text-white font-mono">27 PHOTOS + 9 NOTES</div>
                    <div class="flex-1 h-2 bg-white rounded"></div>
                    <div class="w-4 h-4 bg-white rounded-full"></div>
                </div>
            </div>
        `

    container.appendChild(rollDiv)

    // Add items to this roll
    const itemsContainer = document.getElementById(`roll-${rollId}-items`)
    rollItems.forEach((item) => {
      const itemButton = document.createElement("button")
      itemButton.className = "relative group cursor-pointer transform transition-all hover:scale-105 film-item"
      itemButton.onclick = () => handleItemClick(item.id)

      const isNote = item.type === "note"
      const itemContent = isNote
        ? `
                <div class="flex flex-col items-center justify-center h-full p-2 text-amber-800">
                    <svg class="h-6 w-6 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    <div class="text-xs text-center font-medium">
                        Note ${Math.floor(item.position / 4) + 1}
                    </div>
                    <div class="text-xs text-center opacity-70 mt-1">${item.photographer}</div>
                </div>
            `
        : `
                <img src="${item.src}" alt="${item.title}" class="w-full h-full object-cover film-negative group-hover:film-negative-hover transition-all duration-300">
            `

      itemButton.innerHTML = `
                <div class="relative overflow-hidden rounded border-2 border-white border-opacity-0 ${
                  isNote ? "w-24 h-32 md:w-32 md:h-40 bg-amber-100" : "w-32 h-24 md:w-40 md:h-32"
                }">
                    ${itemContent}
                </div>
                
                <!-- Sprocket holes -->
                <div class="absolute inset-x-0 -top-2 flex justify-between">
                    <div class="w-2 h-4 bg-white rounded-sm"></div>
                    <div class="w-2 h-4 bg-white rounded-sm"></div>
                </div>
                <div class="absolute inset-x-0 -bottom-2 flex justify-between">
                    <div class="w-2 h-4 bg-white rounded-sm"></div>
                    <div class="w-2 h-4 bg-white rounded-sm"></div>
                </div>
            `

      itemsContainer.appendChild(itemButton)
    })
  }
}

// Event listeners
document.addEventListener("DOMContentLoaded", () => {
  // Generate data and render
  filmRolls = generateFilmRolls()
  renderFilmRolls()

  // Modal event listeners
  document.getElementById("note-close").onclick = hideNoteModal
  document.getElementById("note-prev").onclick = prevItem
  document.getElementById("note-next").onclick = nextItem

  document.getElementById("photo-close").onclick = hidePhotoModal
  document.getElementById("photo-prev").onclick = prevItem
  document.getElementById("photo-next").onclick = nextItem

  // Keyboard navigation
  document.addEventListener("keydown", (e) => {
    if (!showCarousel) return

    switch (e.key) {
      case "Escape":
        if (document.getElementById("note-modal").classList.contains("hidden") === false) {
          hideNoteModal()
        } else if (document.getElementById("photo-modal").classList.contains("hidden") === false) {
          hidePhotoModal()
        }
        break
      case "ArrowLeft":
        prevItem()
        break
      case "ArrowRight":
        nextItem()
        break
    }
  })
})
