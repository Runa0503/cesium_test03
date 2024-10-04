// Cesium ionのアクセストークン
Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI5N2UyMjcwOS00MDY1LTQxYjEtYjZjMy00YTU0ZTg5MmViYWQiLCJpZCI6ODAzMDYsImlhdCI6MTY0Mjc0ODI2MX0.dkwAL1CcljUV7NA7fDbhXXnmyZQU_c-G5zRx8PtEcxE';

// Cesium ViewerをcesiumContainerというIDのHTML要素に初期化
// Terrainの指定（EGM96、国土数値情報5m標高から生成した全国の地形モデル、5m標高データが無い場所は10m標高で補完している）
var viewer = new Cesium.Viewer('cesiumContainer', {
    terrainProvider: new Cesium.CesiumTerrainProvider({
        url: Cesium.IonResource.fromAssetId(770371),
    }),
});

// PLATEAU-Orthoの参照
var imageProvider = new Cesium.UrlTemplateImageryProvider({
    url: 'https://gic-plateau.s3.ap-northeast-1.amazonaws.com/2020/ortho/tiles/{z}/{x}/{y}.png',
    maximumLevel: 19,
});
var current_image = viewer.scene.imageryLayers.addImageryProvider(imageProvider);

// 神奈川県横浜市の建物データ（3D Tiles）
var your_3d_tiles = viewer.scene.primitives.add(
    new Cesium.Cesium3DTileset({
        url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/14100_yokohama/low_resolution/tileset.json',
    })
);
// 初期表示時のカメラ位置
viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(139.63148565, 35.4545858, 10000.0),
});

// エンティティの追加
viewer.entities.add({
    name: "横浜駅",
    description: "〒220-0011 神奈川県横浜市西区高島２丁目",
    position: Cesium.Cartesian3.fromDegrees(139.6221073371378,35.4661238909113, 0),
    point: {
        pixelSize: 20,
        color: Cesium.Color.RED,
        eyeOffset: new Cesium.Cartesian3(0.0, 0.0, -5.0),
        distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 1000000.0),
        disableDepthTestDistance: 1000000.0,
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
    }
});

viewer.entities.add({
    name: "桜木町駅",
    description: "〒231-0062 神奈川県横浜市中区桜木町１丁目",
    position: Cesium.Cartesian3.fromDegrees(139.6310454043321,35.45100047566533,0),
    point: {
        pixelSize: 20,
        color: Cesium.Color.RED,
        eyeOffset: new Cesium.Cartesian3(0.0, 0.0, -5.0),
        distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 1000000.0),
        disableDepthTestDistance: 1000000.0,
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
    }
});

viewer.entities.add({
    name: "横浜検索の中心１",
    description: "",
    position: Cesium.Cartesian3.fromDegrees(139.474,35.373,0),
    point: {
        pixelSize: 20,
        color: Cesium.Color.RED,
        eyeOffset: new Cesium.Cartesian3(0.0, 0.0, -5.0),
        distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 1000000.0),
        disableDepthTestDistance: 1000000.0,
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
    }
});

viewer.entities.add({
    name: "横浜検索の中心２",
    description: "",
    position: Cesium.Cartesian3.fromDegrees(139.568,35.424,0),
    point: {
        pixelSize: 20,
        color: Cesium.Color.RED,
        eyeOffset: new Cesium.Cartesian3(0.0, 0.0, -5.0),
        distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 1000000.0),
        disableDepthTestDistance: 1000000.0,
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
    }
});

// JSONファイルを読み込み
fetch('kanagawa_and_nishi_restaurants.json')
    .then(response => response.json())
    .then(data => {
        data.forEach(item => {
            const reviewsHtml = item.reviews.map(review => `
                <tr>
                    <td><strong>${review.author_name}</strong></td>
                    <td>${review.rating} stars</td>
                    <td>${review.text}</td>
                    <td>${review.relative_time_description}</td>
                </tr>
            `).join('');

            const openingHoursHtml = item.opening_hours.map(hour => `
                <tr>
                    <td>${hour}</td>
                </tr>
            `).join('');

            const description = `
                <table>
                    <tr>
                        <th>Name</th>
                        <td>${item.name}</td>
                    </tr>
                    <tr>
                        <th>Location</th>
                        <td>${item.geometry.location.lat}, ${item.geometry.location.lng}</td>
                    </tr>
                    <tr>
                        <th>Types</th>
                        <td>${item.types.join(', ')}</td>
                    </tr>
                    <tr>
                        <th>Address</th>
                        <td>${item.formatted_address}</td>
                    </tr>
                    <tr>
                        <th>Phone Number</th>
                        <td>${item.formatted_phone_number}</td>
                    </tr>
                    <tr>
                        <th>Website</th>
                        <td><a href="${item.website}" target="_blank">${item.website}</a></td>
                    </tr>
                    <tr>
                        <th>Price Level</th>
                        <td>${item.price_level}</td>
                    </tr>
                    <tr>
                        <th>Rating</th>
                        <td>${item.rating}</td>
                    </tr>
                    <tr>
                        <th>User Ratings Total</th>
                        <td>${item.user_ratings_total}</td>
                    </tr>
                    <tr>
                        <th>Opening Hours</th>
                        <td>
                            <table>${openingHoursHtml}</table>
                        </td>
                    </tr>
                    <tr>
                        <th>Reviews</th>
                        <td>
                            <table>${reviewsHtml}</table>
                        </td>
                    </tr>
                </table>
            `;

            viewer.entities.add({
                name: item.name,
                description: description,
                position: Cesium.Cartesian3.fromDegrees(item.geometry.location.lng, item.geometry.location.lat, 0),
                point: {
                    pixelSize: 20,
                    color: Cesium.Color.BLUE,
                    eyeOffset: new Cesium.Cartesian3(0.0, 0.0, -5.0),
                    distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 1000000.0),
                    disableDepthTestDistance: 1000000.0,
                    heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
                }
            });
        });
    })
    .catch(error => {
        console.error('JSONファイルの読み込みエラー:', error);
    });

// 3D Tilesデータが読み込まれた後の処理
Promise.all(tilesets.map(tileset => tileset.readyPromise)).then(function() {
    viewer.zoomTo(tilesets);

    // マウスクリックイベントの設定
    var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    handler.setInputAction(function(movement) {
        var pickedObject = viewer.scene.pick(movement.position);
        if (Cesium.defined(pickedObject) && pickedObject.id) {
            viewer.selectedEntity = pickedObject.id;
        }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
}).otherwise(function(error) {
    console.error(error);
});
