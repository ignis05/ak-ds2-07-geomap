import React, { Component } from 'react'
import { View, Text, StyleSheet, ActivityIndicator, AsyncStorage, FlatList, Switch, Alert } from 'react-native'
import * as Permissions from 'expo-permissions'
import * as Location from 'expo-location'
import Button from '../components/Button'
import LocationElement from '../components/LocationElement'
import { TouchableOpacity } from 'react-native-gesture-handler'

const styles = StyleSheet.create({
	wrapper: { flex: 1, paddingTop: 10 },
	bigButton: { fontSize: 24, width: '50%', textAlign: 'center', fontWeight: 'bold' },
	smallButton: { fontSize: 20, width: '30%', textAlign: 'center', display: 'flex' },
	buttonsWrapper: { width: '100%' },
	posButtons: { width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', marginBottom: 20 },
	posButtons2: { width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly' },
	buttonsWrapper: { marginBottom: 20 },
})

class LocationList extends Component {
	static navigationOptions = {
		title: 'locations',
		headerStyle: {
			backgroundColor: '#2B79C2',
		},
		headerTitleStyle: {
			color: '#000000',
		},
	}

	constructor(props) {
		super(props)
		this.state = { locations: [], loading: false, locationsLoaded: false }

		this.saveLocation = this.saveLocation.bind(this)
		this.deleteLocations = this.deleteLocations.bind(this)
		this.openMap = this.openMap.bind(this)
		this.switchHandler = this.switchHandler.bind(this)
		this.selectAll = this.selectAll.bind(this)
	}

	selectAll() {
		if (this.state.locations.length < 1) return
		let temp = Object.assign([], this.state.locations)
		let deselect = this.state.locations.every(loc => loc.selected)
		temp.map(loc => {
			loc.selected = !deselect
			return loc
		})
		this.setState({ locations: temp })
	}

	openMap() {
		this.props.navigation.navigate('map', { markers: this.state.locations.filter(loc => loc.selected) })
	}

	async saveLocation() {
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
		Alert.alert('Delete all locations', 'This operation will delete all saved locations.\nProceed?', [
			{
				text: 'Cancel',
				onPress: () => {},
				style: 'cancel',
			},
			{
				text: 'OK',
				onPress: () => {
					this.setState({ loading: true }, async () => {
						let keys = await AsyncStorage.getAllKeys()
						await AsyncStorage.multiRemove(keys)
						this.setState({ locations: [], loading: false })
					})
				},
			},
		])
	}

	switchHandler(key, value) {
		console.log(key, value)
		let temp = Object.assign([], this.state.locations)
		let i = temp.findIndex(loc => loc.key == key)
		temp[i].selected = value
		this.setState({ locations: temp })
	}

	loadLocations() {
		return new Promise(async res => {
			let keys = await AsyncStorage.getAllKeys()
			let stores = await AsyncStorage.multiGet(keys)
			let data = stores.map((result, i, store) => {
				let key = store[i][0]
				let value = JSON.parse(store[i][1])
				return { key: key, value: value, selected: false }
			})
			this.setState({ locations: data, locationsLoaded: true }, () => {
				res('done')
			})
		})
	}

	render() {
		console.log(this.state.locations)
		if (this.state.loading) {
			return (
				<View style={[styles.wrapper, { justifyContent: 'center', alignItems: 'center' }]}>
					<Text style={{ textAlign: 'center', fontSize: 40 }}>Saving current location</Text>
					<ActivityIndicator size="large" color="#000000" style={{ paddingBottom: 40, marginTop: 20 }} />
				</View>
			)
		}
		return (
			<View style={styles.wrapper}>
				<View style={styles.buttonsWrapper}>
					<View style={styles.posButtons}>
						<Button onTouch={this.openMap} style={styles.bigButton} disabled={!this.state.locationsLoaded}>
							Open Map
						</Button>
					</View>
					<View style={styles.posButtons2}>
						<Button onTouch={this.saveLocation} style={styles.smallButton} disabled={!this.state.locationsLoaded}>
							Save current location
						</Button>
						<Button onTouch={this.deleteLocations} style={styles.smallButton} disabled={!this.state.locationsLoaded}>
							Delete all saved locations
						</Button>
						<View style={styles.smallButton}>
							<TouchableOpacity onPress={this.selectAll}>
								<Text style={[styles.smallButton, { width: '100%' }]}>Select all locations</Text>
								<View style={{ width: '100%', alignItems: 'center', justifyContent: 'center' }}>
									<Switch
										value={this.state.locations.length > 0 && this.state.locations.every(loc => loc.selected)}
										onChange={this.selectAll}
										disabled={!this.state.locationsLoaded}
									/>
								</View>
							</TouchableOpacity>
						</View>
					</View>
				</View>
				{this.state.locationsLoaded ? (
					<FlatList
						style={styles.list}
						data={this.state.locations}
						keyExtractor={item => item.key}
						renderItem={({ item, index }) => <LocationElement locationData={item} callback={this.switchHandler} />}
					/>
				) : (
					<ActivityIndicator size="large" color="#000000" />
				)}
			</View>
		)
	}
}

export default LocationList
