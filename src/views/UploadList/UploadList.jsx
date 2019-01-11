// React Class

import React, { Component } from "react";
import { RegularCard, Table, ItemGrid, Button } from "components";
import { Grid } from "material-ui";
import axios from "axios";

import BootstrapTable from 'react-bootstrap-table-next';
import cellEditFactory, { Type } from 'react-bootstrap-table2-editor';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';

// Utils
import auth from 'utils/auth';

import Loader from 'react-loader-advanced';
import Spinner from 'react-spinkit';
import { SwatchesPicker } from 'react-color';
import Modal from 'react-modal';
import Iframe from 'react-iframe';
import 'typeface-roboto'

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  }
};

const customMessageElement = (
  <div>custom message element</div>
);

const spinner = (
  <Spinner name="line-scale"/>
);

const SERVER_URL = 'https://geo.mapid.io';
const STRAPI_URL = 'https://db.mapid.io';
//const SERVER_URL = 'http://192.168.1.13';

const columns = [{
    dataField: 'filename',
    text: 'File Name',
    filter: textFilter(),
    sort: true,
    headerStyle: {
      backgroundColor: '#bec1ce'
    },style: (cell, row, rowIndex, colIndex) => {
      return {
        backgroundColor: 'white'
      };
    }
  }, {
    dataField: 'location',
    text: 'Location',
    sort: true,
    headerStyle: {
      backgroundColor: '#bec1ce'
    },
    style: (cell, row, rowIndex, colIndex) => {
      return {
        backgroundColor: 'white'
      };
    },
    hidden: true
  }, 
  {
    dataField: 'type',
    text: 'Geojson Type',
    filter: textFilter(),
    sort: true,
    headerStyle: {
      backgroundColor: '#bec1ce'
    },
    style: (cell, row, rowIndex, colIndex) => {
      return {
        backgroundColor: 'white'
      };
    },
    editor: {
      type: Type.SELECT,
      options: [{
        value: 'symbol',
        label: 'symbol'
      }, {
        value: 'line',
        label: 'line'
      }, {
        value: 'fill',
        label: 'fill'
      }]
    }
  },
  {
    dataField: 'view',
    text: 'View Type',
    filter: textFilter(),
    sort: true,
    headerStyle: {
      backgroundColor: '#bec1ce'
    },
    style: (cell, row, rowIndex, colIndex) => {
      return {
        backgroundColor: 'white'
      };
    },
    editor: {
      type: Type.SELECT,
      options: [{
        value: 'standard',
        label: 'standard'
      }, {
        value: 'insight',
        label: 'insight'
      }, {
        value: 'television',
        label: 'television'
      }, {
        value: 'ioT',
        label: 'ioT'
      }]
    }
  },  
  {
    dataField: 'active',
    text: 'Show/Hide',
    filter: textFilter(),
    sort: true,
    headerStyle: {
      backgroundColor: '#bec1ce'
    },
    style: (cell, row, rowIndex, colIndex) => {
      if (row.active === 'show') {
        return {
          backgroundColor: '#87CEEB'
        };
      }
      return {
        backgroundColor: '#CD5C5C'
      };
    },
    editor: {
      type: Type.SELECT,
      options: [{
        value: 'show',
        label: 'show'
      }, {
        value: 'hide',
        label: 'hide'
      }]
    }
  },
  {
    dataField: '_id',
    text: 'ID',
    headerStyle: {
      backgroundColor: '#bec1ce'
    },
    hidden: true
  },
  {
    dataField: 'filesize',
    text: 'Size (MB)',
    sort: true,
    headerStyle: {
      backgroundColor: '#bec1ce'
    },style: (cell, row, rowIndex, colIndex) => {
      return {
        backgroundColor: 'white'
      };
    }
  },
  {
    dataField: 'icon',
    text: 'Icon',
    filter: textFilter(),
    sort: true,
    headerStyle: {
      backgroundColor: '#bec1ce'
    },
    style: (cell, row, rowIndex, colIndex) => {
      return {
        backgroundColor: 'white'
      };
    },
    editor: {
      type: Type.SELECT,
      options: [
        {
        value: 'airfield-11',label: 'airfield-11'}, {value: 'airfield-15',label: 'airfield-15'}, 
        {
        value: 'airport-11',label: 'airport-11'}, {value: 'airport-15',label: 'airport-15'}, 
        {
        value: 'alcohol-shop-11',label: 'alcohol-shop-11'}, {value: 'alcohol-shop-15',label: 'alcohol-shop-15'}, 
        {
        value: 'amusement-park-11',label: 'amusement-park-11'}, {value: 'amusement-park-15',label: 'amusement-park-15'}, 
        {
        value: 'aquarium-11',label: 'aquarium-11'}, {value: 'aquarium-15',label: 'aquarium-15'}, 
        {
        value: 'art-gallery-11',label: 'art-gallery-11'}, {value: 'art-gallery-15',label: 'art-gallery-15'}, 
        {
        value: 'attraction-11',label: 'attraction-11'}, {value: 'attraction-15',label: 'attraction-15'}, 
        {
        value: 'bakery-11',label: 'bakery-11'}, {value: 'bakery-15',label: 'bakery-15'}, 
        {
        value: 'bank-11',label: 'bank-11'}, {value: 'bank-15',label: 'bank-15'}, 
        {
        value: 'bar-11',label: 'bar-11'}, {value: 'bar-15',label: 'bar-15'}, 
        {
        value: 'beer-11',label: 'beer-11'}, {value: 'beer-15',label: 'beer-15'}, 
        {
        value: 'bicycle-11',label: 'bicycle-11'}, {value: 'bicycle-15',label: 'bicycle-15'}, 
        {
        value: 'bicycle-share-11',label: 'bicycle-share-11'}, {value: 'bicycle-share-15',label: 'bicycle-share-15'}, 
        {
        value: 'airport-11',label: 'airport-11'}, {value: 'airport-11',label: 'airport-11'}, 
        {
        value: 'bus-11',label: 'bus-11'}, {value: 'bus-15',label: 'bus-15'},
        {
        value: 'cafe-11',label: 'cafe-11'}, {value: 'cafe-15',label: 'cafe-15'},
        {
        value: 'campsite-11',label: 'campsite-11'}, {value: 'campsite-15',label: 'campsite-15'},
        {
        value: 'car-11',label: 'car-11'}, {value: 'car-15',label: 'car-15'},
        {
        value: 'castle-11',label: 'castle-11'}, {value: 'castle-15',label: 'castle-15'},
        {
        value: 'cemetery-11',label: 'cemetery-11'}, {value: 'cemetery-15',label: 'cemetery-15'},
        {
        value: 'cinema-11',label: 'cinema-11'}, {value: 'cinema-15',label: 'cinema-15'},
        {
        value: 'circle-11',label: 'circle-11'}, {value: 'circle-15',label: 'circle-15'},
        {
        value: 'circle-stroked-11',label: 'circle-stroked-11'}, {value: 'circle-stroked-15',label: 'circle-stroked-15'},
        {
        value: 'clothing-store-11',label: 'clothing-store-11'}, {value: 'clothing-store-15',label: 'clothing-store-15'},
        {
        value: 'college-11',label: 'college-11'}, {value: 'college-15',label: 'college-15'},
        {
        value: 'dentist-11',label: 'dentist-11'}, {value: 'dentist-15',label: 'dentist-15'},
        {
        value: 'doctor-11',label: 'doctor-11'}, {value: 'doctor-15',label: 'doctor-15'},
        {
        value: 'dog-park-11',label: 'dog-park-11'}, {value: 'dog-park-15',label: 'dog-park-15'},
        {
        value: 'drinking-water-11',label: 'drinking-water-11'}, {value: 'drinking-water-15',label: 'drinking-water-15'},
        {
        value: 'embassy-11',label: 'embassy-11'}, {value: 'embassy-15',label: 'embassy-15'},
        {
        value: 'entrance-11',label: 'entrance-11'}, {value: 'entrance-15',label: 'entrance-15'},
        {
        value: 'fast-food-11',label: 'fast-food-11'}, {value: 'fast-food-15',label: 'fast-food-15'},
        {
        value: 'ferry-11',label: 'ferry-11'}, {value: 'ferry-15',label: 'ferry-15'},
        {
        value: 'fire-station-11',label: 'fire-station-11'}, {value: 'fire-station-15',label: 'fire-station-15'},
        {
        value: 'fuel-11',label: 'fuel-11'}, {value: 'fuel-15',label: 'fuel-15'},
        {
        value: 'garden-11',label: 'garden-11'}, {value: 'garden-15',label: 'garden-15'},
        {
        value: 'golf-11',label: 'golf-11'}, {value: 'golf-15',label: 'golf-15'},
        {
        value: 'grocery-11',label: 'grocery-11'}, {value: 'grocery-15',label: 'grocery-15'},
        {
        value: 'harbor-11',label: 'harbor-11'}, {value: 'harbor-15',label: 'harbor-15'},
        {
        value: 'heliport-11',label: 'heliport-11'}, {value: 'heliport-15',label: 'heliport-15'},
        {
        value: 'hospital-11',label: 'hospital-11'}, {value: 'hospital-15',label: 'hospital-15'},
        {
        value: 'ice-cream-11',label: 'ice-cream-11'}, {value: 'ice-cream-15',label: 'ice-cream-15'},
        {
        value: 'information-11',label: 'information-11'}, {value: 'information-15',label: 'information-15'},
        {
        value: 'laundry-11',label: 'laundry-11'}, {value: 'laundry-15',label: 'laundry-15'},
        {
        value: 'library-11',label: 'library-11'}, {value: 'library-15',label: 'library-15'},
        {
        value: 'lodging-11',label: 'lodging-11'}, {value: 'lodging-15',label: 'lodging-15'},
        {
        value: 'marker-11',label: 'marker-11'}, {value: 'marker-15',label: 'marker-15'},
        {
        value: 'monument-11',label: 'monument-11'}, {value: 'monument-15',label: 'monument-15'},
        {
        value: 'mountain-11',label: 'mountain-11'}, {value: 'mountain-15',label: 'mountain-15'},
        {
        value: 'museum-11',label: 'museum-11'}, {value: 'museum-15',label: 'museum-15'},
        {
        value: 'music-11',label: 'music-11'}, {value: 'music-15',label: 'music-15'},
        {
        value: 'park-11',label: 'park-11'}, {value: 'park-15',label: 'park-15'},
        {
        value: 'pharmacy-11',label: 'pharmacy-11'}, {value: 'pharmacy-15',label: 'pharmacy-15'},
        {
        value: 'picnic-site-11',label: 'picnic-site-11'}, {value: 'picnic-site-15',label: 'picnic-site-15'},
        {
        value: 'place-of-worship-11',label: 'place-of-worship-11'}, {value: 'place-of-worship-15',label: 'place-of-worship-15'},
        {
        value: 'playground-11',label: 'playground-11'}, {value: 'playground-15',label: 'playground-15'},
        {
        value: 'police-11',label: 'police-11'}, {value: 'police-15',label: 'police-15'},
        {
        value: 'post-11',label: 'post-11'}, {value: 'post-15',label: 'post-15'},
        {
        value: 'prison-11',label: 'prison-11'}, {value: 'prison-15',label: 'prison-15'},
        {
        value: 'rail-11',label: 'rail-11'}, {value: 'rail-15',label: 'rail-15'},
        {
        value: 'rail-light-11',label: 'rail-light-11'}, {value: 'rail-light-15',label: 'rail-light-15'},
        {
        value: 'rail-metro-11',label: 'rail-metro-11'}, {value: 'rail-metro-15',label: 'rail-metro-15'},
        {
        value: 'religious-christian-11',label: 'religious-christian-11'}, {value: 'religious-christian-15',label: 'religious-christian-15'},
        {
        value: 'religious-jewish-11',label: 'religious-jewish-11'}, {value: 'religious-jewish-15',label: 'religious-jewish-15'},
        {
        value: 'religious-muslim-11',label: 'religious-muslim-11'}, {value: 'religious-muslim-15',label: 'religious-muslim-15'},
        {
        value: 'restaurant-11',label: 'restaurant-11'}, {value: 'restaurant-15',label: 'restaurant-15'},
        {
        value: 'rocket-11',label: 'rocket-11'}, {value: 'rocket-15',label: 'rocket-15'},
        {
        value: 'school-11',label: 'school-11'}, {value: 'school-15',label: 'school-15'},
        {
        value: 'shop-11',label: 'shop-11'}, {value: 'shop-15',label: 'shop-15'},
        {
        value: 'stadium-11',label: 'stadium-11'}, {value: 'stadium-15',label: 'stadium-15'},
        {
        value: 'star-11',label: 'star-11'}, {value: 'star-15',label: 'star-15'},
        {
        value: 'suitcase-11',label: 'suitcase-11'}, {value: 'suitcase-15',label: 'suitcase-15'},
        {
        value: 'swimming-11',label: 'swimming-11'}, {value: 'swimming-15',label: 'swimming-15'},
        {
        value: 'theatre-11',label: 'theatre-11'}, {value: 'theatre-15',label: 'theatre-15'},
        {
        value: 'toilet-11',label: 'toilet-11'}, {value: 'toilet-15',label: 'toilet-15'},
        {
        value: 'town-hall-11',label: 'town-hall-11'}, {value: 'town-hall-15',label: 'town-hall-15'},
        {
        value: 'triangle-11',label: 'triangle-11'}, {value: 'triangle-15',label: 'triangle-15'},
        {
        value: 'triangle-stroked-11',label: 'triangle-stroked-11'}, {value: 'triangle-stroked-15',label: 'triangle-stroked-15'},
        {
        value: 'veterinary-11',label: 'veterinary-11'}, {value: 'veterinary-15',label: 'veterinary-15'},
        {
        value: 'volcano-11',label: 'volcano-11'}, {value: 'volcano-15',label: 'volcano-15'},
        {
        value: 'zoo-11',label: 'zoo-11'}, {value: 'zoo-15',label: 'zoo-15'}
      ]
    }
  },
  {
    dataField: 'edit',
    text: 'Edit',
    headerStyle: {
      backgroundColor: '#bec1ce'
    },
    style: (cell, row, rowIndex, colIndex) => {
      return {
        backgroundColor: 'white'
      };
    },
    events: {
      onClick: () => alert('Edit layer')
    }
  },
  {
    dataField: 'delete',
    text: 'Delete',
    headerStyle: {
      backgroundColor: '#bec1ce'
    },
    style: (cell, row, rowIndex, colIndex) => {
      return {
        backgroundColor: 'white'
      };
    },
    events: {
      onClick: () => alert('Delete layer')
    }
  },
];

