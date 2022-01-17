<template>
	<view>
		<view>
			<view>
				<view class="bang" :style="{'background-image':'url('+ coverImgUrl +')'}"></view>
				<view class="play-form">
					<image :src="coverImgUrl" class="playimg"></image>
					<view class="list-bangname">{{bangname}}</view>
					<image :src="bangimg" class="list-bangimg"></image>
					<view class="list-name">{{listname}}</view>
					<view class="list-description">{{description}}</view>
					<button class="list-but cu-btn   bg-gray round lg shadow" @click="onShareAppMessage"
						open-type="share">分享给微信好友</button>
				</view>
				<view class="playlist-list">
					<image class="playico" src="../../../static/播放2.png"></image>
					<view class="playbtn">播放全部</view>
					<view class="playbtns">(共{{songlist.length}}首)</view>
					<view class="item">
						<view class="item-i" v-for="(items,index) in songlist" :key="index"
							@click="goSongPlayer(items)">
							<view class="item-index" :class="index <3 ? 'index_top':'index_b'"> {{indexs[index]}}</view>
							<view class="item-name" v-html="items.name"></view>
							<view class="item-arname" v-html="items.ar[0].name+' - '+items.al.name"></view>
						</view>
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

	export default {
		//对全局变量进行监控
		computed: mapState(['playlist']),
		onShareAppMessage(res) {
			if (res.from === 'button') { // 来自页面内分享按钮
				console.log(res.target)
			}
			return {
				title: '星星云音乐',
				path: '/pages/index/index'
			}
		},
		data() {
			return {
				coverImgUrl: '',
				listname: '网易云',
				bangname: '',
				bangimg: '',
				description: '',
				songlist: '',
				indexs: [],
			}
		},
		methods: {
			getPlaylist(id) {
				this.request("/playlist/detail", "GET", {
					id: id,
				}).then((res) => {
					console.log(res.playlist.creator.avatarUrl); //获取歌单创建者头像
					this.bangimg = res.playlist.creator.avatarUrl;
					this.description = res.playlist.description; //歌单描述
					this.listname = res.playlist.creator.nickname; //获取歌单创建者昵称
					this.songlist = res.playlist.tracks; //歌单列表
					console.log(this.songlist);
					console.log(this.songlist.length)
					// console.log(this.songlist[99].al.name)
				});
			},
			goSongPlayer(e) {
				console.log(e.id);
				console.log(e.name)
				console.log(e.ar[0].name)
				this.request("/song/url", "GET", {
					id: e.id,
				}).then((res) => {
					console.log(res.data[0].url);
					this.request("/song/detail", "GET", {
						ids: e.id
					}).then((res) => {

						console.log(res.songs[0].al.picUrl);
						bgAudioManager.coverImgUrl = res.songs[0].al.picUrl;
					});
					const bgAudioManager = uni.getBackgroundAudioManager();
					if (res.data[0].url) {
						bgAudioManager.src = res.data[0].url;
						bgAudioManager.title = e.name;
						bgAudioManager.singer = e.ar[0].name; //e.artists[0].name;
						// console.log(e.artists[0].name)
					} else {
						// this.modalName = "Modal"
					}
				});
			}
		},
		onLoad() {
			for (var i = 1; i < 101; i++) {
				if (i < 10) {
					this.indexs.push('0' + i)
				} else {
					this.indexs.push(i)
				}
			}

			console.log(this.$store.state.playlist);
			if (this.$store.state.playlist.coverImgUrl) {
				this.coverImgUrl = this.$store.state.playlist.coverImgUrl;
			}
			if (this.$store.state.playlist.name) {
				this.bangname = this.$store.state.playlist.name;
			}
			console.log(this.coverImgUrl)
			console.log(this.$store.state.playlist.id);
			this.getPlaylist(this.$store.state.playlist.id)
		}
	}
</script>

