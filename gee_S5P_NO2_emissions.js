var images = {
  'S5P_NO2_March2019': S5P_monthly_mean('2019-03-01'),
  'S5P_NO2_March2020': S5P_monthly_mean('2020-03-01'),
};

function S5P_monthly_mean(date) {
  var date = ee.Date(date);
  var S5_col = ee.ImageCollection('COPERNICUS/S5P/NRTI/L3_NO2')
                      .filterDate(date, date.advance(1, 'month'))
                      .select('NO2_column_number_density')
                      .mean();
  return S5_col.visualize({min: 0, max: 0.0002, opacity : 0.7, palette: ['black', 'blue', 'purple', 'cyan', 'green', 'yellow', 'red']});
}

var leftMap = ui.Map();
leftMap.setControlVisibility(false);
var leftSelector = addLayerSelector(leftMap, 0, 'top-left');

var rightMap = ui.Map();
rightMap.setControlVisibility(false);
var rightSelector = addLayerSelector(rightMap, 1, 'top-right');

function addLayerSelector(mapToChange, defaultValue, position) {
  var label = ui.Label('Choose an image to visualize');

  function updateMap(selection) {
    mapToChange.layers().set(0, ui.Map.Layer(images[selection]));
  }

  var select = ui.Select({items: Object.keys(images), onChange: updateMap});
  select.setValue(Object.keys(images)[defaultValue], true);

  var controlPanel =
      ui.Panel({widgets: [label, select], style: {position: position}});

  mapToChange.add(controlPanel);
}

var splitPanel = ui.SplitPanel({
  firstPanel: leftMap,
  secondPanel: rightMap,
  wipe: true,
  style: {stretch: 'both'}
});

ui.root.widgets().reset([splitPanel]);
var linker = ui.Map.Linker([leftMap, rightMap]);
leftMap.setCenter(10, 36, 4);
