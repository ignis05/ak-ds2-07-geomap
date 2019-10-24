import { createStackNavigator, createAppContainer } from 'react-navigation'
import MainScreen from './screens/MainScreen'
import LocationList from './screens/LocationList'
import MapScreen from './screens/MapScreen'

const Root = createStackNavigator({
	locations: { screen: LocationList },
	map: { screen: MapScreen },
	main: { screen: MainScreen },
})

const App = createAppContainer(Root)

export default App
