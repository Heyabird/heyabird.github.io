// Camera rolls data with thumbnail images
// const thumbnails1 = [];
// for (let i = 0; i < 9; i++) {
//     // Add 1 notebook scan first
//     thumbnails.push({`photos/box1/${i+1}.png`,
//     });


const cameraRolls = [
  { 
      id: 1, 
      title: "Trust Box 1", 
      location: "Espoo → Tampere", 
      filmType: "GT Photo 27FL Flash", 
      photoCount: "24",
      peopleCount: 8,
      date: "May 2025",
      thumbnails: [
          "trust_box/photos/box1/1-1.png",
          "trust_box/photos/box1/1-2.png",
          "trust_box/photos/box1/1-3.png",
          "trust_box/photos/box1/2-1.png",
          "trust_box/photos/box1/2-2.png",
          "trust_box/photos/box1/2-3.png",
          "trust_box/photos/box1/3-1.png",
          "trust_box/photos/box1/3-2.png",
          "trust_box/photos/box1/3-3.png",
          "trust_box/photos/box1/4-1.png",
          "trust_box/photos/box1/4-2.png",
          "trust_box/photos/box1/4-3.png",
          "trust_box/photos/box1/5-1.png"
      ]
  },
  { 
      id: 2, 
      title: "Trust Box 2", 
      location: "Espoo → Helsinki", 
      filmType: "GT Photo 27FL Flash", 
      photoCount: "23", 
      peopleCount: 8,
      date: "May - June 2025",
      thumbnails: [
          "trust_box/photos/box2/1-1.png",
          "trust_box/photos/box2/1-2.png",
          "trust_box/photos/box2/1-3.png",
          "trust_box/photos/box2/2-1.png",
          "trust_box/photos/box2/2-2.png",
          "trust_box/photos/box2/2-3.png",
          "trust_box/photos/box2/3-1.png",
          "trust_box/photos/box2/3-2.png",
          "trust_box/photos/box2/3-3.png",
          "trust_box/photos/box2/4-1.png",
          "trust_box/photos/box2/4-2.png",
          "trust_box/photos/box2/4-3.png",
          "trust_box/photos/box2/5-1.png"
      ]
  },
  { 
      id: 3, 
      title: "Trust Box 3", 
      location: "Helsinki → Vihti", 
      filmType: "GT Photo 27FL Flash", 
      photoCount: "24", 
      peopleCount: 9,
      date: "May 2025",
      thumbnails: [
          "trust_box/photos/box3/1-1.png",
          "trust_box/photos/box3/1-2.png",
          "trust_box/photos/box3/1-3.png",
          "trust_box/photos/box3/2-1.png",
          "trust_box/photos/box3/2-2.png",
          "trust_box/photos/box3/2-3.png",
          "trust_box/photos/box3/3-1.png",
          "trust_box/photos/box3/3-2.png",
          "trust_box/photos/box3/3-3.png",
          "trust_box/photos/box3/4-1.png",
          "trust_box/photos/box3/4-2.png",
          "trust_box/photos/box3/4-3.png",
          "trust_box/photos/box3/5-1.png"
      ]
  },
  { 
      id: 4, 
      title: "Trust Box 4", 
      location: "Helsinki → Gothenburg, Sweden?", 
      filmType: "GT Photo 27FL Flash", 
      photoCount: "23",
      peopleCount: 9,
      date: "May - July 2025",
      thumbnails: [] // Empty for disabled roll
  },
  { 
      id: 5, 
      title: "Trust Box 5", 
      location: "Helsinki → Espoo", 
      filmType: "Fujifilm Quicksnap", 
      photoCount: "27", 
      peopleCount: 9,
      date: "May 2025",
      thumbnails: [
          "trust_box/photos/box5/1-1.png",
          "trust_box/photos/box5/1-2.png",
          "trust_box/photos/box5/1-3.png",
          "trust_box/photos/box5/2-1.png",
          "trust_box/photos/box5/2-2.png",
          "trust_box/photos/box5/2-3.png",
          "trust_box/photos/box5/3-1.png",
          "trust_box/photos/box5/3-2.png",
          "trust_box/photos/box5/3-3.png",
          "trust_box/photos/box5/4-1.png",
          "trust_box/photos/box5/4-2.png",
          "trust_box/photos/box5/4-3.png",
          "trust_box/photos/box5/5-1.png"
      ]
  },
];

