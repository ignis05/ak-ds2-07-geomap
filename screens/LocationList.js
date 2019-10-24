import React, { Component } from 'react'
import { View, Text, StyleSheet, ActivityIndicator, AsyncStorage, FlatList } from 'react-native'
import * as Permissions from 'expo-permissions'
import * as Location from 'expo-location'
import Button from '../components/Button'
import LocationElement from '../components/LocationElement'

const styles = StyleSheet.create({
	wrapper: { flex: 1 },
	smallButton: { fontSize: 24, width: '40%', textAlign: 'center' },
	buttonsWrapper: { width: '100%' },
	posButtons: { width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly' },
	buttonsWrapper: { marginBottom: 20 },
})

class LocationList extends Component {
	static navigationOptions = {
		title: 'locations',
		headerStyle: {
			backgroundColor: 'cyan',
		},
		headerTitleStyle: {
			color: '#000000',
		},
	}

	constructor(props) {
		super(props)
		this.state = { locations: [], loading: false, locationsLoaded: false }

		this.savePosition = this.savePosition.bind(this)
		this.deleteLocations = this.deleteLocations.bind(this)
	}

	async savePosition() {
		this.setState({ loading: true })
		let { status } = await Permissions.askAsync(Permissions.LOCATION)
		if (status !== 'granted') {
			alert('This operation requires location permission')
			this.setState({ loading: false })
			return
		}

		let pos = await Location.getCurrentPositionAsync({})
		await AsyncStorage.setItem(
			Math.random()
				.toString(36)
				.substring(7),
			JSON.stringify(pos)
		)
		await this.loadLocations()
		this.setState({ loading: false })
	}

	componentWillMount() {
		this.loadLocations()
	}

	deleteLocations() {
		this.setState({ loading: true }, async () => {
			let keys = await AsyncStorage.getAllKeys()
			await AsyncStorage.multiRemove(keys)
			this.setState({ locations: [], loading: false })
		})
	}

	loadLocations() {
		return new Promise(async res => {
			let keys = await AsyncStorage.getAllKeys()
			let stores = await AsyncStorage.multiGet(keys)
			let data = stores.map((result, i, store) => {
				let key = store[i][0]
				let value = JSON.parse(store[i][1])
				return { key: key, value: value }
			})
			console.log('data')
			console.log(data)
			this.setState({ locations: data, locationsLoaded: true }, () => {
				res('done')
			})
		})
	}

	render() {
		if (this.state.loading) {
			return (
				<View style={[styles.wrapper, { justifyContent: 'center', alignItems: 'center' }]}>
					<ActivityIndicator size="large" color="#000000" />
				</View>
			)
		}
		return (
			<View style={styles.wrapper}>
				<View style={styles.buttonsWrapper}>
					<View style={styles.posButtons}>
						<Button onTouch={this.savePosition} style={styles.smallButton} disabled={!this.state.locationsLoaded}>
							Save current position
						</Button>
						<Button onTouch={this.deleteLocations} style={styles.smallButton} disabled={!this.state.locationsLoaded}>
							Delete all saved positions
						</Button>
					</View>
					<View style={styles.posButtons}>
						<Button style={{ ...styles.smallButton, fontWeight: 'bold' }} disabled={!this.state.locationsLoaded}>
							Open Map
						</Button>
						<Button style={styles.smallButton} disabled={!this.state.locationsLoaded}>
							Select all
						</Button>
					</View>
				</View>
				{this.state.locationsLoaded ? (
					<FlatList
						style={styles.list}
						data={this.state.locations}
						keyExtractor={item => item.key}
						renderItem={({ item, index }) => <LocationElement locationData={item} />}
						/* onRefresh={this.refresh}
						refreshing={this.state.refreshing} */
					/>
				) : (
					<ActivityIndicator size="large" color="#000000" />
				)}
			</View>
		)
	}
}

export default LocationList
