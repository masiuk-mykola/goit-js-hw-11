import './css/styles.css';
import { Notify } from 'notiflix';
import PhotosAPIServise from './fetchPhotos';
// import simpleLightbox from 'simplelightbox';

const refs = {
  form: document.querySelector('.search-form'),
  div: document.querySelector('.gallery'),
  moreBtn: document.querySelector('.load-more'),
};

const photosAPIServise = new PhotosAPIServise();

const submitHandler = e => {
  e.preventDefault();
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
        const markup = createGalleryMarkup(data.hits);
        renderGallery(markup);
      }
    });
  }
};

const moreBtnClickHandler = e => {
  e.preventDefault();
  photosAPIServise.incrementPage();
  photosAPIServise.fetchPhotos().then(data => {
    const markup = createGalleryMarkup(data.hits);
    renderGallery(markup);
  });
};

const createGalleryMarkup = data => {
  return data
    .map(
      item =>
        `<div class="photo-card">
    <a href="${item.largeImageURL}">
    <img src="${item.webformatURL}" alt="${item.tags}" loading="lazy" /></a>
    <div class="info">
    <p class="info-item">${item.likes}
      <b>Likes</b>
    </p>
    <p class="info-item">${item.views}
      <b>Views</b>
    </p>
    <p class="info-item">${item.comments}
      <b>Comments</b>
    </p>
    <p class="info-item">${item.downloads}
      <b>Downloads</b>
    </p>
  </div>
</div>`
    )
    .join('');
};

const renderGallery = markup => {
  refs.div.insertAdjacentHTML('beforeend', markup);
};

refs.form.addEventListener('submit', submitHandler);
refs.moreBtn.addEventListener('click', moreBtnClickHandler);
