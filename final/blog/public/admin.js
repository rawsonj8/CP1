var app = new Vue({
  el: '#app',

	data: {
		entries: [],
    addItem: null,
		author: "",
		title: "",
		entry: "",
	},
	created(){
		this.getItems();
	},
  computed: {
    suggestions() {
      return this.items.filter(item => item.title.toLowerCase().startsWith(this.findTitle.toLowerCase()));
    }
  },
	methods: {
    selectItem(item) {
     this.findTitle = "";
     this.findItem = item;
   },


    async getItems() {
  try {
    let response = await axios.get("/api/entries");
    this.items = response.data;
    return true;
  } catch (error) {
    console.log(error);
  }
},
      fileChanged(event) {
        this.file = event.target.files[0]
      },
      async upload() {
        try {
          let r2 = await axios.post('/api/entries', {
            title: this.title,
            author: this.author,
            entry: this.entry
          });
          this.addItem = r2.data;
        } catch (error) {
          console.log(error);
        }
      },
    }
});
