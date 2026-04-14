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
            position: 'absolute',
            elevation: 0,
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
          listeners={({ navigation }) => ({
            tabPress: _e => {
              navigation.navigate('MapScreen', { reset: Date.now() });
            },
          })}
          options={{
            tabBarLabel: 'MAP',
            tabBarIcon: () => {
              null;
            },
            tabBarItemStyle: {
              borderRadius: 25,
              overflow: 'hidden',
              alignSelf: 'center',
              backgroundColor: 'transparent',
            },
            tabBarLabelStyle: {
              position: 'absolute',
              marginStart: 0,
              marginEnd: 0,
              fontSize: 16,
              fontWeight: 'bold',
            },
            tabBarActiveTintColor: '#FFFFFF',
            tabBarInactiveTintColor: '#FFFFFF',
            tabBarActiveBackgroundColor: '#2b659b',
            tabBarInactiveBackgroundColor: '#7da9d1',
          }}
        />
        <Tabs.Screen
          name="SearchScreen"
          component={SearchScreen}
          listeners={({ navigation }) => ({
            tabPress: _e => {
              navigation.navigate('SearchScreen', { reset: Date.now() });
            },
          })}
          options={{
            tabBarLabel: 'SEARCH',
            tabBarIcon: () => null,
            tabBarItemStyle: {
              borderRadius: 25,
              overflow: 'hidden',
              alignSelf: 'center',
              backgroundColor: 'transparent',
            },
            tabBarLabelStyle: {
              position: 'absolute',
              marginStart: 0,
              marginEnd: 0,
              fontSize: 16,
              fontWeight: 'bold',
            },

            tabBarActiveTintColor: '#FFFFFF',
            tabBarInactiveTintColor: '#FFFFFF',
            tabBarActiveBackgroundColor: '#2b659b',
            tabBarInactiveBackgroundColor: '#7da9d1',
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
