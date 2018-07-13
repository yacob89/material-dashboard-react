// React Class

import React, { Component } from "react";
import { RegularCard, Table, ItemGrid } from "components";
import { Grid } from "material-ui";
import axios from "axios";

import BootstrapTable from 'react-bootstrap-table-next';
import cellEditFactory, { Type } from 'react-bootstrap-table2-editor';

// Utils
import auth from 'utils/auth';
import { autobind } from 'core-decorators';
import request from 'utils/request';

//const SERVER_URL = 'http://54.245.202.137';
const SERVER_URL = 'http://192.168.1.6';

const columns = [{
    dataField: 'filename',
    text: 'File Name'
  }, {
    dataField: 'location',
    text: 'Location'
  }, {
    dataField: 'type',
    text: 'Geojson Type'
  }, {
    dataField: 'active',
    text: 'Active',
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
    text: 'ID'
  }
];

class UploadList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      column: [],
      rowData: []
    }

    this.updateRemoteData = this.updateRemoteData.bind(this);
    this.loadFileList = this.loadFileList.bind(this);
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

  @autobind
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

  updateRemoteData(id, activevalue){
    console.log("Row ID: ", id);
    console.log("Row Active Value: ", activevalue);

    //axios.put(`http://54.245.202.137:1337/fileuploads/${id}`, /*{
      axios.put(`http://192.168.1.6:1337/fileuploads/${id}`, /*{
        params: {
          _id:id
        }
      },*/ {
        active: activevalue
      })
      .then(function (response) {
        console.log("Respon Data: ",response.data);
        if (response.data.ok == 1) {
          alert('Success!');
        }
      })
      .catch(function (error) {
        console.log(error);
        alert(error);
      });

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
                cellEdit={ cellEditFactory({
                  mode: 'click',
                  blurToSave: true,
                  beforeSaveCell: (oldValue, newValue, row, column) => { console.log('Before Saving Cell!!'); },
                  afterSaveCell: (oldValue, newValue, row, column) => {
                     console.log('After Saving Cell!!', ' row ', row);
                     //this.updateRemoteData(row._id, newValue);

                     console.log("Row ID: ", row._id);
                     console.log("Row Active Value: ", newValue);

                     //axios.put(`http://54.245.202.137:1337/fileuploads/${id}`, /*{
                     axios.put(`http://192.168.1.6:1337/fileuploads/${row._id}`,
                         /*{
                                params: {
                                  _id:id
                                }
                              },*/
                         {
                           active: newValue
                         })
                       .then(function (response) {
                         console.log("Respon Data: ", response.data);
                         this.loadFileList();
                       })
                       .catch(function (error) {
                         console.log(error);
                         alert(error);
                       });
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
