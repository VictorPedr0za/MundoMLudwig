var scene = null,
    camera = null,
    renderer = null,
    controls = null,
    //figuresGeo = [],
    mylight = null;

 
const size = 20,
    division = 20;

    
 
function startScene() {
  
    // Scene, Camera, Renderer
    scene  = new THREE.Scene();
    scene.background = new THREE.Color(0x11f5f5);
    camera = new THREE.PerspectiveCamera( 75,  // Angulo de Vision (Abajo o Arriba)
                                        window.innerWidth / window.innerHeight, // Relación Aspecto (16:9)
                                        0.1, // Mas Cerca (no renderiza)
                                        1000); // Mas lejos
    renderer = new THREE.WebGLRenderer({canvas: document.getElementById("mapa")});
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );
 
    //orbit controls
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    camera.position.set(0, 5, 10);
    controls.update();

    /*
    //orbit helper
    const gridHelper = new THREE.GridHelper( size, division );
    scene.add( gridHelper );
    */
    camera.position.z = 20;
    

    //gestiona la creacion del tipo de luz
    
    createlight('directionalLight');

    showMap();

    animate();

}


function createlight(typeLight){

  //var e = document.getElementById("theLight");
  //var typeLight = e.value;
  //var text = e.options[e.selectedIndex].text;

  switch(typeLight) {
      
    case 'ambient':
    
      mylight = new THREE.AmbientLight( 0xFFFFFF, 90000000000000); // soft white light
      scene.add( mylight );
    break;

    case 'directionalLight':
      mylight = new THREE.DirectionalLight( 0xffffff, 0.5 );
      scene.add( mylight );
    break;

    case 'pointLight':
      mylight= new THREE.PointLight( 0xffffff, 10, 10000000000);
      mylight.position.set( 0, 5, 6 );
      scene.add( mylight );

      const sphereSize = 2;
      const pointLightHelper = new THREE.PointLightHelper( mylight, sphereSize );
      scene.add( pointLightHelper );
    break;

    case 'spot':
      mylight = new THREE.Spotmylight( 0xffffff );
      mylight.position.set( 10, 10, 10 );

      scene.add( mylight );
    break;
  }
}



// Resize by Screen Size
window.addEventListener( 'resize', onWindowResize, false );

