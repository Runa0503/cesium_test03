// Cesium ionのアクセストークン
Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI5N2UyMjcwOS00MDY1LTQxYjEtYjZjMy00YTU0ZTg5MmViYWQiLCJpZCI6ODAzMDYsImlhdCI6MTY0Mjc0ODI2MX0.dkwAL1CcljUV7NA7fDbhXXnmyZQU_c-G5zRx8PtEcxE';

// Cesium Viewerの初期化
var viewer = new Cesium.Viewer('cesiumContainer', {
    terrainProvider: new Cesium.CesiumTerrainProvider({
        url: Cesium.IonResource.fromAssetId(770371),
    }),
    infoBox: true // インフォボックスを有効にする
});

// PLATEAU-Orthoの参照
/*
var imageProvider = new Cesium.UrlTemplateImageryProvider({
    url: 'https://gic-plateau.s3.ap-northeast-1.amazonaws.com/2020/ortho/tiles/{z}/{x}/{y}.png',
    maximumLevel: 19,
});
viewer.scene.imageryLayers.addImageryProvider(imageProvider);
*/

// 各区の3D Tilesデータの追加
var tilesetUrls = [
    'https://assets.cms.plateau.reearth.io/assets/71/e76732-4a56-4654-b0f4-c00b8d502f7a/14100_yokohama-shi_city_2023_citygml_1_op_bldg_3dtiles_14103_nishi-ku_lod1/tileset.json',
    'https://assets.cms.plateau.reearth.io/assets/8f/4d287c-71b4-4044-aec2-0164e407a845/14100_yokohama-shi_city_2023_citygml_1_op_bldg_3dtiles_14104_minami-ku_lod1/tileset.json'
    // 他の区のURLをここに追加
];

var tilesets = [];

tilesetUrls.forEach(function(url) {
    var tileset = new Cesium.Cesium3DTileset({ url: url });
    viewer.scene.primitives.add(tileset);
    tilesets.push(tileset);
});

// 初期表示時のカメラ位置
viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(139.63148565, 35.4545858, 10000.0),
});

// エンティティの追加
viewer.entities.add({
    name: "町田駅",
    description: "東京都町田市原町田６丁目１２−２０",
    position: Cesium.Cartesian3.fromDegrees(139.44536536590812,35.541994072641195, 0),
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
    name: "町田検索の中心",
    description: "日本、〒221-0825 神奈川県横浜市神奈川区反町１丁目５−１２ シティコープ反町",
    position: Cesium.Cartesian3.fromDegrees(139.446,35.541,0),
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
fetch('machida_restaurant_2km_1000_867.json')
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
