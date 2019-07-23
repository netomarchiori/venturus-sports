import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { map, filter, scan } from 'rxjs/operators';
import { API } from './api';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: Http) { }

  getUsers(){
    return this.http.get(`${API}/users`);
  }

  getUsersPosts(){
    return this.http.get(`${API}/posts`);
  }  

  getUsersAlbums(){
    return this.http.get(`${API}/albums`);
  } 

  getUsersAlbumsPhotos(){
    return this.http.get(`${API}/photos`);
  } 
}