function onWindowResize(){

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

function showMap(){

  //const materials = new THREE.MeshBasicMaterial( {color: 0xFFFFFF} );
  
  /*
  var mtlLoader = new THREE.MTLLoader();
  mtlLoader.setTexturePath('./src/3Dmodels/Map/');
  mtlLoader.setPath('./src/3Dmodels/Map/');
  mtlLoader.load('SuperMarioWorldmodel.mtl', function (materials){

    materials.preload();

    var objLoader = new THREE.OBJLoader();
    objLoader.setMaterials(materials);
    objLoader.setPath('./src/3Dmodels/Map/');
    objLoader.load('SuperMarioWorldmodel.obj', function (object){

      scene.add(object);

    });

  });
  */
 

}

/*
function figures(){

  var edificio1, edificio2;

  //const texture = new THREE.TextureLoader().load('../src/img/facesImage/uv_test_bw_1024.png');

    //edificio1

    var materialedificio1 = [new THREE.MeshBasicMaterial( {map: new THREE.TextureLoader().load('../src/img/edificioventana1.jpg'), side: THREE.DoubleSide },),
      new THREE.MeshBasicMaterial( {map: new THREE.TextureLoader().load('../src/img/edificioventana1.jpg'), side: THREE.DoubleSide} ),
      new THREE.MeshBasicMaterial( {map: new THREE.TextureLoader().load('../src/img/Red roof tile tiling texture.jpg'), side: THREE.DoubleSide} ), //techo
      new THREE.MeshBasicMaterial( {map: new THREE.TextureLoader().load('../src/img/Red roof tile tiling texture.jpg'), side: THREE.DoubleSide} ), //piso
      new THREE.MeshBasicMaterial( {map: new THREE.TextureLoader().load('../src/img/edificioventana1.jpg'), side: THREE.DoubleSide} ),
      new THREE.MeshBasicMaterial( {map: new THREE.TextureLoader().load('../src/img/edificioventana1.jpg'), side: THREE.DoubleSide} ),
    ];

    const geometryBox1 = new THREE.BoxGeometry( 3, 6, 3 ); 
    //const materialBox1 = new THREE.MeshBasicMaterial( {color: 0x00ff00, map: texture, side: THREE.DoubleSide} ); 
    edificio1 = new THREE.Mesh( geometryBox1, materialedificio1 );

    edificio1.position.x = -5.85;
    edificio1.position.y = 3.01;
    edificio1.position.z = 1.7;
    scene.add( edificio1 );

    //otro edificio con la misma textura que la anterior figulra

    const geometryBox2 = new THREE.BoxGeometry( 3, 8, 3 ); 
    const materialBox2 = new THREE.MeshBasicMaterial( {color: 0x00ff00} ); 
    edificio2 = new THREE.Mesh( geometryBox2, materialedificio1); 

    edificio2.position.x = -5.85;
    edificio2.position.y = 4.01;
    edificio2.position.z = 5.67;
    scene.add( edificio2 );

    //terreno  todo el mapa

    const geometry = new THREE.PlaneGeometry( 30, 30 );

    const texturePlano = new THREE.TextureLoader().load('../src/img/road map.jpg');

    const material = new THREE.MeshBasicMaterial( { 
                                                    side: THREE.DoubleSide,
                                                    map: texturePlano, 
                                                    color: 0x7d7f7d, // White color, ensuring no color multiplication
                                                    transparent: false} );

    const plane = new THREE.Mesh( geometry, material );
    plane.rotateX(90*(Math.PI)/180);
    scene.add( plane );

    
    //monumento1

    var monumento1

    const monumento1Texture = new THREE.TextureLoader().load('../src/img/techoD.jpg');

    const monumento2Texture = new THREE.TextureLoader().load('../src/img/stone-wall-texture.jpg.jpg');

    const geomonumento = new THREE.BoxGeometry( 3, 0.5, 3 ); 
    const materialmonumento1 = new THREE.MeshBasicMaterial( {color: 0x5c5c5c, map: monumento1Texture, side: THREE.DoubleSide} ); 
    monumento1 = new THREE.Mesh( geomonumento, materialmonumento1); 

    monumento1.position.x = 4.2;
    monumento1.position.y = 0.251;
    monumento1.position.z = 5.9;
    scene.add( monumento1 );

    //monumento2

    var monumento2

    const geomonumento2 = new THREE.ConeGeometry(2.52, 3, 30); 
    const materialmonumento2 = new THREE.MeshBasicMaterial( {color: 0x5c5c5c, map: monumento2Texture, side: THREE.DoubleSide} ); 
    monumento2 = new THREE.Mesh( geomonumento2, materialmonumento2); 

    monumento2.position.x = 3.1;
    monumento2.position.y = 1.51;
    monumento2.position.z = -11.5;
    scene.add( monumento2 );

    //edificio3

    var edificio3;

    var materialEdificio3 = [new THREE.MeshBasicMaterial( {map: new THREE.TextureLoader().load('../src/img/EdificioF.jpg'), side: THREE.DoubleSide },),
      new THREE.MeshBasicMaterial( {map: new THREE.TextureLoader().load('../src/img/EdificioF.jpg'), side: THREE.DoubleSide} ),
      new THREE.MeshBasicMaterial( {map: new THREE.TextureLoader().load('../src/img/techoE.jpg'), side: THREE.DoubleSide} ), //techo
      new THREE.MeshBasicMaterial( {map: new THREE.TextureLoader().load('../src/img/techoE.jpg'), side: THREE.DoubleSide} ), //piso
      new THREE.MeshBasicMaterial( {map: new THREE.TextureLoader().load('../src/img/EdificioF.jpg'), side: THREE.DoubleSide} ),
      new THREE.MeshBasicMaterial( {map: new THREE.TextureLoader().load('../src/img/EdificioF.jpg'), side: THREE.DoubleSide} ),
];

    const geoEdificio3 = new THREE.BoxGeometry( 6, 4, 6.9 ); 
    //const materialEdificio3 = new THREE.MeshBasicMaterial( {color: 0x00ff00} ); 
    edificio3 = new THREE.Mesh( geoEdificio3, materialEdificio3); 

    edificio3.position.x = -11;
    edificio3.position.y = 2.01;
    edificio3.position.z = 3.66;
    scene.add( edificio3 );

    //edificio4

    var edificio4;

    var materialedificio4 = [new THREE.MeshBasicMaterial( {map: new THREE.TextureLoader().load('../src/img/Freepik_ Download Free Videos, Vectors, Photos, and PSD.jpg'), side: THREE.DoubleSide },),
      new THREE.MeshBasicMaterial( {map: new THREE.TextureLoader().load('../src/img/Freepik_ Download Free Videos, Vectors, Photos, and PSD.jpg'), side: THREE.DoubleSide} ),
      new THREE.MeshBasicMaterial( {map: new THREE.TextureLoader().load('../src/img/Clay roofing Cote Fleurie texture seamless 03349.jpg'), side: THREE.DoubleSide} ), //techo
      new THREE.MeshBasicMaterial( {map: new THREE.TextureLoader().load('../src/img/Clay roofing Cote Fleurie texture seamless 03349.jpg'), side: THREE.DoubleSide} ), //piso
      new THREE.MeshBasicMaterial( {map: new THREE.TextureLoader().load('../src/img/Freepik_ Download Free Videos, Vectors, Photos, and PSD.jpg'), side: THREE.DoubleSide} ),
      new THREE.MeshBasicMaterial( {map: new THREE.TextureLoader().load('../src/img/Freepik_ Download Free Videos, Vectors, Photos, and PSD.jpg'), side: THREE.DoubleSide} ),
];
    
    const geoEdificio4 = new THREE.BoxGeometry( 5, 3, 3.6 ); 
    //const materialEdificio4 = new THREE.MeshBasicMaterial( {color: 0x00ff00} ); 
    edificio4 = new THREE.Mesh( geoEdificio4, materialedificio4); 

    edificio4.position.x = -7;
    edificio4.position.y = 1.501; 
    edificio4.position.z = 13.15;
    scene.add( edificio4 );

    //edificio5

    var edificio5;

    var materialedificio5 = [new THREE.MeshBasicMaterial( {map: new THREE.TextureLoader().load('../src/img/edificioA.jpg'), side: THREE.DoubleSide },),
      new THREE.MeshBasicMaterial( {map: new THREE.TextureLoader().load('../src/img/edificioA.jpg'), side: THREE.DoubleSide} ),
      new THREE.MeshBasicMaterial( {map: new THREE.TextureLoader().load('../src/img/techoA.jpg'), side: THREE.DoubleSide} ), //techo
      new THREE.MeshBasicMaterial( {map: new THREE.TextureLoader().load('../src/img/techoA.jpg'), side: THREE.DoubleSide} ), //piso
      new THREE.MeshBasicMaterial( {map: new THREE.TextureLoader().load('../src/img/edificioA.jpg'), side: THREE.DoubleSide} ),
      new THREE.MeshBasicMaterial( {map: new THREE.TextureLoader().load('../src/img/edificioA.jpg'), side: THREE.DoubleSide} ),
];
    
    const geoEdificio5 = new THREE.BoxGeometry( 5, 2, 3.5 ); 
    //const materialEdificio5 = new THREE.MeshBasicMaterial( {color: 0x00ff00} ); 
    edificio5 = new THREE.Mesh( geoEdificio5, materialedificio5); 

    edificio5.position.x = -12.5;
    edificio5.position.y = 1.01; 
    edificio5.position.z = 13.15;
    scene.add( edificio5 );

    //edificio6

    var edificio6;

    var materialedificio6 = [new THREE.MeshBasicMaterial( {map: new THREE.TextureLoader().load('../src/img/whitewall.jpg.jpg'), side: THREE.DoubleSide },),
      new THREE.MeshBasicMaterial( {map: new THREE.TextureLoader().load('../src/img/whitewall.jpg.jpg'), side: THREE.DoubleSide} ),
      new THREE.MeshBasicMaterial( {map: new THREE.TextureLoader().load('../src/img/cladding stone exterior walls textures seamless.jpg'), side: THREE.DoubleSide} ), //techo
      new THREE.MeshBasicMaterial( {map: new THREE.TextureLoader().load('../src/img/cladding stone exterior walls textures seamless.jpg'), side: THREE.DoubleSide} ), //piso
      new THREE.MeshBasicMaterial( {map: new THREE.TextureLoader().load('../src/img/whitewall.jpg.jpg'), side: THREE.DoubleSide} ),
      new THREE.MeshBasicMaterial( {map: new THREE.TextureLoader().load('../src/img/whitewalldoor.jpg'), side: THREE.DoubleSide} ),
];
    
    const geoEdificio6 = new THREE.BoxGeometry( 4, 1, 3.7 ); 
    //const materialEdificio6 = new THREE.MeshBasicMaterial( {color: 0xFFFFFF} ); 
    edificio6 = new THREE.Mesh( geoEdificio6, materialedificio6); 

    edificio6.position.x = 3.3;
    edificio6.position.y = 0.51; 
    edificio6.position.z = 13.15;
    scene.add( edificio6 );

    //edificio7

    var edificio7;

    var materialedificio7 = [new THREE.MeshBasicMaterial( {map: new THREE.TextureLoader().load('../src/img/Predio 6.jpg'), side: THREE.DoubleSide },),
      new THREE.MeshBasicMaterial( {map: new THREE.TextureLoader().load('../src/img/Predio 6.jpg'), side: THREE.DoubleSide} ),
      new THREE.MeshBasicMaterial( {map: new THREE.TextureLoader().load('../src/img/techoB.jpg'), side: THREE.DoubleSide} ), //techo
      new THREE.MeshBasicMaterial( {map: new THREE.TextureLoader().load('../src/img/techoB.jpg'), side: THREE.DoubleSide} ), //piso
      new THREE.MeshBasicMaterial( {map: new THREE.TextureLoader().load('../src/img/Predio 6.jpg'), side: THREE.DoubleSide} ),
      new THREE.MeshBasicMaterial( {map: new THREE.TextureLoader().load('../src/img/Predio 6.jpg'), side: THREE.DoubleSide} ),
  ];
    
    const geoEdificio7 = new THREE.BoxGeometry( 4, 2, 6 ); 
    //const materialEdificio7 = new THREE.MeshBasicMaterial( {color: 0x00ff00} ); 
    edificio7 = new THREE.Mesh( geoEdificio7, materialedificio7); 

    edificio7.position.x = 13;
    edificio7.position.y = 1.01; 
    edificio7.position.z = 12;
    scene.add( edificio7 );

    //edificio8

    var edificio8;

    var materialedificio8 = [new THREE.MeshBasicMaterial( {map: new THREE.TextureLoader().load('../src/img/edificioC.jpg'), side: THREE.DoubleSide },),
      new THREE.MeshBasicMaterial( {map: new THREE.TextureLoader().load('../src/img/edificioC.jpg'), side: THREE.DoubleSide} ),
      new THREE.MeshBasicMaterial( {map: new THREE.TextureLoader().load('../src/img/Red roof tile tiling texture.jpg'), side: THREE.DoubleSide} ), //techo
      new THREE.MeshBasicMaterial( {map: new THREE.TextureLoader().load('../src/img/Red roof tile tiling texture.jpg'), side: THREE.DoubleSide} ), //piso
      new THREE.MeshBasicMaterial( {map: new THREE.TextureLoader().load('../src/img/edificioC.jpg'), side: THREE.DoubleSide} ),
      new THREE.MeshBasicMaterial( {map: new THREE.TextureLoader().load('../src/img/edificioC.jpg'), side: THREE.DoubleSide} ),
  ];
    
    const geoEdificio8 = new THREE.BoxGeometry( 4, 7, 4 ); 
    //const materialEdificio8 = new THREE.MeshBasicMaterial( {color: 0x00ff00} ); 
    edificio8 = new THREE.Mesh( geoEdificio8, materialedificio8); 

    edificio8.position.x = 12.8;
    edificio8.position.y = 3.51; 
    edificio8.position.z = 2;
    scene.add( edificio8 );

    //edificio9

    var edificio9;

    var materialEdificio9 = [new THREE.MeshBasicMaterial( {map: new THREE.TextureLoader().load('../src/img/EdificioD.jpg'), side: THREE.DoubleSide },),
      new THREE.MeshBasicMaterial( {map: new THREE.TextureLoader().load('../src/img/EdificioD.jpg'), side: THREE.DoubleSide} ),
      new THREE.MeshBasicMaterial( {map: new THREE.TextureLoader().load('../src/img/techoD.jpg'), side: THREE.DoubleSide} ), //techo
      new THREE.MeshBasicMaterial( {map: new THREE.TextureLoader().load('../src/img/techoD.jpg'), side: THREE.DoubleSide} ), //piso
      new THREE.MeshBasicMaterial( {map: new THREE.TextureLoader().load('../src/img/EdificioD.jpg'), side: THREE.DoubleSide} ),
      new THREE.MeshBasicMaterial( {map: new THREE.TextureLoader().load('../src/img/EdificioD.jpg'), side: THREE.DoubleSide} ),
  ];
    
    const geoEdificio9 = new THREE.BoxGeometry( 4, 5, 8 ); 
    //const materialEdificio9 = new THREE.MeshBasicMaterial( {color: 0x00ff00} ); 
    edificio9 = new THREE.Mesh( geoEdificio9, materialEdificio9); 

    edificio9.position.x = 12.9;
    edificio9.position.y = 2.51; 
    edificio9.position.z = -5.1;
    scene.add( edificio9 );

    //edificio10

    var edificio10;

    var materialEdificio10 = [new THREE.MeshBasicMaterial( {map: new THREE.TextureLoader().load('../src/img/edificioG.jpg'), side: THREE.DoubleSide },),
      new THREE.MeshBasicMaterial( {map: new THREE.TextureLoader().load('../src/img/edificioG.jpg'), side: THREE.DoubleSide} ),
      new THREE.MeshBasicMaterial( {map: new THREE.TextureLoader().load('../src/img/techoG.jpg'), side: THREE.DoubleSide} ), //techo
      new THREE.MeshBasicMaterial( {map: new THREE.TextureLoader().load('../src/img/techoG.jpg'), side: THREE.DoubleSide} ), //piso
      new THREE.MeshBasicMaterial( {map: new THREE.TextureLoader().load('../src/img/edificioG.jpg'), side: THREE.DoubleSide} ),
      new THREE.MeshBasicMaterial( {map: new THREE.TextureLoader().load('../src/img/edificioG.jpg'), side: THREE.DoubleSide} ),
  ];
    
    const geoEdificio10 = new THREE.BoxGeometry( 3, 6, 4 ); 
    //const materialEdificio10 = new THREE.MeshBasicMaterial( {color: 0x00ff00} ); 
    edificio10 = new THREE.Mesh( geoEdificio10, materialEdificio10); 

    edificio10.position.x = -13.5;
    edificio10.position.y = 3.01; 
    edificio10.position.z = -6;
    scene.add( edificio10 );

    //edificio11

    var edificio11;

    var materialedificio11 = [new THREE.MeshBasicMaterial( {map: new THREE.TextureLoader().load('../src/img/edificioE.jpg'), side: THREE.DoubleSide },),
      new THREE.MeshBasicMaterial( {map: new THREE.TextureLoader().load('../src/img/edificioE.jpg'), side: THREE.DoubleSide} ),
      new THREE.MeshBasicMaterial( {map: new THREE.TextureLoader().load('../src/img/Clay roofing Cote Fleurie texture seamless 03349.jpg'), side: THREE.DoubleSide} ), //techo
      new THREE.MeshBasicMaterial( {map: new THREE.TextureLoader().load('../src/img/Clay roofing Cote Fleurie texture seamless 03349.jpg'), side: THREE.DoubleSide} ), //piso
      new THREE.MeshBasicMaterial( {map: new THREE.TextureLoader().load('../src/img/edificioE.jpg'), side: THREE.DoubleSide} ),
      new THREE.MeshBasicMaterial( {map: new THREE.TextureLoader().load('../src/img/edificioE.jpg'), side: THREE.DoubleSide} ),
  ];
    
    const geoEdificio11 = new THREE.BoxGeometry( 3, 5, 3 ); 
    //const materialEdificio11 = new THREE.MeshBasicMaterial( {color: 0x00ff00} ); 
    edificio11 = new THREE.Mesh( geoEdificio11, materialedificio11); 

    edificio11.position.x = -13.5;
    edificio11.position.y = 2.501; 
    edificio11.position.z = -10;
    scene.add( edificio11 );

    //edificio12

    var edificio12;

    var materialedificio12 = [new THREE.MeshBasicMaterial( {map: new THREE.TextureLoader().load('../src/img/edificioE.jpg'), side: THREE.DoubleSide },),
      new THREE.MeshBasicMaterial( {map: new THREE.TextureLoader().load('../src/img/edificioE.jpg'), side: THREE.DoubleSide} ),
      new THREE.MeshBasicMaterial( {map: new THREE.TextureLoader().load('../src/img/Clay roofing Cote Fleurie texture seamless 03349.jpg'), side: THREE.DoubleSide} ), //techo
      new THREE.MeshBasicMaterial( {map: new THREE.TextureLoader().load('../src/img/Clay roofing Cote Fleurie texture seamless 03349.jpg'), side: THREE.DoubleSide} ), //piso
      new THREE.MeshBasicMaterial( {map: new THREE.TextureLoader().load('../src/img/edificioE.jpg'), side: THREE.DoubleSide} ),
      new THREE.MeshBasicMaterial( {map: new THREE.TextureLoader().load('../src/img/edificioE.jpg'), side: THREE.DoubleSide} ),
  ];
    
    const geoEdificio12 = new THREE.BoxGeometry( 3, 5, 3 ); 
    //const materialEdificio12 = new THREE.MeshBasicMaterial( {color: 0x00ff00} ); 
    edificio12 = new THREE.Mesh( geoEdificio12, materialedificio12); 

    edificio12.position.x = -13.5;
    edificio12.position.y = 2.501; 
    edificio12.position.z = -13.5;
    scene.add( edificio12 );

    //globo canasta1

    
    const canastaTexture = new THREE.TextureLoader().load('../src/img/Download free image of Brown blank walnut wood texture background by Nunny about walnut wood texture, wood, mobile wallpaper, instagram story dark brown background, and ig plain story background 2252265.jpg');

    const geometrycube1 = new THREE.BoxGeometry( 1, 1, 1 ); 
    const materialcube1 = new THREE.MeshBasicMaterial( {color: 0xa13608, map: canastaTexture, side: THREE.DoubleSide} ); 
    cube1 = new THREE.Mesh( geometrycube1, materialcube1 );

    cube1.position.x = 3;
    cube1.position.y = 3;
    cube1.position.z = -3;
    scene.add( cube1 );

    //palo de globo1

    const geometryStick1 = new THREE.BoxGeometry( 0.2, 1, 0.2 ); 
    const materialStick1 = new THREE.MeshBasicMaterial( {color: 0xa13608, map: canastaTexture, side: THREE.DoubleSide} ); 
    stick1 = new THREE.Mesh( geometryStick1, materialStick1 );

    stick1.position.x = 3;
    stick1.position.y = 4;
    stick1.position.z = -3;
    scene.add( stick1 );

    //globo1

    const globoTexture = new THREE.TextureLoader().load('../src/img/baloon.jpg.jpg');


    const geometryBaloon1 = new THREE.SphereGeometry( 3, 7, 5 ); 
    const materialBaloon1 = new THREE.MeshBasicMaterial( {map: globoTexture, side: THREE.DoubleSide} ); 
    baloon1 = new THREE.Mesh( geometryBaloon1, materialBaloon1 );

    baloon1.position.x = 3;
    baloon1.position.y = 7;
    baloon1.position.z = -3;
    scene.add( baloon1 );

    //arboles

    const troncoTexture = new THREE.TextureLoader().load('../src/img/tronco.jpg');
    const hojasTexture = new THREE.TextureLoader().load('../src/img/hojas.jpg');

    //palo de arbol1

    var tronco1;

    const geometrytronco1 = new THREE.BoxGeometry( 0.4, 1, 0.4 ); 
    const materialtronco1 = new THREE.MeshBasicMaterial( {color: 0xa13608, map: troncoTexture, side: THREE.DoubleSide} ); 
    tronco1 = new THREE.Mesh( geometrytronco1, materialtronco1 );

    tronco1.position.x = -6;
    tronco1.position.y = 0.501;
    tronco1.position.z = -7;
    scene.add( tronco1 );

    //hojas1

    var hojas1;

    const geometryhojas1 = new THREE.BoxGeometry( 1, 1, 1 ); 
    const materialhojas1 = new THREE.MeshBasicMaterial( {color: 0x7DDA58, map: hojasTexture, side: THREE.DoubleSide} ); 
    hojas1 = new THREE.Mesh( geometryhojas1, materialhojas1 );

    hojas1.position.x = -6;
    hojas1.position.y = 1;
    hojas1.position.z = -7;
    scene.add( hojas1 );

    //palo de arbol2

    var tronco2;

    const geometrytronco2 = new THREE.BoxGeometry( 0.4, 1, 0.4 ); 
    const materialtronco2 = new THREE.MeshBasicMaterial( {color: 0xa13608, map: troncoTexture, side: THREE.DoubleSide} ); 
    tronco2 = new THREE.Mesh( geometrytronco2, materialtronco2 );

    tronco2.position.x = -5;
    tronco2.position.y = 0.501;
    tronco2.position.z = -12;
    scene.add( tronco2 );

    //hojas2

    var hojas2;

    const geometryhojas2 = new THREE.BoxGeometry( 1, 1, 1 ); 
    const materialhojas2 = new THREE.MeshBasicMaterial( {color: 0x7DDA58, map: hojasTexture, side: THREE.DoubleSide} ); 
    hojas2 = new THREE.Mesh( geometryhojas2, materialhojas2 );

    hojas2.position.x = -5;
    hojas2.position.y = 1;
    hojas2.position.z = -12;
    scene.add( hojas2 );

     //palo de arbol3

     var tronco3;

     const geometrytronco3 = new THREE.BoxGeometry( 0.4, 1, 0.4 ); 
     const materialtronco3 = new THREE.MeshBasicMaterial( {color: 0xa13608, map: troncoTexture, side: THREE.DoubleSide} ); 
     tronco3 = new THREE.Mesh( geometrytronco3, materialtronco3 );
 
     tronco3.position.x = -3;
     tronco3.position.y = 0.501;
     tronco3.position.z = -11;
     scene.add( tronco3 );
 
     //hojas3
 
     var hojas3;
 
     const geometryhojas3 = new THREE.BoxGeometry( 1, 1, 1 ); 
     const materialhojas3 = new THREE.MeshBasicMaterial( {color: 0x7DDA58, map: hojasTexture, side: THREE.DoubleSide} ); 
     hojas3 = new THREE.Mesh( geometryhojas3, materialhojas3 );
 
     hojas3.position.x = -3;
     hojas3.position.y = 1;
     hojas3.position.z = -11;
     scene.add( hojas3 );

     //palo de arbol4

     var tronco4;

     const geometrytronco4 = new THREE.BoxGeometry( 0.4, 1, 0.4 ); 
     const materialtronco4 = new THREE.MeshBasicMaterial( {color: 0xa13608, map: troncoTexture, side: THREE.DoubleSide} ); 
     tronco4 = new THREE.Mesh( geometrytronco4, materialtronco4 );
 
     tronco4.position.x = 3;
     tronco4.position.y = 0.501;
     tronco4.position.z = -2;
     scene.add( tronco4 );
 
     //hojas4
 
     var hojas4;
 
     const geometryhojas4 = new THREE.BoxGeometry( 1, 1, 1 ); 
     const materialhojas4 = new THREE.MeshBasicMaterial( {color: 0x7DDA58, map: hojasTexture, side: THREE.DoubleSide} ); 
     hojas4 = new THREE.Mesh( geometryhojas4, materialhojas4 );
 
     hojas4.position.x = 3;
     hojas4.position.y = 1;
     hojas4.position.z = -2;
     scene.add( hojas4 );

     //palo de arbol5

     var tronco5;

     const geometrytronco5 = new THREE.BoxGeometry( 0.4, 1, 0.4 ); 
     const materialtronco5 = new THREE.MeshBasicMaterial( {color: 0xa13608, map: troncoTexture, side: THREE.DoubleSide} ); 
     tronco5 = new THREE.Mesh( geometrytronco5, materialtronco5 );
 
     tronco5.position.x = 6;
     tronco5.position.y = 0.501;
     tronco5.position.z = -2;
     scene.add( tronco5 );
 
     //hojas5
 
     var hojas5;
 
     const geometryhojas5 = new THREE.BoxGeometry( 1, 1, 1 ); 
     const materialhojas5 = new THREE.MeshBasicMaterial( {color: 0x7DDA58, map: hojasTexture, side: THREE.DoubleSide} ); 
     hojas5 = new THREE.Mesh( geometryhojas5, materialhojas5 );
 
     hojas5.position.x = 6;
     hojas5.position.y = 1;
     hojas5.position.z = -2;
     scene.add( hojas5 );

    //palo de arbol6

    var tronco7;

    const geometrytronco7 = new THREE.BoxGeometry( 0.4, 1, 0.4 ); 
    const materialtronco7 = new THREE.MeshBasicMaterial( {color: 0xa13608, map: troncoTexture, side: THREE.DoubleSide} ); 
    tronco7 = new THREE.Mesh( geometrytronco7, materialtronco7 );

    tronco7.position.x = 8.5;
    tronco7.position.y = 0.501;
    tronco7.position.z = -2;
    scene.add( tronco7 );

    //hojas6

    var hojas6;

    const geometryhojas6 = new THREE.BoxGeometry( 1, 1, 1 ); 
    const materialhojas6 = new THREE.MeshBasicMaterial( {color: 0x7DDA58, map: hojasTexture, side: THREE.DoubleSide} ); 
    hojas6 = new THREE.Mesh( geometryhojas6, materialhojas6 );

    hojas6.position.x = 8.5;
    hojas6.position.y = 1;
    hojas6.position.z = -2;
    scene.add( hojas6 );
  

}
*/

function animate() {
  requestAnimationFrame(animate);

  controls.update
  renderer.render( scene, camera );
}
 

