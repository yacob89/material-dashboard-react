// React Class

import React, { Component } from "react";
import { RegularCard, Table, ItemGrid } from "components";
import { Grid } from "material-ui";
import axios from "axios";
import auth from 'utils/auth';

const JsonTable = require("ts-react-json-table");
var userColumns = ["username", "created_at", "updated_at"];
var userExcludeColumns = ["encrypted_password"];
var layerColumns = ["username", "filename", "created_at", "updated_at"];

class TableList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: [1],
      persons: []
    };
  }

  componentDidMount() {
    console.log("User info: ", auth.getUserInfo().username);
    this.forceUpdate();
  }

  isSelected = index => {
    return this.state.selected.indexOf(index) !== -1;
  };

  handleRowSelection = selectedRows => {
    this.setState({
      selected: selectedRows
    });
  };

  render() {
    return (
      <Grid container>
        <ItemGrid xs={12} sm={12} md={12}>
        <div>
        <title>AWS S3 Explorer</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="shortcut icon" href="https://aws.amazon.com/favicon.ico" />
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" />
        <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.0.9/css/all.css" />
        <link rel="stylesheet" href="https://cdn.datatables.net/plug-ins/f2c75b7247b/integration/bootstrap/3/dataTables.bootstrap.css" />
        <style type="text/css" dangerouslySetInnerHTML={{__html: "\n        #wrapper {\n            padding-left: 0;\n        }\n        \n        #page-wrapper {\n            width: 100%;\n            padding: 5px 15px;\n        }\n        \n        #tb-s3objects {\n            width: 100% !Important;\n        }\n        \n        a {\n            color: #00B7FF;\n        }\n        \n        body {\n            font: 14px \"Lucida Grande\", Helvetica, Arial, sans-serif;\n        }\n        \n        td {\n            font: 12px \"Lucida Grande\", Helvetica, Arial, sans-serif;\n        }\n    " }} />
        {/* DEBUG: Enable this for red outline on all elements */}
        {/* <style media="screen" type="text/css"> * { outline: 1px red solid; } </style> */}
        <div id="page-wrapper">
          <div className="row">
            <div className="col-lg-12">
              <div className="panel panel-primary">
                {/* Panel including bucket/folder information and controls */}
                <div className="panel-heading clearfix">
                  {/* Bucket selection and breadcrumbs */}
                  <div className="btn-group pull-left">
                    <div className="pull-left">
                      AWS S3 Explorer&nbsp;
                    </div>
                    {/* Bucket selection */}
                    <div className="btn pull-left" id="bucket">
                      <i id="bucket-chooser" style={{cursor: 'pointer'}} className="fas fa-cog fa-2x" title="Switch to a different S3 Bucket" />
                    </div>
                    {/* Bucket breadcrumbs */}
                    <div className="btn pull-right">
                      <ul id="breadcrumb" className="btn breadcrumb pull-right">
                        <li className="active dropdown">
                          <a href="#">&lt;bucket&gt;</a>
                        </li>
                      </ul>
                    </div>
                  </div>
                  {/* Folder/Bucket radio group and progress spinner */}
                  <div className="btn-group pull-right">
                    <div className="checkbox pull-left">
                      <label>
                        <input type="checkbox" id="hidefolders" />&nbsp;Hide folders?
                      </label>
                      {/* Folder/Bucket radio group */}
                      <div className="btn-group" data-toggle="buttons">
                        <label className="btn btn-primary active" title="View all objects in folder">
                          <i className="fa fa-angle-double-up" />
                          <input type="radio" name="optionsdepth" defaultValue="folder" id="optionfolder" defaultChecked />&nbsp;Folder
                        </label>
                        <label className="btn btn-primary" title="View all objects in bucket">
                          <i className="fa fa-angle-double-down" />
                          <input type="radio" name="optionsdepth" defaultValue="bucket" id="optionbucket" />&nbsp;Bucket
                        </label>
                      </div>
                    </div>
                    {/* Dual purpose: progress spinner and refresh button */}
                    <div className="btn-group pull-right" id="refresh">
                      <span id="bucket-loader" style={{cursor: 'pointer'}} className="btn fa fa-refresh fa-2x pull-left" title="Refresh" />
                      <span id="badgecount" className="badge pull-right">42</span>
                    </div>
                  </div>
                </div>
                {/* Panel including S3 object table */}
                <div className="panel-body">
                  <table className="table table-bordered table-hover table-striped" id="tb-s3objects">
                    <thead>
                      <tr>
                        <th>Object</th>
                        <th>Folder</th>
                        <th>Last Modified</th>
                        <th>Timestamp</th>
                        <th>Size</th>
                      </tr>
                    </thead>
                    <tbody id="tbody-s3objects" />
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
        </ItemGrid>
      </Grid>
    );
  }
}

<TableList />;

export default TableList;
