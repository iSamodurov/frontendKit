import CustomYaMap from './components/customMap';
import { initScrollTo } from './components/utils';


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
	initScrollTo();
	initFormValidator();
	initFormHandler();
});
window.addEventListener('resize', () => {
});



function initFormValidator() {
	$('form').parsley();
}


function initFormHandler() {
	$('form').submit(function() {
		const loader = $(this).parent('.form').find('.form__loader');
		$.ajax({
			url: 'some/controller.php',
			method: 'POST',
			data: $(this).serialize(),
			beforeSend: function() {
				loader.show(230);
			}
		}).done(() => {
			// code here
		}).fail((err) => {
			console.log(err);
		}).always(() => {
			loader.hide(230);
		});
		return false;
	});
}