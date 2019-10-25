import React, { Component } from 'react'
import { View } from 'react-native'
import MapView from 'react-native-maps'
import * as Permissions from 'expo-permissions'
import * as Location from 'expo-location'

class MapScreen extends Component {
	static navigationOptions = {
		title: 'map',
		headerStyle: {
			backgroundColor: '#2B79C2',
		},
		headerTitleStyle: {
			color: '#000000',
		},
	}

	constructor(props) {
		super(props)

		try {
			this.markers = this.props.navigation.state.params.markers
		} catch {
			this.markers = []
		}
	}

	async componentDidMount() {
		let { status } = await Permissions.askAsync(Permissions.LOCATION)
		if (status !== 'granted') {
			alert('This operation requires location permission')
			return
		}

		let pos = await Location.getCurrentPositionAsync({})
		this.mapView.animateToRegion({ latitude: pos.coords.latitude, longitude: pos.coords.longitude, latitudeDelta: 0.02, longitudeDelta: 0.02 }, 1000)
	}

	render() {
		return (
			<View style={{ flex: 1 }}>
				<MapView
					ref={ref => (this.mapView = ref)}
					style={{ flex: 1 }}
					initialRegion={{
						latitude: this.markers.length > 0 ? this.markers[0].value.coords.latitude : 50.0462778,
						longitude: this.markers.length > 0 ? this.markers[0].value.coords.longitude : 19.9222172,
						latitudeDelta: 1,
						longitudeDelta: 1,
					}}
				>
					{this.markers.map(marker => (
						<MapView.Marker key={marker.key} coordinate={marker.value.coords} title={marker.key} description={new Date(marker.value.timestamp).toLocaleString('en-GB')} />
					))}
				</MapView>
			</View>
		)
	}
}

export default MapScreen
