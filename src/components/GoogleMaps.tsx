import React from "react";
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps";

type Props = {
    lat?: number,
    lng?: number,
    passLocation?: any
};
type State = {
    marker: boolean
    lat: number
    lng: number
};

class GoogleMaps extends React.PureComponent<Props, State> {

    constructor(props) {
        super(props);
        if(this.props.lat && this.props.lng) {
            this.state = {
                marker: true,
                lat: this.props.lat,
                lng: this.props.lng
            }
        } else {
            this.state = {
                marker: false,
                lat: 0,
                lng: 0
            }
        }
    }
    handlePlace = (location) => {
        const lat: number = location.latLng.lat();
        const lng: number = location.latLng.lng();
        this.setState({
            lat: lat,
            lng: lng,
            marker: true
        })
        this.props.passLocation(lat, lng);
    }

    MyMapComponent = withScriptjs(withGoogleMap((props) =>
        <GoogleMap
            defaultZoom={9}
            defaultCenter={{ lat: 51.858979, lng: 4.476303 }}
            clickableIcons={true}
            onClick={this.handlePlace}
        >
            {this.state.marker && <Marker position={{ lat: this.state.lat, lng: this.state.lng }}/>}
        </GoogleMap>
    ));

    public render() {
        return (
            <>
                <this.MyMapComponent
                    googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyAcIOnzpfPt-ci1SCyRpi_36oIE4eIj9CU"
                    loadingElement={<div style={{ height: `100%` }} />}
                    containerElement={<div style={{ height: `700px` }} />}
                    mapElement={<div style={{ height: `100%` }} />}
                />
            </>
        );
    }
}

export default GoogleMaps;