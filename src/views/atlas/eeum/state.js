const state = {
  "dimensions": {"x": [1e-05, "m"], "y": [1e-05, "m"], "z": [0.0001, "m"]}, 
  "position": [900.0, 650.0, 90.0], "crossSectionScale": 3.74, 
  "projectionOrientation": [
    0.022934094071388245,
    0.7397342920303345,
    0.01295413263142109,
    -0.6723833680152893
  ], 
  "projectionScale": 3173, 
  "layers": [{
    "type": "segmentation", 
    "source": `precomputed://http://${window.location.host}/atlas_data/eeum/`,
    "tab": "segments", 
    "segmentColors": {
      "3221": "#3b7a63", "3222": "#3b7a63", "3223": "#3b7a63", "3224": "#3b7a63", "3225": "#3b7a63", "9851": "#4c9b60", "9852": "#4c9b60", "9853": "#4c9b60", "9854": "#4c9b60", "9855": "#4c9b60", "9931": "#468e58", "9932": "#468e58", "9933": "#468e58", "9934": "#468e58", "9935": "#468e58", "1841": "#61c561", "1842": "#61c561", "1843": "#61c561", "1844": "#61c561", "1845": "#61c561", "391": "#5da36c", "392": "#5da36c", "393": "#5da36c", "394": "#5da36c", "395": "#5da36c", "9721": "#5da46c", "9722": "#5da46c", "9723": "#5da46c", "9724": "#5da46c", "3781": "#3d7e66", "3782": "#3d7e66", "3783": "#3d7e66", "3784": "#3d7e66", "3785": "#3d7e66", "221": "#5ea46c", "222": "#5ea46c", "223": "#5ea46c", "224": "#5ea46c", "225": "#5ea46c", "481": "#5da46c", "482": "#5da46c", "483": "#5da46c", "484": "#5da46c", "485": "#5da46c", "8361": "#52adb1", "8362": "#52adb1", "8363": "#52adb1", "8364": "#52adb1", "8365": "#52adb1", "8951": "#52adb1", "8952": "#52adb1", "8953": "#52adb1", "8954": "#52adb1", "8955": "#52adb1", "961": "#4fa498", "962": "#4fa498", "963": "#4fa498", "964": "#4fa498", "965": "#4fa498", "10841": "#73b757", "10842": "#73b757", "10843": "#73b757", "10844": "#73b757", "10845": "#73b757", "9091": "#5fb541", "9092": "#5fb541", "9093": "#5fb541", "9094": "#5fb541", "9095": "#5fb541", "3851": "#3c838a", "3852": "#3c838a", "3853": "#3c838a", "3854": "#3c838a", "3855": "#3c838a", "6691": "#3c838a", "6692": "#3c838a", "6693": "#3c838a", "6694": "#3c838a", "6695": "#3c838a", "951": "#4b966a", "952": "#4b966a", "953": "#4b966a", "954": "#4b966a", "955": "#4b966a", "8941": "#4fa498", "8942": "#4fa498", "8943": "#4fa498", "8944": "#4fa498", "8945": "#4fa498", "2541": "#4fa498", "2542": "#4fa498", "2543": "#4fa498", "2544": "#4fa498", "2545": "#4fa498", "3111": "#39b54a", "1929": "#2fb924", "1939": "#7ecf4a", "1949": "#7ed04c", "1959": "#4fc144", "1969": "#59b946", "477": "#7ecced", "4779": "#98d6f9", "4778": "#98d6f9", "803": "#8599cc", "4777": "#8599cc", "4776": "#8599cc", "549": "#f45b71", "1097": "#e64339", "4775": "#e64339", "313": "#ff65ff", "4774": "#ff65ff", "4773": "#ff65ff", "771": "#f98575", "354": "#fe9acc", "512": "#f0f07f", "1009": "#cbcccc"
    }, 
    "name": "eeum", 
  }],
  "showSlices": false, 
  "selectedLayer": {
    "layer": "eeums", 
    "visible": true
  },
  "showDefaultAnnotations": false,
  "layout": "3d"
}

export default state;
