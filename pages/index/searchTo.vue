<template>
	<view class="content">
		<view class="cu-bar bg-white search fixed" :style="[{top:CustomBar + 'px'}]">
			<view class="search-form round">
				<text class="cuIcon-search"></text>
				<input type="text" placeholder="搜索歌曲" confirm-type="search" v-model="searchval" :value="searchval"
					@confirm="getSearch"></input>
			</view>
		</view>
		<view class="title">歌曲</view>
		<view class="item" v-for="(items, index) in songlist" :key="index">
			<view class="item_l" @click="goSongPlayer(items)">
				<view class="name" v-html="items.name"></view>
				<view class="text">
					<view style="position: relative;top: -20rpx;" v-html="items.artists[0].name"></view>
					<view
						style="position: relative;top: 0rpx; width: 400rpx; margin-left:5px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;"
						v-html="'- '+items.album.name"></view>
				</view>
				<!-- <image class="bofang" src="../../static/播放.png"></image> -->
			</view>
			<!-- 暂未美化UI 下次再美化, -->
		</view>
		<view class="cu-modal" :class="modalName=='Modal'?'show':''" @tap="hideModal">
			<view class="cu-dialog" style="background-color:#FFFFFF">
				<view class="cu-bar justify-end">
					<view class="content" style="">星星提醒您</view>
					<!-- <view class="actionsss" style="float: right;position: relative;right: -95px;top: 0px;" @tap="hideModal"> -->
					<!-- <text class="cuIcon-close text-red"></text> -->
					<!-- </view> -->
				</view>
				<view class="padding-xl">
					获取歌曲URL失败
				</view>
			</view>
		</view>
	</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations //导入mapState方法
	} from 'vuex';
	// const innerAudioContext = uni.createInnerAudioContext();
	// innerAudioContext.autoplay = true;
	//普通播放音频方法 不适合后台播放 切后台会直接销毁
	export default {
		data() {
			return {
				keywords: '',
				songlist: [],
				songlistDetail: [],
				ids: '',
				searchval: '',
				CustomBar: '',
				modalName: '',

			}
		},
		//对全局变量进行监控
		computed: mapState(['searchword']),
		onLoad() {
			this.searchval = this.searchword
			//页面加载的时候
			//console.log(this.searchword)
			this.getsearchkeywords(this.searchword);
		},
		methods: {
			getsearchkeywords(searchword) {
				this.request("/search", "GET", {
					keywords: searchword,
				}).then((res) => {
					console.log(res.result.songs);
					this.songlist = res.result.songs;
					console.log(this.songlist);
					var songlists = this.songlist;
					songlists.map((item, index) => {
						console.log('item', item)
						if (this.searchval && this.searchval.length > 0) {
							// 匹配关键字正则
							let replaceReg = new RegExp(this.searchval, 'g')
							// 高亮替换v-html值
							let replaceString =
								'<span style=\"color:#E54D42;\">' + this
								.searchval + '</span>'
							songlists[index].name = item.name.replace(
								replaceReg,
								replaceString
							)
							songlists[index].album.name = item.album.name.replace(
								replaceReg,
								replaceString
							)
							songlists[index].artists[0].name = item.artists[0].name.replace(
								replaceReg,
								replaceString
							)
						}
					})
					this.songlist = songlists;
					console.log(this.songlist)
				});
			},
			showModal(e) {
				this.modalName = e.currentTarget.dataset.target
			},
			hideModal(e) {
				this.modalName = null
			},
			getSearch: function() {
				// this.searchword=this.searchval
				this.$store.state.searchword = this.searchval;
				//页面加载的时候
				//console.log(this.searchword)
				this.request("/search", "GET", {
					keywords: this.searchval,
				}).then((res) => {
					console.log(res.result.songs);
					this.songlist = res.result.songs;
					console.log(this.songlist);
					var songlists = this.songlist;
					songlists.map((item, index) => {
						console.log('item', item)
						if (this.searchval && this.searchval.length > 0) {
							// 匹配关键字正则
							let replaceReg = new RegExp(this.searchval, 'g')
							// 高亮替换v-html值
							let replaceString =
								'<span style=\"color:#E54D42;\">' + this
								.searchval + '</span>'
							songlists[index].name = item.name.replace(
								replaceReg,
								replaceString
							)
							songlists[index].album.name = item.album.name.replace(
								replaceReg,
								replaceString
							)
							songlists[index].artists[0].name = item.artists[0].name.replace(
								replaceReg,
								replaceString
							)
						}
					})
					this.songlist = songlists;
					console.log(this.songlist)
				});
			},
			changeColor: function(resultsList) {
				console.log(1)
				resultsList.map((items, index) => {
					console.log('items', item)
				})
				this.songlist = songlist
			},
			goSongPlayer: function(e) {
				console.log(e.id)
				this.request("/song/url", "GET", {
					id: e.id
				}).then((res) => {
					console.log(res);
					console.log(res.data[0].url);
					// innerAudioContext.src = res.data.data[0].url;
					// innerAudioContext.onPlay(() => {
					//   console.log('开始播放');
					// });
					// innerAudioContext.onError((res) => {
					//   console.log(res.errMsg);
					//   console.log(res.errCode);
					// });
					//上面是普通播放
					//下面是背景播放 可以后台播放音乐 最小化小程序仍然会播放
					//暂未美化UI 只做测试
					this.request("/song/detail", "GET", {
						ids: e.id
					}).then((res) => {
						console.log(res.songs[0].al.picUrl);
						bgAudioManager.coverImgUrl = res.songs[0].al.picUrl;
					});
					let c = e
					let names;
					let singer;
					const bgAudioManager = uni.getBackgroundAudioManager();
					let replaceReg = new RegExp('<span style=\"color:#E54D42;\">' + this.searchval +
						'</span>', 'g')
					let replaceString = this.searchval
					names = c.name.replace(
						replaceReg,
						replaceString
					)
					singer = c.artists[0].name.replace(
						replaceReg,
						replaceString
					)
					//items.album.name
					if (res.data[0].url) {
						bgAudioManager.src = res.data[0].url;
						bgAudioManager.title = names;
						bgAudioManager.singer = singer; //e.artists[0].name;
						console.log(e.artists[0].name)
					} else {
						this.modalName = "Modal"
					}
				});
			}
		}
	}
