import './css/styles.css';
import PhotosAPIServise from './fetchPhotos';
import { Notify } from 'notiflix';
// import SimpleLightbox from 'simplelightbox';
import SimpleLightbox from 'simplelightbox/dist/simple-lightbox.esm';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  form: document.querySelector('.search-form'),
  div: document.querySelector('.gallery'),
  moreBtn: document.querySelector('.load-more'),
};

const photosAPIServise = new PhotosAPIServise();

const submitHandler = e => {
  e.preventDefault();
  removeLoadMoreBtn();
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
  setTimeout(addLoadMoreBtn, 500);
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
        `<a href="${item.largeImageURL}">
    <div class="photo-card">
      <img src="${item.webformatURL}" alt="${item.tags}" loading="lazy" />
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
</div>
</a>`
    )
    .join('');
};

const renderGallery = markup => {
  refs.div.insertAdjacentHTML('beforeend', markup);
};

const addLoadMoreBtn = () => {
  refs.moreBtn.classList.remove('is-visible');
};

const removeLoadMoreBtn = () => {
  refs.moreBtn.classList.add('is-visible');
};

refs.form.addEventListener('submit', submitHandler);
refs.moreBtn.addEventListener('click', moreBtnClickHandler);

// let gallery = new SimpleLightbox('.gallery a');
// gallery.on('show.simplelightbox', function () {
//   console.log('ok');
// });

new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});
