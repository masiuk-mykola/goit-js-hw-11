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
  setTimeout(function () {
    const { height: cardHeight } = document
      .querySelector('.gallery')
      .firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  }, 500);
};

let gallery;
let height;
let scrollTop;
let scrollHeight;

const renderGallery = markup => {
  refs.div.insertAdjacentHTML('beforeend', markup);

  gallery = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionDelay: 250,
  });
  height = refs.div.clientHeight;
  scrollTop = refs.div.scrollTop;
  scrollHeight = refs.div.scrollHeight;
};

const moreBtnClickHandler = e => {
  e.preventDefault();
  photosAPIServise.incrementPage();
  photosAPIServise.fetchPhotos().then(data => {
    const markup = createGalleryMarkup(data.hits);
    renderGallery(markup);
    let currentPage = photosAPIServise.pageNumber;
    if (currentPage * 40 >= data.totalHits) {
      Notify.warning(
        `We're sorry, but you've reached the end of search results.`
      );
    }
  });
  gallery.refresh();
  setTimeout(function () {
    const { height: cardHeight } = document
      .querySelector('.gallery')
      .firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  }, 500);
};

const createGalleryMarkup = data => {
  return data
    .map(
      item =>
        `
    <div class="photo-card">
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
</div>
`
    )
    .join('');
};

const addLoadMoreBtn = () => {
  refs.moreBtn.classList.remove('is-visible');
};

const removeLoadMoreBtn = () => {
  refs.moreBtn.classList.add('is-visible');
};

const scrollBottomHandler = e => {
  e.preventDefault();
  if (
    window.scrollY + 1 >=
    document.documentElement.scrollHeight -
      document.documentElement.clientHeight
  ) {
    photosAPIServise.incrementPage();
    photosAPIServise.fetchPhotos().then(data => {
      const markup = createGalleryMarkup(data.hits);
      renderGallery(markup);
    });
    gallery.refresh();
    setTimeout(function () {
      const { height: cardHeight } = document
        .querySelector('.gallery')
        .firstElementChild.getBoundingClientRect();
      window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
      });
    }, 500);
  }
};

refs.form.addEventListener('submit', submitHandler);
refs.moreBtn.addEventListener('click', moreBtnClickHandler);
window.addEventListener('scroll', scrollBottomHandler);
