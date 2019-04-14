import CustomYaMap from './components/customMap';


/* ----------  VARIABLES ---------- */
const mapPoints = [
	{
		point: [56.469424, 39.834427],
		title: 'Мед ополье',
		type: 'general',
		balloonType: 'custom',
	},
	{
		point: [56.447291, 39.860308],
		title: 'Пасека',
	},
];


/* ---------- INIT ---------- */
(function() {
	new CustomYaMap('map', mapPoints);
})();


// Event listeners
document.addEventListener('DOMContentLoaded', () => {
});
window.addEventListener('resize', () => {
});