</script>

<style>
	.bofang {
		width: 60rpx;
		height: 60rpx;
		float: left;
		position: relative;
		top: -30rpx;
		right: -120rpx;
	}

	.search_hot {
		box-sizing: border-box;
		width: 100%;
		padding: 0 5%;
		position: relative;
		top: 100rpx;
		background-color: #FFFFFF;
	}

	.cu-bar {
		padding-top: 10px;
	}

	.search_hot .title {
		height: 120rpx;
		line-height: 120rpx;
		font-size: 30rpx;
	}

	.title {
		height: 120rpx;
		line-height: 120rpx;
		font-size: 30rpx;
		margin-left: 35rpx;
	}

	.content {
		background-color: #FFFFFF;
	}

	view {
		display: inline-block;
	}

	.item {
		box-sizing: border-box;
		display: inline-block;
		width: 100%;
		padding: 0 5%;
		/* height: 90px; */
		/* margin-bottom: 20px; */
	}

	.item .item_l {
		float: left;
		width: 100%;
		overflow: hidden;
		border-bottom: 0.1px solid #CCCCCC;
		margin-top: 10px;
	}

	.item_l .name {
		width: 80%;
		/* height: 60px; */
		/* line-height: 60px; */
		font-size: 30rpx;
		font-weight: bold;
		/* overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap; */
	}

	.item_l .text {
		height: 30px;
		line-height: 30px;
		font-size: 20rpx;
		float: left;
		color: #CCCCCC;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.item_r {
		float: right;
		height: 90px;
		line-height: 90px;

	}
</style>
