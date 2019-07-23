import { Component } from '@angular/core';
import { MockdataService } from './services/mockdata.service';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  //current page state
  state: string;

  //dataTableRows is the main list
  dataTableRows: any = [];
  //selected is an array of clicked itens on the datatable
  selected = [];
  //dataPageNumber handles the page number
  dataPageNumber = 1;


  //ui modal dialogs default state
  displayRemoveSingleItemModal: string = 'none';

  //data placeholder for modals
  removeSingleItemData  = {
    username: ''
  };

  newItemData  = {
    name: '',
    username: '',
    address: { city: '' },
    email: '',
    id: null,
    rideInGroup: '',
    daysOfTheWeek: {
      Sun: null,
      Mon: null,
      Tue: null,
      Wed: null,
      Thu: null,
      Fri: null,
      Sat: null
    }
  };

  //userinfo
  userInfo = {};
  
  constructor(
    private mockData: MockdataService,
    private userService: UserService
    ){
      //load the data
      this.userInfo = this.mockData.getUserInfo();
      this.loadTableData();
  }

  //handles data load from the "api" and pushes against existing dataTableRows dataset
  loadTableData(){
    //concatenate fresh data with existing data
    this.userService.getUsers().subscribe( res => { 
      this.dataTableRows = res.json();
      
      this.userService.getUsersPosts().subscribe( res => {

        let posts = res.json();

        this.dataTableRows.forEach((num, index) => {
            let postCount = posts.filter((post) => {
              return post.userId === this.dataTableRows[index].id;
            })
            this.dataTableRows[index].posts = postCount.length;

            //mocked "ride in group"
            this.dataTableRows[index].rideInGroup = this.mockData.getRideInGroup(); 

            //mocked "Day of the week"
            this.dataTableRows[index].daysOfTheWeek = this.mockData.getDaysOfTheWeek(); 
        });
        this.dataTableRows = [...this.dataTableRows];
      });

      this.userService.getUsersAlbums().subscribe( resAlbums => {
        this.userService.getUsersAlbumsPhotos().subscribe( resPhotos => {
          let albums = resAlbums.json();
          let photos = resPhotos.json();
          this.dataTableRows.forEach((num, index) => {
              let albumCount = albums.filter((album) => {
                return album.userId === this.dataTableRows[index].id;
              });
              let photosCount = [];
              albumCount.forEach((num, index) => {
                photosCount = photos.filter((photo) => {
                return photo.albumId === albumCount[index].id;
                })
              });
              this.dataTableRows[index].albums = albumCount.length;
              this.dataTableRows[index].photos = photosCount.length;
          });

          this.dataTableRows = [...this.dataTableRows];
        });
      });
    });
  }
  
  //NEW ITEM
  saveNewItem(updatedItem: any){

    //new record!

    //add an id to the item, so its possible to edit again
    updatedItem.id = Math.floor((Math.random() * 10000) + 50);

    console.log('saveEditItem DONE', updatedItem);

    let daysOfTheWeek = [];

    if(updatedItem.daysOfTheWeek.Sun) daysOfTheWeek.push('Sun');
    if(updatedItem.daysOfTheWeek.Mon) daysOfTheWeek.push('Mon');
    if(updatedItem.daysOfTheWeek.Tue) daysOfTheWeek.push('Tue');
    if(updatedItem.daysOfTheWeek.Wed) daysOfTheWeek.push('Wed');
    if(updatedItem.daysOfTheWeek.Thu) daysOfTheWeek.push('Thu');
    if(updatedItem.daysOfTheWeek.Fri) daysOfTheWeek.push('Fri');
    if(updatedItem.daysOfTheWeek.Sat) daysOfTheWeek.push('Sat');

    updatedItem.daysOfTheWeek = daysOfTheWeek.join(',');

    //add to the start of the array
    this.dataTableRows.unshift(updatedItem);
    
    //ngx-databale change detection https://swimlane.gitbook.io/ngx-datatable/change-detection
    this.dataTableRows = [...this.dataTableRows];

    //reset data before dismissing the modal
    this.newItemData  = {
      name: '',
      username: '',
      email: '',
      address: { city: '' },
      id: null,
      rideInGroup: '',
      daysOfTheWeek: {
        Sun: null,
        Mon: null,
        Tue: null,
        Wed: null,
        Thu: null,
        Fri: null,
        Sat: null
      }
    };

    console.log('saveEditItem DONE', updatedItem);
  }

  //REMOVE SINGLE ITEM
  confirmRemoveSingleItem(item: any){
    this.removeSingleItemData = item;
    this.displayRemoveSingleItemModal = 'block'; 
  }

  removeSingleItem(removeItem: any){
    //find the index for the item that was edited using its id.
    var removeSingleItemIndex = this.dataTableRows.findIndex(( elem, index ) => { if(elem.id == removeItem.id) return elem; } )

    //replace the old item with the new one
    this.dataTableRows.splice(removeSingleItemIndex, 1);
    //ngx-databale change detection https://swimlane.gitbook.io/ngx-datatable/change-detection
    this.dataTableRows = [...this.dataTableRows];
    
    //dismiss the modal
    this.dismissRemoveSingleItemModal();
  }

  dismissRemoveSingleItemModal(){
    this.displayRemoveSingleItemModal = 'none'; 
  }
}
