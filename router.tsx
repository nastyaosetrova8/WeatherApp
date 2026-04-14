import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MapScreen from './Screens/MapScreen';
import SearchScreen from './Screens/SearchScreen';

const AppStack = createStackNavigator();
const Tabs = createBottomTabNavigator();

function TabNavigator() {
  return (
    <>
      <Tabs.Navigator
        initialRouteName="MapScreen"
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: true,
          tabBarLabelPosition: 'beside-icon',
          tabBarLabelStyle: {
            fontSize: 14,
            fontWeight: 'bold',
            textTransform: 'uppercase',
          },
          tabBarStyle: {
            // position: 'absolute',
            // bottom: 25,
            // left: 20,
            // right: 20,
            // elevation: 0,
            backgroundColor: 'transparent',
            borderColor: 'transparent',
            borderTopWidth: 0,
            height: 60,
          },
        }}
      >
        <Tabs.Screen
          name="MapScreen"
          component={MapScreen}
          options={{
            tabBarLabel: 'MAP',
            tabBarIcon: () => {
              null;
            },
            tabBarLabelStyle: {
              position: 'absolute',
              marginStart: 0,
              marginEnd: 0,
              fontSize: 16,
              fontWeight: 'bold',
            },
            tabBarItemStyle: {
              borderRadius: 25,
              overflow: 'hidden',
              alignSelf: 'center',
              backgroundColor: 'transparent',
            },
            tabBarActiveTintColor: '#FFFFFF',
            tabBarInactiveTintColor: '#212121',
            tabBarActiveBackgroundColor: '#3478D7',
            tabBarInactiveBackgroundColor: '#A1C4FD',
          }}
        />
        <Tabs.Screen
          name="SearchScreen"
          component={SearchScreen}
          // listeners={({ navigation }) => ({
          //   tabPress: e => {
          //     navigation.navigate('SearchScreen', { reset: Date.now() });
          //   },
          // })}
          options={{
            tabBarLabel: 'SEARCH',
            tabBarIcon: () => null,
            tabBarLabelStyle: {
              position: 'absolute',
              marginStart: 0,
              marginEnd: 0,
              fontSize: 16,
              fontWeight: 'bold',
            },
            tabBarItemStyle: {
              borderRadius: 25,
              overflow: 'hidden',
              alignSelf: 'center',
              backgroundColor: 'transparent',
            },
            tabBarActiveTintColor: '#FFFFFF',
            tabBarInactiveTintColor: '#212121',
            tabBarActiveBackgroundColor: '#3478D7',
            tabBarInactiveBackgroundColor: '#A1C4FD',
          }}
        />
      </Tabs.Navigator>
    </>
  );
}

export const useRoute = () => {
  return (
    <>
      <AppStack.Navigator initialRouteName="TabNavigator">
        <AppStack.Screen
          name="TabNavigator"
          component={TabNavigator}
          options={{
            headerShown: false,
          }}
        />
      </AppStack.Navigator>
    </>
  );
};
