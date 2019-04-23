var app = new Vue({
  el: '#app',

	data: {
		entries: [],
	},
	created(){
		this.getItems();
	},
	methods: {
		async getItems() {
			try {
				let response = await axios.get("/api/entries");
				this.entries = response.data;
				return true;
			} catch (error) {
				console.log(error);
			}
		},
	}

});
