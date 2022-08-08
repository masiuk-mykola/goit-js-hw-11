import axios from 'axios';
import { Notify } from 'notiflix';

export default class PhotosAPIServise {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.BASE_URL = 'https://pixabay.com/api/';
    this.KEY = '24752012-6c87264ae8b83647fd23322b3';
  }

  async fetchPhotos() {
    try {
      const response = await axios.get(
        `${this.BASE_URL}?key=${this.KEY}&q=${this.searchQuery}&orientation=horizontal&image_type=photo&safesearch=true&page=${this.page}&per_page=40`
      );
      const data = await JSON.parse(response.request.response);
      return data;
    } catch (error) {
      Notify.warning(
        `We're sorry, but you've reached the end of search results.`
      );
    }
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

  get pageNumber() {
    return this.page;
  }

  set pageNumber(newPage) {
    this.page = newPage;
  }
}