const rowEvents = {
  onClick: (e, row, rowIndex) => {
    alert(`Layer Deleted at: ${rowIndex}`);
  }
};

let rows = [];

class UploadList extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      column: [],
      rowData: [],
      rowID: 0,
      newValue: '',
      totalsize: 0,
      showModal: false,
      background: '#fff',
      color: {
        r: '241',
        g: '112',
        b: '19',
        a: '1',
      },
      geojsonModal: false,
      selectedID:'',
      selectedLocation:'',
      selectedColor:'',
      selectedIcon:'',
      selectedFilename:'',
      account_type:'',
      totalUploaded: 0
    }
    this.loadFileList = this.loadFileList.bind(this);
    this.loadUserProfile = this.loadUserProfile.bind(this);
    this.updateRemoteData = this.updateRemoteData.bind(this);
    this.updateGeojsonType = this.updateGeojsonType.bind(this);
    this.updateFilename = this.updateFilename.bind(this);
    this.updateGeojsonColor = this.updateGeojsonColor.bind(this);
    this.updateGeojsonIcon = this.updateGeojsonIcon.bind(this);
    this.testGeojsonUpdate = this.testGeojsonUpdate.bind(this);

    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.cancelModal = this.cancelModal.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.generateNewLayer = this.generateNewLayer.bind(this);
  }

  componentDidMount() {

    /*axios.get('http://192.168.1.2:1337/fileuploads?username='+auth.getUserInfo().username).then(res => {
      const layers = res.data;
      this.setState({ layers });

      const converted = Object.keys(layers).map(function(key) {
        var layer = layers[key];
        layer.name = key;
        return layer;
      });

      console.log("Layers ", converted);
    });*/

    this.loadFileList();
    this.loadUserProfile();
  }

  loadFileList() {
    // Make a request for a user with a given ID
    rows = [];

      axios.get(STRAPI_URL+'/fileuploads', {
          params: {
            username: auth.getUserInfo().username
          }
        }).then(response => {
        // handle success
        console.log(response);
        const fileList = response.data
        console.log(fileList);

        var i;
        var total = 0;
        for (i = 0; i < fileList.length; i++) {
          var modifiedDate = new Date(fileList[i].created_at);
          rows.push({
            filename:fileList[i].filename,
            location: fileList[i].server_url,
            type:fileList[i].type,
            active: fileList[i].active,
            filesize: fileList[i].filesize/1000000,
            _id: fileList[i]._id,
            color: fileList[i].color,
            icon: fileList[i].icon,
            view: fileList[i].display_type,
            delete:"Delete",
            edit:"Edit"
          });
          total = total + fileList[i].filesize;
        }
        this.setState({ rowData:rows, totalsize: total, showModal: false, totalUploaded: fileList.length });
      });
  }

  loadUserProfile() {
    axios
      .get(STRAPI_URL + "/userdetail", {
        params: {
          username: auth.getUserInfo().username
        }
      })
      .then(response => {
        // handle success
        if (response.data) {
          console.log(response);
          const userdetails = response.data;
          console.log(userdetails);
          this.setState({
            account_type: userdetails[0].account_type
          });
        }
      })
      .catch(function (error) {
        // handle error
        console.log(error);
        //setTimeout(this.loadUserProfile(),3000);
      })
      .then(function () {
        // always executed
        //setTimeout(this.loadUserProfile(),3000);
      });
  }

  deleteRemoteData(id) {
    console.log("Row ID: ", id);

    var promise = new Promise(function (resolve, reject) {
      axios.delete(`https://db.mapid.io/fileuploads/${id}`)
        .then(function (responses) {
          console.log("Respon Data: ", responses.data);
          if (responses.data.ok == 1) {
            alert('Success!');
          }
          resolve('true');
        })
        .catch(function (error) {
          console.log(error);
          alert(error);
        });
      // call resolve if the method succeeds
      
    })
    promise.then(bool => this.loadFileList())
  }

  editRemoteData(location) {
    //var win = window.open('http://geojson.io/#data=data:text/x-url,'+location, '_blank');
    var win = window.open('http://34.209.242.8:8080/#data=data:text/x-url,'+location, '_blank');
    //var win = window.open('http://localhost:8080/#data=data:text/x-url,'+location, '_blank');
  }

  updateRemoteData(id, activevalue) {
    console.log("Row ID: ", id);
    console.log("Row Active Value: ", activevalue);
    this.setState({
      showModal: true
    });

    var promise = new Promise(function (resolve, reject) {
      axios.put(`https://db.mapid.io/fileuploads/${id}`, /*{
      //axios.put(`http://192.168.1.2:1337/fileuploads/${id}`,
          /*{
                 params: {
                   _id:id
                 }
               },*/
          {
            active: activevalue
          })
        .then(function (responses) {
          console.log("Respon Data: ", responses.data);
          if (responses.data.ok == 1) {
            alert('Success!');
          }
          resolve('true');
        })
        .catch(function (error) {
          console.log(error);
          alert(error);
        });
      // call resolve if the method succeeds
      
    })
    promise.then(bool => this.loadFileList())
  }

  updateGeojsonType(id, typevalue) {
    this.setState({
      showModal: true
    });
    console.log("Row ID: ", id);
    console.log("Row Type Value: ", typevalue);

    var promise = new Promise(function (resolve, reject) {
      axios.put(`https://db.mapid.io/fileuploads/${id}`, /*{
      //axios.put(`http://192.168.1.2:1337/fileuploads/${id}`,
          /*{
                 params: {
                   _id:id
                 }
               },*/
          {
            type: typevalue
          })
        .then(function (responses) {
          console.log("Respon Data: ", responses.data);
          if (responses.data.ok == 1) {
            alert('Success!');
          }
          resolve('true');
        })
        .catch(function (error) {
          console.log(error);
          alert(error);
        });
      // call resolve if the method succeeds
      
    })
    promise.then(bool => this.loadFileList())
  }

  updateFilename(id, namevalue) {
    this.setState({
      showModal: true
    });
    console.log("Row ID: ", id);
    console.log("Row Type Value: ", namevalue);

    var promise = new Promise(function (resolve, reject) {
      axios.put(`https://db.mapid.io/fileuploads/${id}`, /*{
      //axios.put(`http://192.168.1.2:1337/fileuploads/${id}`,
          /*{
                 params: {
                   _id:id
                 }
               },*/
          {
            filename: namevalue
          })
        .then(function (responses) {
          console.log("Respon Data: ", responses.data);
          if (responses.data.ok == 1) {
            alert('Success!');
          }
          resolve('true');
        })
        .catch(function (error) {
          console.log(error);
          alert(error);
        });
      // call resolve if the method succeeds
      
    })
    promise.then(bool => this.loadFileList())
  }

  updateGeojsonColor(id, color) {
    this.setState({
      showModal: true
    });
    console.log("Row ID: ", id);
    console.log("Row Type Value: ", color);

    var promise = new Promise(function (resolve, reject) {
      axios.put(`https://db.mapid.io/fileuploads/${id}`, /*{
      //axios.put(`http://192.168.1.2:1337/fileuploads/${id}`,
          /*{
                 params: {
                   _id:id
                 }
               },*/
          {
            color: color
          })
        .then(function (responses) {
          console.log("Respon Data: ", responses.data);
          if (responses.data.ok == 1) {
            alert('Success!');
          }
          resolve('true');
        })
        .catch(function (error) {
          console.log(error);
          alert(error);
        });
      // call resolve if the method succeeds
      
    })
    promise.then(bool => this.loadFileList())
    
  }

  updateGeojsonIcon(id, icon) {
    this.setState({
      showModal: true
    });
    console.log("Row ID: ", id);
    console.log("Row Type Value: ", icon);

    var promise = new Promise(function (resolve, reject) {
      axios.put(`https://db.mapid.io/fileuploads/${id}`, /*{
      //axios.put(`http://192.168.1.2:1337/fileuploads/${id}`,
          /*{
                 params: {
                   _id:id
                 }
               },*/
          {
            icon: icon
          })
        .then(function (responses) {
          console.log("Respon Data: ", responses.data);
          if (responses.data.ok == 1) {
            alert('Success!');
          }
          resolve('true');
        })
        .catch(function (error) {
          console.log(error);
          alert(error);
        });
      // call resolve if the method succeeds
      
    })
    promise.then(bool => this.loadFileList())
    
  }

  testGeojsonUpdate(id, location, color, icon, view, filename){
    console.log('View: ', view);
    console.log('Icon: ', icon);
    console.log('Nomer ID: ', id);
    this.setState({
      showModal: true
    });
    var promise = new Promise(function (resolve, reject) {
      axios.post(SERVER_URL + '/updatelayer', {
        location: location,
        color: color,
        icon: icon,
        view: view,
        id: id,
        username: auth.getUserInfo().username,
        filename: filename
      })
      .then(function (response) {
        console.log(response.data);
        if (response.data == 'success') {
          console.log("Server side converting success");
        }
        resolve('true');
      })
      .catch(function (error) {
        console.log("Server side converting error: ",error)
      });
    })
    promise.then(bool => this.loadFileList())
  }

  handleChange(color, event) {
    // color = {
    //   hex: '#333',
    //   rgb: {
    //     r: 51,
    //     g: 51,
    //     b: 51,
    //     a: 1,
    //   },
    //   hsl: {
    //     h: 0,
    //     s: 0,
    //     l: .20,
    //     a: 1,
    //   },
    // }
    console.log('Color: ', color.hex);
    this.setState({background: color.hex,
    selectedColor:color.hex});
  }

  openModal(id, location, color, icon, filename) {
    this.setState({geojsonModal: true,
      selectedID:id,
      selectedLocation:location,
      selectedColor:color,
      selectedIcon:icon,
      selectedFilename:filename});
  }

  afterOpenModal() {
    // references are now sync'd and can be accessed.
  }

  closeModal() {
    this.setState({geojsonModal: false});
    //this.testGeojsonUpdate(this.state.selectedID, this.state.selectedLocation, this.state.selectedColor, this.state.selectedIcon, this.state.selectedFilename);
  }

  cancelModal(){
    this.setState({geojsonModal: false});
  }

  generateNewLayer() {

    if(this.state.account_type === 'free' && this.state.totalUploaded >= 5){
      alert("The Limit for free user is 5 layer");
    }
    else{
      this.setState({
        showModal: true
      });
      var username = auth.getUserInfo().username;
      let now = new Date();
      var filename = username + '_' + now.getFullYear() + now.getMonth().toLocaleString() + now.getDate().toLocaleString() + now.getHours().toLocaleString() + now.getMinutes().toLocaleString() + now.getSeconds().toLocaleString()+'.geojson';
      console.log('Auto Generate Filename: ', filename.toString());
      var geojson = '{"type": "FeatureCollection","features": []}';
  
      var promise = new Promise(function (resolve, reject) {
        axios
          .post(SERVER_URL + '/api/newlayer', {
            username: username,
            filename: filename,
            geojson: geojson
          })
          .then(function (response) {
            console.log(response.data);
            if (response.data == 'success') {
              console.log('Server side converting success');
              resolve('true');
            }
          })
          .catch(function (error) {
            console.log('Server side converting error: ', error);
          });
      })
      promise.then(bool => this.loadFileList())
    }
  }

  render() {

    const rowStyle2 = (row, rowIndex) => {
      const style = {};
      style.backgroundColor = rows[rowIndex].color;
      style.borderStyle = 'none';
    
      return style;
    };

    return (
      <div>
        <Loader show={this.state.showModal} message={spinner}>
          <Modal
            isOpen={this.state.geojsonModal}
            onAfterOpen={this.afterOpenModal}
            onRequestClose={this.closeModal}
          >
            <ItemGrid xs={12} sm={12} md={12}>
              <Iframe
                url={'http://34.209.242.8:8080/#data=data:text/x-url,' + this.state.selectedLocation}
                width="100%"
                height="768px"
                id="myId"
                className="myClassname"
                display="initial"
                position="relative"
                allowFullScreen
              />
            </ItemGrid>
          </Modal>
          <Grid container>
            <ItemGrid xs={12} sm={12} md={12}>
              <RegularCard
                headerColor="blue"
                plainCard
                cardTitle="Current Active Layers"
                cardSubtitle={'Total Uploaded Layer: ' + this.state.totalUploaded + " / 5" }
                content={
                  <BootstrapTable
                    keyField="id"
                    data={this.state.rowData}
                    columns={columns}
                    striped
                    hover
                    condensed
                    bordered={ true }
                    rowStyle={rowStyle2}
                    noDataIndication="No Layer is Uploaded"
                    filter={filterFactory()}
                    cellEdit={cellEditFactory({
                      mode: 'click',
                      blurToSave: true,
                      beforeSaveCell: (oldValue, newValue, row, column) => { console.log('Before Saving Cell!!'); },
                      afterSaveCell: (oldValue, newValue, row, column) => {
                        console.log('After Saving Cell!!', ' row ', row._id);
                        console.log('After saving cell column: ', column);
                        if (column.dataField == "active") {
                          this.setState({
                            rowID: row._id,
                            newValue: newValue
                          });
                          this.updateRemoteData(row._id, newValue);
                        }
                        if (column.dataField == "type") {
                          this.setState({
                            rowID: row._id,
                            newValue: newValue
                          });
                          this.updateGeojsonType(row._id, newValue);
                        }
                        if (column.dataField == "filename") {
                          this.setState({
                            rowID: row._id,
                            newValue: newValue
                          });
                          this.updateFilename(row._id, newValue);
                        }
                        if (column.dataField == "delete") {
                          console.log("Delete activated!");
                          this.deleteRemoteData(row._id);
                          //this.testGeojsonUpdate(row._id, row.location, row.color, row.icon, row.filename, row._id)
                        }
                        if (column.dataField == "edit") {
                          console.log("Edit Layer activated!");
                          this.editRemoteData(row.location);
                          /*this.setState({
                            selectedLocation: row.location,
                            selectedFilename: row.filename,
                            geojsonModal: true
                          });*/
                        }
                        if (column.dataField == "color") {
                          this.setState({
                            rowID: row._id,
                            newValue: newValue
                          });
                          //this.updateGeojsonColor(row._id, newValue);
                          //this.testGeojsonUpdate(row._id, row.location, newValue, row.icon, row.filename, row._id)
                          this.openModal(row._id, row.location, newValue, row.icon, row.filename, row._id);
                        }
                        if (column.dataField == "icon") {
                          this.setState({
                            rowID: row._id,
                            newValue: newValue
                          });
                          //this.updateGeojsonIcon(row._id, newValue);
                          this.testGeojsonUpdate(row._id, row.location, 'default' , newValue, row.view, row.filename)
                        }
                        if (column.dataField == "view") {
                          console.log("Set view type");
                          this.setState({
                            rowID: row._id,
                            newValue: newValue
                          });
                          //this.updateGeojsonIcon(row._id, newValue);
                          this.testGeojsonUpdate(row._id, row.location, 'default' , row.icon, newValue, row.filename)
                        }
                      }
                    })}
                  />
                }
              />
            </ItemGrid>
          </Grid>
          <Button color="bluemapid" round onClick={() => {
            console.log('Update');
          }}>Update</Button>
          <Button color="bluemapid" round onClick={() => {
            this.generateNewLayer();
          }}>New Layer</Button>
        </Loader>
      </div>
    );
  }
}

<UploadList />;

export default UploadList;
