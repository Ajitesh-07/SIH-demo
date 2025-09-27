import { MapCameraChangedEvent } from "@vis.gl/react-google-maps";
import { Map } from "@vis.gl/react-google-maps";

export default function BodyPage() {
    return (
        <div>
            <Map
            defaultZoom={13}
            defaultCenter={{ lat: -33.860664, lng: 151.208138 }}
            onCameraChanged={ (ev: MapCameraChangedEvent) =>
        console.log('camera changed:', ev.detail.center, 'zoom:', ev.detail.zoom)
            }>
                
            </Map>
        </div>
    )
}