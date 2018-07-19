import React from 'react'
import ReactDOM from 'react-dom'
import mapboxgl from 'mapbox-gl'
import { RegularCard, Table, ItemGrid } from "components";
import { Grid } from "material-ui";
import auth from 'utils/auth';
import Iframe from 'react-iframe'

class Maps extends React.Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {

  }

  render() {

    return (
      <Grid container>
        <ItemGrid xs={12} sm={12} md={12}>
          <Iframe url="http://geomapid.co.id"
            width="100%"
            height="768px"
            id="myId"
            className="myClassname"
            display="initial"
            position="relative"
            allowFullScreen />
        </ItemGrid>
      </Grid>
    );
  }
}

ReactDOM.render(<Maps />, document.getElementById('root'));

<Maps />

export default Maps;
