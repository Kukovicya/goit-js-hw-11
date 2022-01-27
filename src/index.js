import { throttle } from 'lodash';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import ListItems from './handlebars/listItems.hbs';
import { PixabyAPI } from './js/fetchFoto.js';

const galleryPhoto = document.querySelector('.gallery');
const form = document.querySelector('.search-form');
const textField = form.elements.searchQuery;
const pixabyApi = new PixabyAPI();
pixabyApi.page = 1;
let litebox = new SimpleLightbox('.gallery a');

form.addEventListener('submit', event => {
  event.preventDefault();
  galleryPhoto.innerHTML = '';
  const keyword = textField.value;
  pixabyApi.keyword = keyword;
  pixabyApi
    .fetchPhotos()
    .then(({ data } = {}) => {
      console.log(data);
      if (data.hits.length === 0) {
        Notify.failure('Sorry, there are no images matching your search query. Please try again.');
        return;
      } else if (data.hits.length > 0) {
        for (let photo of data.hits) {
          const photoLikes = photo.likes;
          const photoViews = photo.views;
          const photoComments = photo.comments;
          const photoDownloads = photo.downloads;
          const photoSmall = photo.webformatURL;
          const photoLarge = photo.largeImageURL;
          const photoAlt = photo.tags;

          galleryPhoto.insertAdjacentHTML(
            'beforeend',
            ListItems({
              photoLikes,
              photoViews,
              photoComments,
              photoDownloads,
              photoSmall,
              photoLarge,
              photoAlt,
            }),
          );
          litebox.refresh();
        }
      }
    })
    .catch(err => {
      console.log(err);
    });
  return;
});

window.addEventListener(
  'scroll',
  throttle(async event => {
    let windowRelativeBottom = document.documentElement.getBoundingClientRect().bottom;
    console.log('heloo');
    if (windowRelativeBottom <= document.documentElement.clientHeight + 100) {
      try {
        pixabyApi.page += 1;

        const { data } = await pixabyApi.fetchPhotos();

        for (let photo of data.hits) {
          const photoLikes = photo.likes;
          const photoViews = photo.views;
          const photoComments = photo.comments;
          const photoDownloads = photo.downloads;
          const photoSmall = photo.webformatURL;
          const photoLarge = photo.largeImageURL;
          const photoAlt = photo.tags;

          galleryPhoto.insertAdjacentHTML(
            'beforeend',
            ListItems({
              photoLikes,
              photoViews,
              photoComments,
              photoDownloads,
              photoSmall,
              photoLarge,
              photoAlt,
            }),
          );
          litebox.refresh();
        }
      } catch (err) {
        console.log(err);
      }
    }
  }),
  500,
  { leading: false },
);
