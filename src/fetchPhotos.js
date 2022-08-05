import { Notify } from 'notiflix';
export default class PhotosAPIServise {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.BASE_URL = 'https://pixabay.com/api/';
    this.KEY = '24752012-6c87264ae8b83647fd23322b3';
  }

  fetchPhotos() {
    return fetch(
      `${this.BASE_URL}?key=${this.KEY}&q=${this.searchQuery}&orientation=horizontal&image_type=photo&safesearch=true&page=${this.page}&per_page=4`
    ).then(response => {
      if (!response.ok) {
        throw new Error(response.status);
      }
      return response.json();
    });
    // .then(data => console.log(data));
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}

// import PhotosAPIServise from './fetchPhotos';
// const photosAPIServise = new PhotosAPIServise();
// photosAPIServise.query = e.target.elements.searchQuery.value.trim();
// if (photosAPIServise.searchQuery.length === 0) {
//   Notify.failure('Please, enter some text');
// } else photosAPIServise.fetchPhotos();

let searchQuery = 'cat';

// fetch(
//   `https://pixabay.com/api/?key=24752012-6c87264ae8b83647fd23322b3&q=${searchQuery}&orientation=horizontal&image_type=photo&safesearch=true&page=1&per_page=4`
// )
//   .then(response => {
//     return response.json();
//   })
//   .then(data => console.log(data));

// console.log(
//   fetch(
//     `https://pixabay.com/api/?key=24752012-6c87264ae8b83647fd23322b3&q=${searchQuery}&orientation=horizontal&image_type=photo&safesearch=true&page=1&per_page=4`
//   ).then(response => response.json)
// );
