'use strict';

import axios from 'axios';

export class PixabyAPI {
  #BASE_URL = 'https://pixabay.com/api/';
  #API_KEY = '25421378-7dd4008b1858c0472cac3c1f7';

  constructor(keyword = null) {
    this.page = 1;
    this.keyword = keyword;
  }

  fetchPhotos() {
    return axios.get(`${this.#BASE_URL}`, {
      params: {
        key: this.#API_KEY,
        q: this.keyword,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: this.page,
        per_page: 40,
      },
    });
  }
}
