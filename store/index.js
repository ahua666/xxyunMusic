import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const store = new Vuex.Store({
	state: {
		searchword: '隔壁老樊',
		ceshi: '',
		playlist:'',
		songlist:''
	},
	actions: {

	},
	mutations: {
		getsearchstate: function(state, e) {
			state.searchword = this.e
		}
	}
})
export default store;
