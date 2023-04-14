// @ts-nocheck
const getColors = () => {
  const selectColorEl = document.getElementById('colorop');
  const [defaultOption, ...colorOptions] = selectColorEl?.getElementsByTagName('option');
  const colorsInScss = colorOptions.map(({ label, value }) => `$${label.replace(/ /g, '-').toLowerCase()}: #${value.toLowerCase()};`).join('');
  const colorsInEnum = colorOptions.map(({ label, value }) => `${label.replace(/ /g, '_').toUpperCase()} = '#${value.toLowerCase()}'`).join(',');

  console.log(colorsInScss);
};
