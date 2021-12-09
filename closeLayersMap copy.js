/**
    // 구조분해할당(Destructuring assignment) 참조 :
    // ko : https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment
    // en : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment
 */
const cl = (function initCloseLayers() {
  'use strict';
  const cl = {};
 
  function Projectable(){


  }
  Projectable.prototype.convertCoordinatesToXY = function (zoomLevel, Lat, Lon){
      
  }

  cl.WebMercator = Object.create(Projectable);

   /**
   * @
   * @description Web Mercator의 투영방식으로 위경도 좌표를 x,y좌표로 변환함
   * @param {Number} zoomLevel zoom
   */
  WebMercator.prototype.convertCoordinatesToXY = function (zoomLevel, Lat, Lon) {
    const λ = Lon / 180 * Math.PI;
    const φ = Lat / 180 * Math.PI;
    const x = Math.floor(256 / (2 * Math.PI) * Math.pow(2, zoomLevel) * (λ + Math.PI));
    const y = Math.floor(256 / (2 * Math.PI) * Math.pow(2, zoomLevel) * (Math.PI - Math.log(Math.tan(Math.PI / 4 + φ / 2))));
    return { x, y };
  };


  function Map(config) {
    // if not constructor
    if (!(this instanceof Map)) {
      return new Map(config);
    }
    if(!config.element ){
      return;
    }
    const element = (config.element instanceof HTMLElement) ? element : document.getElementById(config.element); 
    const canvas = document.createElement('canvas');
    window.addEventListener('load', () => {
      // const canvas = document.getElementById('mymap');
      
      
      // console.log("canvas:",canvas);
      // console.dir(canvas);
      const context = canvas.getContext('2d');
      const zoomLevel = 16;
      const extent = getViewExtentGlobalXY(zoomLevel, 37.552940941510194, 127.0140353468922, 800, 600);
      setTileImagesOnMap(zoomLevel, extent, context);


      // canvas.setAttribute('draggable',"true")
      // canvas.addEventListener('drag',function dragHandler(event){ 
      //   console.log(event)
      // });
      const dragHandler = (function buildMouseHandler() {
        let baseCenter;
        return function dragHandler(event) {

          console.log(event, event.button, event.buttons);

          if (event.type && event.buttons === 1) {
            if (event.type === 'mousedown') {
              // baseCenter = curLocation;
            } else if (event.type === 'mousemove') {
              // relative location from center
              // Move Center
              // Render again 
            } else if (event.type === 'mouseup') {
              // baseCenter = undefined;
            }
            console.log("clicked", event.buttons, event.button);

          }
        };
      })();
      ['mousedown', 'mousemove', 'mouseup'].forEach(item => {
        canvas.addEventListener(item, dragHandler);
      });
    });
  }
  Map.prototype.getView = function(){

  }

  Map.prototype.getLayerTree = function(){

  }
  // Map.prototype.


  function putImageTile(canvasContext, x, y, width, height, url) {
    const tileImage = new Image();
    tileImage.src = url;
    console.log('tileImage:', tileImage);
    tileImage.onload = function () {
      console.log('image onload:', url);
      canvasContext.drawImage(tileImage, x, y, width, height);
    };
  }

  function Renderable(){

  }

  function Layerable(){
    
  }

  function TileLoader() {
  }
  /**
   * 해당하는 타일 이미지의 URL을 생성함
   *
   */
  // TileLoader.prototype.getOSMTileImageUrl = 
  function getOSMTileImageUrl(zoomLevel, xIdx, yIdx) {
    if (!zoomLevel || !xIdx || !yIdx)
      throw new Error();
    return `https://a.tile.openstreetmap.org/${zoomLevel}/${xIdx}/${yIdx}.png`;
  }


  
  function MapView() {
    // 센터를 불러옴
    // 센터를 set함
    // View의 크기를 보여줌
    // 
  }
  
  MapView.prototype.getViewExtentGlobalXY = function (zoomLevel, centerLat, centerLon, width, height) {
    const { x: centerX, y: centerY } = transformLatLonToXYWithWebMercator(zoomLevel, centerLat, centerLon);
    const startY = Math.floor(centerY - height / 2);
    const startX = Math.floor(centerX - width / 2);
    return [startX, startY, startX + width, startY + height];
  };

  // MapView.prototype.setTileImagesOnMap() = 
  function setTileImagesOnMap(zoomLevel, viewExtent, mapCanvasContext) {
    const startTileIdxOfX = Math.floor(viewExtent[0] / 256);
    const startTileIdxOfY = Math.floor(viewExtent[1] / 256);
    const numOfXTiles = Math.ceil(viewExtent[2] / 256) - startTileIdxOfX;
    const numOfYTiles = Math.ceil(viewExtent[3] / 256) - startTileIdxOfY;
    console.log(startTileIdxOfY, startTileIdxOfX, numOfXTiles, numOfYTiles);
    for (let yIdx = 0; yIdx < numOfYTiles; yIdx++) {
      for (let xIdx = 0; xIdx < numOfXTiles; xIdx++) {
        console.log("image url:", getOSMTileImageUrl(zoomLevel, startTileIdxOfX + xIdx, startTileIdxOfY + yIdx));

        putImageTile(mapCanvasContext, (startTileIdxOfX + xIdx) * 256 - viewExtent[0],
          (startTileIdxOfY + yIdx) * 256 - viewExtent[1],
          256,
          256,
          getOSMTileImageUrl(zoomLevel, startTileIdxOfX + xIdx, startTileIdxOfY + yIdx));
      }
    }

  }


  // MapView.prototype.setZoomLevel() = 
  function setZoomLevel(newZoomLevel) {
    this._ZoomLevel = newZoomLevel;
    this.viewRefresh();
  }


  /**
   *
   */
  function Projection() {
  }


  /**
   * Web Mercator의 투영방식으로 x,y좌표로 위경도 좌표를 변환함
   */
  // Projection.prototype.transformXYToLatLonWithWebMercator =  
  function transformXYToLatLonWithWebMercator(zoomLevel, x, y) {
    const λ = x / 256 * (2 * Math.PI) / Math.pow(2, zoomLevel) - Math.PI;
    const φ = 2 * Math.atan(Math.pow(Math.E, Math.PI - y / 256 * (2 * Math.PI) / Math.pow(2, zoomLevel))) - Math.PI / 2;
    const lat = φ * 180 / Math.PI;
    const lon = λ * 180 / Math.PI;
    return { lat, lon };
  };





  /* */
  const DEFAULT_ZOOM_LEVEL = 12;

  function View(config) {
    if (!(this instanceof View)) {
      return new View(config);
    }
    this._zoomLevel = config.zoomLevel || DEFAULT_ZOOM_LEVEL;
  }
  View.prototype.getZoom = function getZoom() {
    return this._zoomLevel;
  };

  View.prototype.setZoom = function setZoom(zoomLevel) {


    if (zoomLevel && !Number.isNaN(zoomLevel)) {
      let newZoomLevel = zoomLevel;
      newZoomLevel = Math.max(newZoomLevel, this._maxZoomLevel);
      newZoomLevel = Math.min(newZoomLevel, this._minZoomLevel);
      this._zoomLevel = newZoomLevel;
    }
    // 화면 갱신 필요
  };

  View.prototype.setCenter = function setCenter() {
  };
  cl.Map = Map;
  cl.View = View;
  return cl;
}());

export default cl;
