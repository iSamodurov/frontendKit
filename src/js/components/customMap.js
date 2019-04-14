/* eslint-disable max-len */

const defaultConfig = {
	zoom: 14,
	controls: ['zoomControl'],
	center: [],
	scrollZoom: false,
};

class CustomYaMap {
	constructor(containerId, points, props) {
		this.containerId = containerId || 'map';
		this.points = points || null;
		this.props = Object.assign(defaultConfig, props);
		this.map = null;
		ymaps.ready(this.initMap);
	}

	initMap = () => {
		this.map = new ymaps.Map('map', this.props, {
			suppressMapOpenBlock: true
		});
		this.addPointsToMap(this.points);
		this.applayOptions();
	}


	createCustomPlacemark = (point) => {
		const layout = ymaps.templateLayoutFactory.createClass(this.getPlacemarkLayout(point));
		const placemark = new ymaps.Placemark(
			point.point,
			{ hintContent: point.title },
			{
				iconLayout: layout,
				iconShape: {
					type: 'Rectangle',
					coordinates: [[0, 0], [0, 0]],
				},
			}
		);
		return placemark;
	}

	createPlacemark = (point) => {
		const placemark = new ymaps.Placemark(point.point, {
			balloonContent: `<strong>${point.title}</strong>`,
		},
		{
			preset: 'islands#dotIcon',
			iconColor: 'orange',
		});
		return placemark;
	}


	addPointsToMap = (points) => {
		points.map((point) => {
			const placemark = (point.balloonType === 'custom')
				? this.createCustomPlacemark(point)
				: this.createPlacemark(point);
			this.map.geoObjects.add(placemark);
		});
	}

	getPlacemarkLayout = (point) => {
		return `
			<div class="custom-placemark">
				<h2>${point.title}</h2>
			</div>
		`;
	}

	applayOptions = () => {
		this.map.setBounds(this.map.geoObjects.getBounds(), { 
			checkZoomRange: true,
			zoomMargin: 100,
		}).then(() => {
			if (this.map.getZoom() > this.props.zoom) {
				this.map.setZoom(this.props.zoom);
			}
		});

		if (!this.props.scrollZoom) {
			this.map.behaviors.disable('scrollZoom');
		}
	}
}

export default CustomYaMap;