<style>
	page {
		background-color: #FFFFFF;
	}

	.index_top {
		color: #C33;
	}

	.index_b {
		color: #bababa;
	}

	.item-i {
		height: 80rpx;
		margin: 20px 0px 25px 0px;
	}

	.item-index {
		position: relative;
		left: -20rpx;
		width: 60rpx;
		text-align: center;

		top: 10px;
		/* height: 60rpx; */
	}

	/* .item-index:last-child{
		font-size: 20rpx;
		color: #007AFF;
	} */

	.item-name {
		position: relative;
		top: -30rpx;
		left: 60rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		width: 80%;
	}

	.item-arname {
		position: relative;
		top: -30rpx;
		left: 60rpx;
		font-size: 22rpx;
		color: #b9b9b9;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		width: 80%;
	}

	.item-alname {
		position: relative;
		top: -69rpx;
		font-size: 22rpx;
	}

	.item {
		/* position: absolute; */
		position: relative;
		z-index: 102;
		top: 100rpx;
		display: inline-block;
		left: 48rpx;
	}

	.playbtn {
		position: absolute;
		left: 100rpx;
		top: 42rpx;
		font-size: 32rpx;
		font-weight: 500;

	}

	.playbtns {
		position: absolute;
		left: 230rpx;
		top: 47rpx;
		font-size: 26rpx;
		font-weight: 500;
		color: #C0C0C0;
	}

	.playico {
		width: 50rpx;
		height: 50rpx;
		position: absolute;
		left: 35rpx;
		top: 40rpx;
	}

	.list-but {
		z-index: 100;
		position: absolute;
		top: 380rpx;
		left: 140rpx;
		background-color: rgba(255, 255, 255, .5);
		color: #FFFFFF;
		width: 500rpx;
		font-size: 26rpx;
	}

	/* 	button{
		    z-index: 100;
		    position: absolute;
		    color: white;
		    position: absolute;
			width: 400rpx;
		    top: 177px;
		    left: 110px;
		    font-size: 28rpx;
		    border-radius: 25px;
			cursor: pointer;
			display: inline-block;
			line-height: 40px;
			padding: 0 10px;
			color: white;
			background-color: #e1e1e1;
			border-image: linear-gradient(to left, #743ad5 0%, #d53a9d 100%);
			border-image-slice: 1;
			border: 2px solid #e1e1e1;
			opacity: 0.5;
			clip-path: polygon(0 0, 12px 0, 12px 1px, 24px 1px, 24px 0, 100% 0, 100% 100%, 0 100%);
	} */
	.playlist-list {
		width: 100%;
		height: 1000px auto;
		background-color: #FFFFFF;
		z-index: 99;
		/* border:solid 1px #007AFF; */
		position: absolute;
		top: 500rpx;
		border-radius: 25px;
	}

	.list-description {
		width: 380rpx;
		height: 60rpx;
		position: absolute;
		left: 330rpx;
		top: 200rpx;
		z-index: 99;
		color: #dfdfdf;
		font-size: 20rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: initial;
		z-index: 99;
	}

	.list-bangimg {
		border-radius: 50%;
		width: 50rpx;
		height: 50rpx;
		position: absolute;
		left: 330rpx;
		top: 130rpx;
		z-index: 99;
	}

	.list-bangname {
		width: 250rpx;
		height: 250rpx;
		position: absolute;
		left: 330rpx;
		top: 55rpx;
		z-index: 99;
		color: #eeeeee;
		font-size: 40rpx;
		font-weight: 600;
	}

	.list-name {
		width: 250rpx;
		height: 250rpx;
		position: absolute;
		left: 390rpx;
		top: 135rpx;
		z-index: 99;
		color: #eeeeee;
		font-size: 28rpx;
	}

	.bang {
		height: 1000px;
		/* width: 2000px; */
		display: block;
		background-repeat: no-repeat;
		background-position: 0px 0px;
		background-repeat: no-repeat;
		background-position: center;
		background-size: cover;
		-webkit-filter: blur(15px);
		-moz-filter: blur(15px);
		-o-filter: blur(15px);
		-ms-filter: blur(15px);
		filter: blur(15px);
		z-index: 100;
	}

	.playimg {
		width: 250rpx;
		height: 250rpx;
		position: absolute;
		left: 40rpx;
		top: 50rpx;
		z-index: 99;
	}
</style>
