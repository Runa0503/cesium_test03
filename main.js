// Cesium ionのアクセストークン（公式に記載があったものを使用しています）
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

// 横浜市の全部の区の3D TilesデータのURL
var tilesetUrls = [
    'https://assets.cms.plateau.reearth.io/assets/71/e76732-4a56-4654-b0f4-c00b8d502f7a/14100_yokohama-shi_city_2023_citygml_1_op_bldg_3dtiles_14103_nishi-ku_lod1/tileset.json',
    'https://assets.cms.plateau.reearth.io/assets/8f/4d287c-71b4-4044-aec2-0164e407a845/14100_yokohama-shi_city_2023_citygml_1_op_bldg_3dtiles_14104_minami-ku_lod1/tileset.json',
    'https://assets.cms.plateau.reearth.io/assets/84/5b5e7e-d4bc-41b0-9b6a-74107b87ec0f/14100_yokohama-shi_city_2023_citygml_1_op_bldg_3dtiles_14105_konanku_lod1/tileset.json',
    'https://assets.cms.plateau.reearth.io/assets/7c/5a91e5-58a5-4e7b-bd17-2b4d67a8dd7d/14100_yokohama-shi_city_2023_citygml_1_op_bldg_3dtiles_14106_hodogaya-ku_lod1/tileset.json',
    'https://assets.cms.plateau.reearth.io/assets/75/cbb432-61d5-4c7b-9dc5-47c0427d1c12/14100_yokohama-shi_city_2023_citygml_1_op_bldg_3dtiles_14107_asahi-ku_lod1/tileset.json',
    'https://assets.cms.plateau.reearth.io/assets/05/fc39b5-3a6b-44e2-98ef-cb8994e3082f/14100_yokohama-shi_city_2023_citygml_1_op_bldg_3dtiles_14108_kanagawa-ku_lod1/tileset.json',
    'https://assets.cms.plateau.reearth.io/assets/97/3443a0-146e-4e7e-8e2d-052f5c292405/14100_yokohama-shi_city_2023_citygml_1_op_bldg_3dtiles_14109_tsurumi-ku_lod1/tileset.json',
    'https://assets.cms.plateau.reearth.io/assets/5f/9c6ae0-96c7-401e-b77b-0d4a939fc3c5/14100_yokohama-shi_city_2023_citygml_1_op_bldg_3dtiles_14110_kohoku-ku_lod1/tileset.json',
    'https://assets.cms.plateau.reearth.io/assets/cb/2a241c-d78d-4d26-bb1b-f1be62129cf1/14100_yokohama-shi_city_2023_citygml_1_op_bldg_3dtiles_14111_midori-ku_lod1/tileset.json',
    'https://assets.cms.plateau.reearth.io/assets/6a/994ed8-66e7-41a7-8d6b-e60d02a88d8a/14100_yokohama-shi_city_2023_citygml_1_op_bldg_3dtiles_14112_aoba-ku_lod1/tileset.json',
    'https://assets.cms.plateau.reearth.io/assets/94/1dc750-c71f-41ec-b3a8-7691a017a09b/14100_yokohama-shi_city_2023_citygml_1_op_bldg_3dtiles_14113_izumi-ku_lod1/tileset.json',
    'https://assets.cms.plateau.reearth.io/assets/3b/02b20d-8c39-48a4-ace8-b7d94a450502/14100_yokohama-shi_city_2023_citygml_1_op_bldg_3dtiles_14114_sakae-ku_lod1/tileset.json',
    'https://assets.cms.plateau.reearth.io/assets/7e/b61395-071d-4670-8d82-7a1af2d3b1e8/14100_yokohama-shi_city_2023_citygml_1_op_bldg_3dtiles_14115_totsuka-ku_lod1/tileset.json',
    'https://assets.cms.plateau.reearth.io/assets/4f/78752b-40be-4cc5-871a-16df4e77a31e/14100_yokohama-shi_city_2023_citygml_1_op_bldg_3dtiles_14116_kamigyo-ku_lod1/tileset.json',
    'https://assets.cms.plateau.reearth.io/assets/05/66ad07-9d70-420b-9b69-04dbdd2392e8/14100_yokohama-shi_city_2023_citygml_1_op_bldg_3dtiles_14117_tamotsu-ku_lod1/tileset.json',
    'https://assets.cms.plateau.reearth.io/assets/3e/003923-6c72-4e4d-9a88-9f1c7b8d2999/14100_yokohama-shi_city_2023_citygml_1_op_bldg_3dtiles_14118_minato-ku_lod1/tileset.json',
    'https://assets.cms.plateau.reearth.io/assets/bc/1d4095-3c55-44a4-8c1b-3a2fcd45a17e/14100_yokohama-shi_city_2023_citygml_1_op_bldg_3dtiles_14119_seya-ku_lod1/tileset.json'
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
    name: "横浜検索の中心",
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

// JSONファイルを読み込み
fetch('yokohama_restaurant_1000_1km_840.json')
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
