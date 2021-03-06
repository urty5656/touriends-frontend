function MessageBox(OverlaySvc, $state, HttpSvc, ToastSvc) {
	this.datalist = [];

	this.getOther = function() {
		HttpSvc.request('showMessage').then((res) => {
			if (res.data.success) {
				this.datalist = res.data.box;
				this.new = res.data.new;
				console.log('showMessage', res.data);
				for (let i = 0; i < this.datalist.length; i++) {
					let other_id = parseInt(this.datalist[i].other);
					this.getOtherInfo(i, other_id);
				}
			}
			else {
				ToastSvc.toggle('No data');
			}
		});
	};
	this.getOther();

	this.getOtherInfo = function(i, other_id) {
		HttpSvc.request('otherInfo', {
			other: other_id
		}).then((res) => {
			if (res.data.success) {
				// console.log("data", other_id, res.data);
				let new_ck=false;
				for (let j=0; j<this.new.length; j++){
					if(this.new[j] == this.datalist[i].mid){
						new_ck = true;
					}
				}
				this.datalist[i] = {
					mid   : this.datalist[i].mid,
					other : this.datalist[i].other,
					new_ck : new_ck,
					url   : res.data.other_image,
					name  : res.data.other_name
				};
				// console.log('otherInfo', this.datalist);
			}
			else {
				console.log('no');
			}
		});
	};

	OverlaySvc.off('loading');

	this.go = function(stateName, idx) {
		if ($state.is(stateName)) {
			return;
		}
		OverlaySvc.on('loading');
		$state.go(stateName, {id: this.datalist[idx].other});
	}
}

MessageBox.$inject = ['OverlaySvc', '$state', 'HttpSvc', 'ToastSvc'];

export default angular.module('touriends.page.message-box', ['touriends']).controller('MessageBox', MessageBox).name;
