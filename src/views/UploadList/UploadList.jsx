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

const SERVER_URL = 'http://54.245.202.137';
//const SERVER_URL = 'http://192.168.1.13';

const columns = [{
    dataField: 'filename',
    text: 'File Name',
    filter: textFilter(),
    sort: true,
    headerStyle: {
      backgroundColor: '#6495ED'
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
      backgroundColor: '#6495ED'
    },
    style: (cell, row, rowIndex, colIndex) => {
      return {
        backgroundColor: 'white'
      };
    },
    hidden: true
  }, {
    dataField: 'type',
    text: 'Geojson Type',
    filter: textFilter(),
    sort: true,
    headerStyle: {
      backgroundColor: '#6495ED'
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
  }, {
    dataField: 'active',
    text: 'Show/Hide',
    filter: textFilter(),
    sort: true,
    headerStyle: {
      backgroundColor: '#6495ED'
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
      backgroundColor: '#6495ED'
    },
    hidden: true
  },
  {
    dataField: 'filesize',
    text: 'Size (MB)',
    sort: true,
    headerStyle: {
      backgroundColor: '#6495ED'
    },style: (cell, row, rowIndex, colIndex) => {
      return {
        backgroundColor: 'white'
      };
    }
  },
  {
    dataField: 'delete',
    text: 'Delete',
    headerStyle: {
      backgroundColor: '#6495ED'
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
  {
    dataField: 'edit',
    text: 'Edit',
    headerStyle: {
      backgroundColor: '#6495ED'
    },
    style: (cell, row, rowIndex, colIndex) => {
      return {
        backgroundColor: 'white'
      };
    },
    events: {
      onClick: () => alert('Edit layer')
    }
  }, {
    dataField: 'color',
    text: 'Color',
    headerStyle: {
      backgroundColor: '#6495ED'
    },
    events: {
      onClick: () => alert('Select layer color')
    }
  }
  , {
    dataField: 'icon',
    text: 'Icon',
    filter: textFilter(),
    sort: true,
    headerStyle: {
      backgroundColor: '#6495ED'
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
        value: 'airport-11',label: 'airport-11'}, {value: 'airport-11',label: 'airport-11'}
      ]
    }
  }
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
      displayColorPicker: false,
      background: '#fff',
      color: {
        r: '241',
        g: '112',
        b: '19',
        a: '1',
      },
      colorPicker: false,
      selectedID:'',
      selectedLocation:'',
      selectedColor:'',
      selectedIcon:'',
      selectedFilename:''
    }
    this.loadFileList = this.loadFileList.bind(this);
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
  }

  loadFileList() {
    // Make a request for a user with a given ID
    rows = [];

      axios.get(SERVER_URL+':1337/fileuploads', {
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
            delete:"Delete",
            edit:"Edit"
          });
          total = total + fileList[i].filesize;
        }
        this.setState({ rowData:rows, totalsize: total, showModal: false });
      });
  }

  deleteRemoteData(id) {
    console.log("Row ID: ", id);

    var promise = new Promise(function (resolve, reject) {
      axios.delete(`http://54.245.202.137:1337/fileuploads/${id}`)
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
    var win = window.open('http://34.209.242.8:8080/#data=data:text/x-url,'+location+'&user=mapid', '_blank');
  }

  updateRemoteData(id, activevalue) {
    console.log("Row ID: ", id);
    console.log("Row Active Value: ", activevalue);
    this.setState({
      showModal: true
    });

    var promise = new Promise(function (resolve, reject) {
      axios.put(`http://54.245.202.137:1337/fileuploads/${id}`, /*{
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
      axios.put(`http://54.245.202.137:1337/fileuploads/${id}`, /*{
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
      axios.put(`http://54.245.202.137:1337/fileuploads/${id}`, /*{
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
      axios.put(`http://54.245.202.137:1337/fileuploads/${id}`, /*{
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
      axios.put(`http://54.245.202.137:1337/fileuploads/${id}`, /*{
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

  testGeojsonUpdate(id, location, color, icon, filename){
    this.setState({
      showModal: true
    });
    var promise = new Promise(function (resolve, reject) {
      axios.post('http://54.245.202.137' + ':7555/updatelayer', {
        location: location,
        color: color,
        icon: icon,
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
    this.setState({colorPicker: true,
      selectedID:id,
      selectedLocation:location,
      selectedColor:color,
      selectedIcon:icon,
      selectedFilename:filename});
  }

  afterOpenModal() {
    // references are now sync'd and can be accessed.
    this.subtitle.style.color = '#f00';
  }

  closeModal() {
    this.setState({colorPicker: false});
    this.testGeojsonUpdate(this.state.selectedID, this.state.selectedLocation, this.state.selectedColor, this.state.selectedIcon, this.state.selectedFilename);
  }

  cancelModal(){
    this.setState({colorPicker: false});
  }

  render() {

    const rowStyle2 = (row, rowIndex) => {
      const style = {};
      style.backgroundColor = rows[rowIndex].color;
    
      return style;
    };

    return (
      <div>
        <Loader show={this.state.showModal} message={spinner}>
        <Modal
          isOpen={this.state.colorPicker}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          style={customStyles}
          contentLabel="Example Modal"
        >

          <h3 ref={subtitle => this.subtitle = subtitle}>Select Layer Color</h3>
          <button onClick={this.closeModal}>Apply Color</button>
          <button onClick={this.cancelModal}>Cancel</button>
          <SwatchesPicker onChange={ this.handleChange } />
        </Modal>
          <Grid container>
            <ItemGrid xs={12} sm={12} md={12}>
              <RegularCard
                headerColor="blue"
                plainCard
                cardTitle="Current Active Layers"
                cardSubtitle={'Total Upload Size: ' + this.state.totalsize / 1000000 + ' MB'}
                content={
                  <BootstrapTable
                    keyField="id"
                    data={this.state.rowData}
                    columns={columns}
                    striped
                    hover
                    condensed
                    rowStyle={ rowStyle2 }
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
                          this.testGeojsonUpdate(row._id, row.location, row.color, newValue, row.filename, row._id)
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
        </Loader>
      </div>
    );
  }
}

<UploadList />;

export default UploadList;
