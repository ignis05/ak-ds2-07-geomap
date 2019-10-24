import { createStackNavigator, createAppContainer } from 'react-navigation'
import MainScreen from './screens/MainScreen'
import LocationList from './screens/LocationList'
import MapView from './screens/MapView'

const Root = createStackNavigator({
	main: { screen: MainScreen },
	locations: { screen: LocationList },
	map: { screen: MapView },
})

const App = createAppContainer(Root)

export default App
