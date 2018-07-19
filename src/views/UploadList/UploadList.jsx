// React Class

import React, { Component } from "react";
import { RegularCard, Table, ItemGrid } from "components";
import { Grid } from "material-ui";
import axios from "axios";

import BootstrapTable from 'react-bootstrap-table-next';
import cellEditFactory, { Type } from 'react-bootstrap-table2-editor';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';

// Utils
import auth from 'utils/auth';
import request from 'utils/request';

//const SERVER_URL = 'http://54.245.202.137';
const SERVER_URL = 'http://192.168.1.12';

const columns = [{
    dataField: 'filename',
    text: 'File Name',
    filter: textFilter(),
    sort: true,
    headerStyle: {
      backgroundColor: '#6495ED'
    }
  }, {
    dataField: 'location',
    text: 'Location',
    sort: true,
    headerStyle: {
      backgroundColor: '#6495ED'
    },
    hidden: true
  }, {
    dataField: 'type',
    text: 'Geojson Type',
    filter: textFilter(),
    sort: true,
    headerStyle: {
      backgroundColor: '#6495ED'
    }
  }, {
    dataField: 'active',
    text: 'Active',
    filter: textFilter(),
    sort: true,
    headerStyle: {
      backgroundColor: '#6495ED'
    },
    style: (cell, row, rowIndex, colIndex) => {
      if (row.active === 'true') {
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
        value: 'true',
        label: 'true'
      }, {
        value: 'false',
        label: 'false'
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
  }
];

class UploadList extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      column: [],
      rowData: [],
      rowID: 0,
      newValue: ''
    }
    this.loadFileList = this.loadFileList.bind(this);
    this.updateRemoteData = this.updateRemoteData.bind(this);
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
    let rows = [];

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
        for (i = 0; i < fileList.length; i++) {
          var modifiedDate = new Date(fileList[i].created_at);
          rows.push({
            filename:fileList[i].filename,
            location: fileList[i].server_url,
            type:fileList[i].type,
            active: fileList[i].active,
            _id: fileList[i]._id
          });
        }
        this.setState({ rowData:rows });
      });
  }

  updateRemoteData(id, activevalue) {
    console.log("Row ID: ", id);
    console.log("Row Active Value: ", activevalue);

    var promise = new Promise(function (resolve, reject) {
      //axios.put(`http://54.245.202.137:1337/fileuploads/${id}`, /*{
      axios.put(`http://192.168.1.12:1337/fileuploads/${id}`,
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
            resolve(true);
          }
        })
        .catch(function (error) {
          console.log(error);
          alert(error);
        });
      // call resolve if the method succeeds
      
    })
    promise.then(bool => this.loadFileList())
  }

  render() {
    return (
      <Grid container>
        <ItemGrid xs={12} sm={12} md={12}>
          <RegularCard
            plainCard
            cardTitle="Layers"
            cardSubtitle="Uploaded by user"
            content={
              <BootstrapTable
                keyField="id"
                data={ this.state.rowData }
                columns={ columns }
                striped
                hover
                condensed
                noDataIndication="No Layer is Uploaded"
                filter={ filterFactory() }
                cellEdit={ cellEditFactory({
                  mode: 'click',
                  blurToSave: true,
                  beforeSaveCell: (oldValue, newValue, row, column) => { console.log('Before Saving Cell!!'); },
                  afterSaveCell: (oldValue, newValue, row, column) => {
                     console.log('After Saving Cell!!', ' row ', row._id);
                     this.setState({
                      rowID: row._id,
                      newValue: newValue
                    });
                     this.updateRemoteData(row._id, newValue);
                    }
                }) }
              />
            }
          />
        </ItemGrid>
      </Grid>
    );
  }
}

<UploadList />;

export default UploadList;
