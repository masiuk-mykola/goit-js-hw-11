import './css/styles.css';

const refs = {
  form: document.querySelector('.search-form'),
  div: document.querySelector('.gallery'),
  moreBtn: document.querySelector('.load-more'),
};

const submitHandler = e => {
  e.preventDefault();
  let inputValue = e.target.elements[0].value.trim();
  fetchPhotos(inputValue).then(data => {
    console.log(data.hits);
    const markup = createGalleryMarkup(data.hits);
    renderGallery(markup);
  });
};

refs.form.addEventListener('submit', submitHandler);

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
  refs.div.innerHTML = markup;
};

const BASE_URL = 'https://pixabay.com/api/';
const KEY = '24752012-6c87264ae8b83647fd23322b3';

function fetchPhotos(value) {
  return fetch(
    `${BASE_URL}?key=${KEY}&q=${value}&orientation=horizontal&image_type=photo&safesearch=true`
  ).then(response => {
    if (!response.ok) {
      throw new Error(response.status);
    }
    return response.json();
  });
}