// Global state
let selectedRoll = null;
let currentIndex = 0;
let currentItems = [];

// Generate carousel items (1 notebook scan + 3 photos pattern)
function generateCarouselItems(rollId) {
  const items = [];
  const currentRoll = cameraRolls[rollId - 1]
  console.log("currentRoll: ", currentRoll)
  for (let i = 0; i < currentRoll.peopleCount; i++) {
      // Add 1 notebook scan first
      items.push({
          type: "notebook",
          id: `roll-${rollId}-notebook-${i + 1}`,
          src: `trust_box/logbooks/box${rollId}/${i+1}.png`,
          alt: `Notebook scan ${i + 1} from roll ${rollId}`,
          logIndex: i + 1,
          description: `hello`,
      });
      
      // Then add 3 photos
      for (let j = 1; j <= 3; j++) {
          items.push({
              type: "photo",
              id: `roll-${rollId}-photo-${i * 3 + j}`,
              src: `trust_box/photos/box${rollId}/${i+1}-${j}.png`,
              alt: `Photo ${i * 3 + j} from roll ${rollId}`,
              photoIndex: i * 3 + j
          });
      }
  }
  return items;
}

// Create film strip HTML
function createFilmStripHTML(roll) {
  const isDisabled = roll.id === 4;
  const disabledClass = isDisabled ? ' disabled' : '';
  
  // Create film frames with images or default orange squares
  const filmFramesHTML = Array(13).fill().map((_, index) => {
      if (roll.thumbnails && roll.thumbnails[index]) {
          return `<div class="film-frame has-image">
              <img src="${roll.thumbnails[index]}" alt="Thumbnail ${index + 1}" class="film-frame-image">
          </div>`;
      } else {
          return '<div class="film-frame"></div>';
      }
  }).join('');
  
  return `
      <div class="film-strip${disabledClass}" data-roll-id="${roll.id}" ${isDisabled ? 'data-disabled="true"' : ''}>
          <div class="film-canister">
              <div class="canister-content">
                  <div>
                      <h3 class="canister-title">${roll.title}</h3>
                      <p class="canister-location">${roll.location} | ${roll.peopleCount} people in the chain</p>
                  </div>
                  <div>
                      <p class="canister-film-type">${roll.filmType}</p>
                      <p class="canister-date">${roll.date}</p>
                  </div>
              </div>
          </div>
          
          <div class="film-strip-visual">
              ${isDisabled ? '<div class="coming-soon-badge">COMING SOON</div>' : ''}
              <div class="film-content">
                  <div class="film-perforations">
                      ${Array(6).fill().map(() => '<div class="perforation"></div>').join('')}
                  </div>
                  
                  <div class="film-frames">
                      ${filmFramesHTML}
                  </div>
                  
                  <div class="film-perforations">
                      ${Array(6).fill().map(() => '<div class="perforation"></div>').join('')}
                  </div>
              </div>
              
              <div class="film-label">
                  <div class="film-label-box">
                      <p class="film-label-text">ROLL ${roll.id} • ${roll.photoCount} EXPOSURES • ${roll.filmType}</p>
                  </div>
              </div>
          </div>
      </div>
  `;
}

// Create carousel content HTML
function createCarouselContentHTML(item, rollId) {
  if (item.type === "photo") {
      const roll = cameraRolls.find(r => r.id === rollId);
      return `
          <div class="photo-content">
              <div class="photo-container">
                  <img src="${item.src}" alt="${item.alt}" class="photo-image">
              </div>
              <div class="photo-caption">
                  <p class="photo-film-type">${roll.filmType}</p>
              </div>
          </div>
      `;
  } else {
      return `
          <div class="notebook-content">
              <div class="notebook-image-container">
                  <img src="${item.src}" alt="${item.alt}" class="notebook-image">
              </div>
              <div>
                  <p>Photographer for the next 3 photos</p>
              </div>
          </div>
      `;
  }
}

