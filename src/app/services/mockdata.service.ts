import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MockdataService {

  private list: Array<object> = [];

  constructor() { }

  getPresentationList(){
    for(var _i = 1; _i < 11; _i++){
      this.list.push({
        id: _i,
        username: 'USER'+ _i,
        name: 'Joao '+ _i,
        email: 'email'+ _i+'@teste.com',
        city: 'Cidade'+_i,
        rideInGroup: true,
        daysOfTheWeek: 'Every Day',
        posts: _i + 20,
        albums: _i + 30,
        photos: _i + 15
      })
    }

    //console.log(JSON.stringify(this.list));
    return this.list;
  }

  getUserInfo(){
    let userInfo = {
      name: 'Jason Bourne',
      initials: null
    }

    //get initials
    let names = userInfo.name.split(' ');
    let initials = [];
    names.forEach((num, index) => {
      initials.push(names[index].substring(0,1).toUpperCase());
    });

    userInfo.initials = initials.join('');

    return userInfo;
  }

  getRideInGroup(){
    let values = ['Always', 'Sometimes', 'Never'];
    return values[Math.floor((Math.random() * 3))];
  }

  getDaysOfTheWeek(){
    let values = ['Every Day', 'Week days', 'Week Ends', 'Mon, Wed','Tue, Thu', 'Fri'];
    return values[Math.floor((Math.random() * 6))];
  }
 
}
