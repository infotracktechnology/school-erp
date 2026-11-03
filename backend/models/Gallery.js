import { Model } from 'sutando';

export class Gallery extends Model {
  table = 'gallery_albums';

  branch() {
    return this.belongsTo('Branch', 'branch_id');
  }
  media() {
    return this.hasMany('GalleryMedia', 'album_id');
  }
  
  studentlits(){
    return [];
  }
}

export default Gallery;