// Show loading animation
function showLoading() {
  document.getElementById('loading-screen').classList.remove('hidden');
  document.getElementById('main-content').classList.add('hidden');
  document.getElementById('carousel-modal').classList.add('hidden');
}

// Hide loading animation
function hideLoading() {
  document.getElementById('loading-screen').classList.add('hidden');
}

// Show main content
function showMainContent() {
  document.getElementById('main-content').classList.remove('hidden');
  document.getElementById('carousel-modal').classList.add('hidden');
}

// Show carousel
function showCarousel() {
  document.getElementById('main-content').classList.add('hidden');
  document.getElementById('carousel-modal').classList.remove('hidden');
}

// Handle film strip click
function handleFilmStripClick(rollId) {
  showLoading();
  
  // Add "developed" class to show normal images
  const filmStrip = document.querySelector(`[data-roll-id="${rollId}"]`);
  filmStrip.classList.add('developed');
  
  setTimeout(() => {
      selectedRoll = rollId;
      currentIndex = 0;
      currentItems = generateCarouselItems(rollId);
      
      updateCarouselContent();
      hideLoading();
      showCarousel();
  }, 1000);
}

// Update carousel content
function updateCarouselContent() {
  const roll = cameraRolls.find(r => r.id === selectedRoll);
  const currentItem = currentItems[currentIndex];
  const photos = currentItems.filter(i => i.type == 'photo')
  const logs = currentItems.filter(i => i.type == 'notebook')
  console.log("heya. roll: ", roll, "currentItems: ", currentItems, "photos: ", photos, "currentItem: ", currentItem, "logs: ", logs)

  // Update header
  document.getElementById('carousel-title').textContent = roll.title;
  document.getElementById('carousel-location').textContent = roll.location;
  // document.getElementById('carousel-film-date').textContent = `${roll.filmType} • ${roll.date}`;
  if (currentItem.type == 'photo') {
      document.getElementById('carousel-frame-counter').textContent = `Photo ${currentItem.photoIndex} of ${roll.photoCount}`;
  } else {
      document.getElementById('carousel-frame-counter').textContent = `Logbook Scan ${currentItem.logIndex}`;
  }
  
  // Update frame content
  document.getElementById('carousel-frame').innerHTML = createCarouselContentHTML(currentItem, selectedRoll);
}

// Handle previous button
function handlePrevious() {
  currentIndex = currentIndex === 0 ? currentItems.length - 1 : currentIndex - 1;
  updateCarouselContent();
}

// Handle next button
function handleNext() {
  currentIndex = currentIndex === currentItems.length - 1 ? 0 : currentIndex + 1;
  updateCarouselContent();
}

// Handle close carousel
function handleCloseCarousel() {
  selectedRoll = null;
  currentIndex = 0;
  currentItems = [];
  showMainContent();
}

// Initialize the application
function init() {
  // Generate film strips
  const container = document.getElementById('film-strips-container');
  container.innerHTML = cameraRolls.map(roll => createFilmStripHTML(roll)).join('');
  
  // Add event listeners for film strips
  document.querySelectorAll('.film-strip').forEach(strip => {
      strip.addEventListener('click', (e) => {
          // Check if the strip is disabled
          if (e.currentTarget.dataset.disabled === 'true') {
              return; // Do nothing if disabled
          }
          
          const rollId = parseInt(e.currentTarget.dataset.rollId);
          handleFilmStripClick(rollId);
      });
  });
  
  // Add event listeners for carousel controls
  document.getElementById('close-carousel').addEventListener('click', handleCloseCarousel);
  document.getElementById('prev-button').addEventListener('click', handlePrevious);
  document.getElementById('next-button').addEventListener('click', handleNext);
  
  // Add keyboard navigation
  document.addEventListener('keydown', (e) => {
      if (selectedRoll) {
          if (e.key === 'ArrowLeft') {
              handlePrevious();
          } else if (e.key === 'ArrowRight') {
              handleNext();
          } else if (e.key === 'Escape') {
              handleCloseCarousel();
          }
      }
  });
}

// Start the application when DOM is loaded
document.addEventListener('DOMContentLoaded', init);