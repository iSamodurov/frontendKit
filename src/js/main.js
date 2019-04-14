import CustomYaMap from './components/customMap';


/* ----------  VARIABLES ---------- */
const mapPoints = [
	{
		point: [56.469507, 39.834384],
		title: 'Example',
		type: 'general',
		balloonType: 'custom',
	},
	{
		point: [56.447291, 39.860308],
		title: 'Example second',
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
