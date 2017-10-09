function MainCtrl(CacheSvc, OverlaySvc, $state) {
	OverlaySvc.off('loading');

	this.start = async function () {
		OverlaySvc.on('loading');
		// 캐싱 우선
		let when = CacheSvc.get('get_calendar');
		let where = CacheSvc.get('get_place');
		let lang = CacheSvc.get('get_language');
		let theme = CacheSvc.get('get_theme');
		let comment = CacheSvc.get('get_tour_comment');
		await when;
		await where;
		await lang;
		await theme;
		await comment;

		// 끗
		console.log('done!');
		await $state.go('when');
		OverlaySvc.off('loading');
	};
}
MainCtrl.$inject = ['CacheSvc', 'OverlaySvc', '$state'];

export default angular.module('touriends.page.main', ['touriends']).controller('MainCtrl', MainCtrl).name;
