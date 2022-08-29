import './css/styles.css';
import PhotosAPIServise from './fetchPhotos';
import { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  form: document.querySelector('.search-form'),
  div: document.querySelector('.gallery'),
  moreBtn: document.querySelector('.load-more'),
};

let a;
const photosAPIServise = new PhotosAPIServise();

const submitHandler = e => {
  e.preventDefault();
  firstLoadPhotos(e);
  setTimeout(smoothScroll, 500);
};
let gallery;

const createGalleryMarkup = data => {
  a = data.length;
  return data
    .map(
      item =>
        `
    <div class="photo-card">
    <a class="link" href="${item.largeImageURL}">
      <img src="${item.webformatURL}" alt="${item.tags}" loading="lazy" /></a>
    <div class="info">
    <p class="info-item">
      <b>Likes </b>${item.likes}
    </p>
    <p class="info-item">
      <b>Views </b>${item.views}
    </p>
    <p class="info-item">
      <b>Comments </b>${item.comments}
    </p>
    <p class="info-item">
      <b>Downloads </b>${item.downloads}
    </p>
  </div>
</div>
`
    )
    .join('');
};

const renderGallery = markup => {
  refs.div.insertAdjacentHTML('beforeend', markup);

  gallery = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionDelay: 250,
  });
  lastPhotoObserver.observe(document.querySelector('.photo-card:last-child'));
  if (a < 40) {
    lastPhotoObserver.unobserve(
      document.querySelector('.photo-card:last-child')
    );
  }
};
refs.form.addEventListener('submit', submitHandler);

function loadMorePhotos() {
  photosAPIServise.incrementPage();
  photosAPIServise.fetchPhotos().then(data => {
    const markup = createGalleryMarkup(data.hits);
    renderGallery(markup);
  });
  gallery.refresh();
  setTimeout(function () {
    const { height: cardHeight } =
      refs.div.firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  }, 500);
}

const options = {
  root: null,
  rootMargin: '0px',
  threshold: 0.5,
};

const lastPhotoObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const lastPhoto = entry.target;
      loadMorePhotos();
      lastPhotoObserver.unobserve(lastPhoto);
    }
  });
}, options);

const arr = document.querySelectorAll('img');
arr.forEach(i => {
  observer.observe(i);
});

function firstLoadPhotos(e) {
  refs.div.innerHTML = '';
  photosAPIServise.searchQuery = e.target.elements.searchQuery.value.trim();

  if (photosAPIServise.searchQuery.length === 0) {
    Notify.failure('Please, enter some text');
  } else {
    photosAPIServise.resetPage();
    photosAPIServise.fetchPhotos().then(data => {
      if (data.hits.length === 0) {
        Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      } else {
        Notify.success(`Hooray! We found ${data.totalHits} images.`);
        const markup = createGalleryMarkup(data.hits);
        renderGallery(markup);
      }
    });
  }
}

function smoothScroll() {
  const { height: cardHeight } =
    refs.div.firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
