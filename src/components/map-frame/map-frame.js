import {Loader} from 'google-maps';
//
export default class MapFrame{
    static CLASSES = {
        container: 'map-frame__container',
        map: 'map-frame__map',
        control: 'map-frame__control',
        toggleOffice: 'toggle-office',
        toggleStock: 'toggle-stock'
    }
    container = null;
    map = null;
    loader = null;
    mapElement = null;
    key = process.env.GOOGLE_KEY;
    officeMarker = {
        marker: null,
        status: false
    };
    stockMarker = {
        marker: null,
        status: false
    };
    constructor(root) {
        this.init(root)
    }
    init(root){
        this.renderContainer(root);
        this.container = root.querySelector(`.${MapFrame.CLASSES.container}`);
        this.renderControl();
        this.renderMap();
        this.mapElement = this.container.querySelector(`.${MapFrame.CLASSES.map}`);
        this.setLoader();
        this.initMap();
        this.setMarkers();
        this.addEventListeners();
    }
    addEventListeners(){
        this.container
            .querySelector(`.${MapFrame.CLASSES.toggleOffice}`)
            .addEventListener('click',() => this.toggleMarkerStatus(this.officeMarker));
        this.container
            .querySelector(`.${MapFrame.CLASSES.toggleStock}`)
            .addEventListener('click',() => this.toggleMarkerStatus(this.stockMarker))
    }
    toggleMarkerStatus = (marker) =>{
        marker.status ? marker.marker.setMap(null) : marker.marker.setMap(this.map);
        marker.status = !marker.status
        this.renderMarkersStatus();
    }
    createContainerElement(){
        return `
            <div class="${MapFrame.CLASSES.container}"></div>
        `
    }
    createMapElement(){
        return `
            <div class="${MapFrame.CLASSES.map}"></div>
        `
    }
    createControlElement(){
        return `
            <div class="${MapFrame.CLASSES.control}">
                <button class="${MapFrame.CLASSES.toggleOffice}"></button>
                <button class="${MapFrame.CLASSES.toggleStock}"></button>
            </div>
        `
    }
    renderMarkersStatus(){
        const officeControl = this.container.querySelector(`.${MapFrame.CLASSES.toggleOffice}`);
        const stockControl = this.container.querySelector(`.${MapFrame.CLASSES.toggleStock}`);
        this.officeMarker.status ? officeControl.textContent = 'Hide office' : officeControl.textContent = 'Show office';
        this.stockMarker.status ? stockControl.textContent = 'Hide stock' : stockControl.textContent = 'Show stock';
    }
    renderControl(){
        this.container.innerHTML += this.createControlElement()
    }
    renderContainer(root){
        root.innerHTML = this.createContainerElement();
    }
    renderMap(){
        this.container.innerHTML += this.createMapElement();
    }
    setLoader(){
        this.loader = new Loader(this.key,{});
    }
    initMap(){
        this.loader.load().then(google => {
            this.map = new google.maps.Map(this.mapElement,{
                center: {
                    lat: -34.397,
                    lng: 150.644
                },
                zoom: 8,
            })
        })
    }
    setMarkers(){
        this.loader.load().then(google => {
            this.officeMarker.marker = new google.maps.Marker({
                position: {
                    lat: -34.728,
                    lng: 149.861
                },
                map: this.map,
            })
            this.officeMarker.status = true;
            this.stockMarker.marker = new google.maps.Marker({
                position: {
                    lat: -33.728,
                    lng: 148.861
                },
                map: this.map,
            })
            this.stockMarker.status = true;
            this.renderMarkersStatus();
        })
    }
}