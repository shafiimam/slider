const imagesArea = document.querySelector('.images');
const gallery = document.querySelector('.gallery');
const galleryHeader = document.querySelector('.gallery-header');
const searchBtn = document.getElementById('search-btn');
const sliderBtn = document.getElementById('create-slider');
const sliderContainer = document.getElementById('sliders');
// selected image 
let sliders = [];


// If this key doesn't work
// Find the name in the url and go to their website
// to create your own api key
const KEY = '15674931-a9d714b6e9d654524df198e00&q';

// show images 
const showImages = (images) => {
    imagesArea.style.display = 'block';
    gallery.innerHTML = '';
    toggleSpinner();
    // show gallery title
    galleryHeader.style.display = 'flex';
    images.forEach(image => {
        let div = document.createElement('div');
        div.className = 'col-lg-3 col-md-4 col-xs-6 img-item mb-2';
        div.innerHTML = ` <img class="img-fluid img-thumbnail" onclick=selectItem(event,"${image.webformatURL}") src="${image.webformatURL}" alt="${image.tags}">
        <a class="high-res-image" href="${image.largeImageURL})" target="blank">view high quality image</a>`;
        gallery.appendChild(div);
    });


}

// get images
const getImages = async(query) => {
    try {
        toggleSpinner();
        const result = await fetch(`https://pixabay.com/api/?key=${KEY}=${query}&image_type=photo&pretty=true`);
        const data = await result.json();
        if (data.total == 0) {
            imagesArea.style.display = 'none';
            const errorMessageDiv = document.getElementById('not-found');
            document.getElementById('error-message').innerText = 'No image found!!Try again';
            errorMessageDiv.style.display = 'block';
            toggleSpinner();
        } else {
            imagesArea.style.display = 'block';
            showImages(data.hits);
        }
    } catch (error) {
        toggleSpinner();
        showError(error);
    }
}

let slideIndex = 0;
const selectItem = (event, img) => {
    let element = event.target;
    let item = sliders.indexOf(img);
    if (item === -1) {
        sliders.push(img);
        element.classList.toggle('added');
    } else {
        sliders.pop(img);
        element.classList.toggle('added');
    }
}
var timer
const createSlider = () => {
    // check slider image length
    if (sliders.length < 2) {
        alert('Select at least 2 image.')
        return;
    }
    // crate slider previous next area
    sliderContainer.innerHTML = '';
    const prevNext = document.createElement('div');
    prevNext.className = "prev-next d-flex w-100 justify-content-between align-items-center";
    prevNext.innerHTML = ` 
  <span class="prev" onclick="changeItem(-1)"><i class="fas fa-chevron-left"></i></span>
  <span class="next" onclick="changeItem(1)"><i class="fas fa-chevron-right"></i></span>
  `;

    sliderContainer.appendChild(prevNext)
    document.querySelector('.main').style.display = 'block';
    // hide image area
    imagesArea.style.display = 'none';
    const duration = document.getElementById('duration').value || 1000;
    sliders.forEach(slide => {
        let item = document.createElement('div')
        item.className = "slider-item";
        item.innerHTML = `<img class="w-100"
    src="${slide}"
    alt="">`;
        sliderContainer.appendChild(item)
    })

    if (duration < 0) {
        alert('duration cannot be negative');
        const search = document.getElementById('search');
        getImages(search.value)
    } else {
        changeSlide(0)
        timer = setInterval(function() {
            slideIndex++;
            changeSlide(slideIndex);
        }, duration);
    }

}

// change slider index 
const changeItem = index => {
    changeSlide(slideIndex += index);
}

// change slide item
const changeSlide = (index) => {

    const items = document.querySelectorAll('.slider-item');
    if (index < 0) {
        slideIndex = items.length - 1
        index = slideIndex;
    };

    if (index >= items.length) {
        index = 0;
        slideIndex = 0;
    }

    items.forEach(item => {
        item.style.display = "none"
    })

    items[index].style.display = "block"
}

searchBtn.addEventListener('click', function() {
    document.querySelector('.main').style.display = 'none';
    clearInterval(timer);
    const search = document.getElementById('search');
    getImages(search.value)
    sliders.length = 0;
})

sliderBtn.addEventListener('click', function() {
    createSlider()
})

// bonus contents
// spinner 
const toggleSpinner = () => {
    const spinner = document.getElementById('loading-spinner');
    imagesArea.classList.toggle('d-none');
    spinner.classList.toggle('d-none');
}

const closeCard = () => {
    document.getElementById('not-found').style.display = 'none';

}

// function for search not found error
const showError = error => {
    imagesArea.style.display = 'none';
    const errorMessageDiv = document.getElementById('not-found');
    document.getElementById('error-message').innerText = error;
    errorMessageDiv.style.display = 'block';
}