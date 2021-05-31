(function (){
    'use strict';
 
    var cl = {};// Close Layers
    // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage#JavaScript_2
    // var image = new Image ();
    // image.src = "https://a.tile.openstreetmap.org/0/0/0.png";
    // image.onload = drawImageActualSize; // Draw when image has loaded
    // function drawImageActualSize() {
    //     var canvas = document.getElementById('map');
    //     canvas.width = this.naturalWidth;
    //     canvas.height = this.naturalHeight;
    //     var ctx = canvas.getContext('2d');
    //     ctx.drawImage(this, 0, 0);
    //     ctx.drawImage(this, 0, 0, this.width, this.height);
    // }
    console.log("hello");
    function Map(config){
        // if not constructor
        if(!(this instanceof Map)){
            return new Map(config);
        }
        window.addEventListener('load',function(){
            var canvas = document.getElementById('mymap');
            // console.log("canvas:",canvas);
            // console.dir(canvas);
            var context = canvas.getContext('2d');
            var zoomLevel = 16  ;
            
            const extent = getViewExtentGlobalXY(zoomLevel,37.552940941510194, 127.0140353468922,800,600);
            setTileImagesOnMap(zoomLevel,extent,context);
    
    
            // canvas.setAttribute('draggable',"true")
            // canvas.addEventListener('drag',function dragHandler(event){ 
            //     console.log(event)
    
            // });
            var dragHandler = (function buildMouseHandler(){
                var baseCenter;
                return function dragHandler(event){ 
                    
                    console.log(event,event.button,event.buttons);
        
                    if(event.type && event.buttons === 1){
                        if(event.type === 'mousedown' ){    
                            // baseCenter = curLocation;
                            
                        }else if(event.type === 'mousemove' ){
                            // relative location from center
                            // Move Center
                            // Render again 
                        }else if(event.type === 'mouseup' ){
                            // baseCenter = undefined;
                        }
                        console.log("clicked", event.buttons,event.button);
        
                    }
                };
            })();
            ['mousedown','mousemove','mouseup'].forEach(item => {
                canvas.addEventListener(item,dragHandler);
            });        
        });
    }
    function putImageTile(canvasContext,x,y,width,height,url){
        var tileImage = new Image();
        tileImage.src = url;
        console.log("tileImage:",tileImage);
        tileImage.onload = function(){
            console.log("image onload:",url);
            canvasContext.drawImage(tileImage,x,y,width,height);
        };
    }

    
    
    

    function TileLoader(){
        
    }
    /** 
     * 해당하는 타일 이미지의 URL을 생성함
     * 
     */
    // TileLoader.prototype.getOSMTileImageUrl = 
    function getOSMTileImageUrl(zoomLevel, xIdx, yIdx){
        if( !zoomLevel || !xIdx || !yIdx)
            throw new Error();
        return `https://a.tile.openstreetmap.org/${zoomLevel}/${xIdx}/${yIdx}.png`;
    }



    function MapView(){

    }
    // MapView.prototype.setTileImagesOnMap() = 
    function setTileImagesOnMap(zoomLevel, viewExtent, mapCanvasContext){
        const startTileIdxOfX = Math.floor(viewExtent[0] / 256);
        const startTileIdxOfY = Math.floor(viewExtent[1] / 256);
        const numOfXTiles = Math.ceil(viewExtent[2] / 256) - startTileIdxOfX;
        const numOfYTiles = Math.ceil(viewExtent[3] / 256) - startTileIdxOfY; 
        console.log(startTileIdxOfY,startTileIdxOfX,numOfXTiles,numOfYTiles);
        for(let yIdx = 0 ; yIdx < numOfYTiles ; yIdx++){
            for(let xIdx = 0 ; xIdx < numOfXTiles ; xIdx++){
                console.log("image url:",getOSMTileImageUrl(zoomLevel,startTileIdxOfX + xIdx,startTileIdxOfY + yIdx));

                putImageTile(mapCanvasContext,(startTileIdxOfX + xIdx)*256 - viewExtent[0],
                    (startTileIdxOfY + yIdx) * 256 - viewExtent[1] , 
                    256,
                    256, 
                    getOSMTileImageUrl(zoomLevel,startTileIdxOfX + xIdx,startTileIdxOfY + yIdx));
            }
        }
        
    }

    
    // MapView.prototype.getViewExtentGlobalXY() =
        function getViewExtentGlobalXY(zoomLevel, centerLat, centerLon, width, height){
        // 구조분해할당(Destructuring assignment) 참조 :
        // ko : https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment
        // en : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment
        const { x:centerX,y:centerY} = transformLatLonToXYWithWebMercator(zoomLevel,centerLat,centerLon);
        
        const startY = Math.floor(centerY - height / 2);
        const startX = Math.floor(centerX - width / 2);
        return [startX, startY, startX + width, startY + height]
    }

    // MapView.prototype.setZoomLevel() = 
    function setZoomLevel(newZoomLevel){
        this._ZoomLevel = newZoomLevel;
        this.viewRefresh();
    }


    /**
     * 
     */
    function Projection(){
        
    }


    /**
     * Web Mercator의 투영방식으로 x,y좌표로 위경도 좌표를 변환함
     */
    // Projection.prototype.transformXYToLatLonWithWebMercator =  
        function transformXYToLatLonWithWebMercator(zoomLevel, x, y){
        const λ = x / 256 * (2*Math.PI) / Math.pow(2,zoomLevel) - Math.PI;
        const φ = 2 *  Math.atan( Math.pow ( Math.E,  Math.PI - y / 256 * (2 * Math.PI) / Math.pow(2,zoomLevel) ) ) - Math.PI/2;
        const lat = φ * 180 / Math.PI;
        const lon = λ * 180 / Math.PI; 
        return {lat,lon} 
    };
            
    /**
     * Web Mercator의 투영방식으로 위경도 좌표를 x,y좌표로 변환함
     */
    // Projection.prototype.transformLatLonToXYWithWebMercator =  
        function transformLatLonToXYWithWebMercator(zoomLevel, Lat, Lon ){
        var λ = Lon /180 * Math.PI;
        var φ = Lat /180 * Math.PI;
        var x = Math.floor(256 / ( 2 * Math.PI ) * Math.pow(2,zoomLevel) * ( λ + Math.PI));
        var y = Math.floor(256 / ( 2 * Math.PI ) * Math.pow(2,zoomLevel) * ( Math.PI - Math.log(Math.tan(Math.PI/4 + φ/2))));
        return {x,y};
    };




    /* */
    const DEFAULT_ZOOM_LEVEL = 12;
    
    function View(config){
        if(! (this instanceof View)){
            return new View(config);
        }
        this. _zoomLevel = config.zoomLevel || DEFAULT_ZOOM_LEVEL;
    }
    View.prototype.getZoom= function getZoom(){
        return this._zoomLevel;
    };

    View.prototype.setZoom = function setZoom(zoomLevel){


        if(zoomLevel && !Number.isNaN(zoomLevel)){
            let newZoomLevel = zoomLevel;
            newZoomLevel = Math.max(newZoomLevel, this._maxZoomLevel);
            newZoomLevel = Math.min(newZoomLevel, this._minZoomLevel);
            this._zoomLevel = newZoomLevel;
        }
        // 화면 갱신 필요
    }

    View.prototype.setCenter = function setCenter(){

    }
    
})();