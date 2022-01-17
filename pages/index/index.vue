<template>
	<view>
		<view class="cu-bar bg-white search fixed" :style="[{top:CustomBar + 'px'}]">
			<view class="search-form round">
				<text class="cuIcon-search"></text>
				<input type="text" placeholder="搜索歌曲" confirm-type="search" @tap="getto"></input>
			</view>
		</view>

		<swiper class="card-swiper" :class="dotStyle?'square-dot':'round-dot'" :indicator-dots="true" :circular="true"
			:autoplay="true" interval="5000" duration="500" @change="cardSwiper" indicator-color="#8799a3"
			indicator-active-color="#0081ff">
			<swiper-item v-for="(item,index) in swiperList" :key="index" :class="cardCur==index?'cur':''">
				<view class="swiper-item">
					<image :src="item.url" mode="aspectFill" v-if="item.type=='image'"></image>
					<video :src="item.url" autoplay loop muted :show-play-btn="false" :controls="false"
						objectFit="cover" v-if="item.type=='video'"></video>
				</view>
			</swiper-item>
		</swiper>

		<view class="ul">
			<view class="items" v-for="(items,index) in list1" :key="index" @tap="clicklist(items)">
				<view class="img">
					<img :src="items.coverImgUrl" alt="">
				</view>
				<view class="text">
					<view>
						<view class="text_list" v-for="(t,i) in items.tracks" :key="i">
							{{i+1}}.{{t.first}}-{{t.second}}
						</view>
					</view>
				</view>
			</view>
		</view>
		<view v-model="tian">{{tian}}</view>
	</view>
</template>

<script>
	export default {
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
				PageCur: 'basics',
				value: '陈奕迅',
				tian: '',
				dylj: "",
				cardCur: 0,
				swiperList: [],
				dotStyle: false,
				towerStart: 0,
				direction: '',
				CustomBar: this.CustomBar,
				list1: [], //官方榜
				toplist: [],
				list2: [], //推荐榜
				list3: [], //全球版
				list4: [], //其他榜
				 listIndex: {},
			}
		},
		onLoad() {
			this.dotStyle = true;
			this.TowerSwiper('swiperList');
			// 初始化towerSwiper 传已有的数组名即可
			
			//获取首页轮播图
			this.gethomepage()
			//获取热门榜单
			this.gettoplist()
		},
		methods: {
			gettoplist() {
				this.request("/toplist/detail", "GET", {
				}).then((res) => {
					console.log(res)
					this.toplist = res.list
					var that = this
					var num = 0
					this.toplist.forEach(function(items, index) {
						var i = that.listIndex[items.name]
						items.listId = i
						if (items.tracks.length > 0) {
							that.list1.push(items)
							num += 1
						} else if (num < 10) {
							that.list2.push(items)
							num += 1
						} else if (num < 16) {
							that.list3.push(items)
							num += 1
						} else {
							that.list4.push(items)
							num += 1
						}
					});
				})},
			gethomepage() {
				this.request("/homepage/block/page", "GET", {}).then((res) => {
					for (var i = 0; i < 9; i++) {
						console.log(res.data.blocks[0].extInfo.banners[i].pic);
						this.swiperList.push({
							id: i,
							type: 'image',
							url: res.data.blocks[0].extInfo.banners[i].pic
						})
					}
				});
			},
			clicklist: function(index) {
				this.$store.state.playlist = index;
				uni.navigateTo({
					// url: 'test?id=1&name=uniapp'  c传递参数
					url: "/pages/index/playlist/playlist"
				})
			},
			getto: function(e) {
				uni.navigateTo({
					// url: 'test?id=1&name=uniapp'  c传递参数
					url: "/pages/index/search"

				})
			},
			NavChange: function(e) {
				this.PageCur = e.currentTarget.dataset.cur
			},

			DotStyle(e) {
				this.dotStyle = e.detail.value
			},
			// cardSwiper
			cardSwiper(e) {
				this.cardCur = e.detail.current
			},
			// towerSwiper
			// 初始化towerSwiper
			TowerSwiper(name) {
				let list = this[name];
				for (let i = 0; i < list.length; i++) {
					list[i].zIndex = parseInt(list.length / 2) + 1 - Math.abs(i - parseInt(list.length / 2))
					list[i].mLeft = i - parseInt(list.length / 2)
				}
				this.swiperList = list
			},

			// towerSwiper触摸开始
			TowerStart(e) {
				this.towerStart = e.touches[0].pageX
			},

			// towerSwiper计算方向
			TowerMove(e) {
				this.direction = e.touches[0].pageX - this.towerStart > 0 ? 'right' : 'left'
			},

			// towerSwiper计算滚动
			TowerEnd(e) {
				let direction = this.direction;
				let list = this.swiperList;
				if (direction == 'right') {
					let mLeft = list[0].mLeft;
					let zIndex = list[0].zIndex;
					for (let i = 1; i < this.swiperList.length; i++) {
						this.swiperList[i - 1].mLeft = this.swiperList[i].mLeft
						this.swiperList[i - 1].zIndex = this.swiperList[i].zIndex
					}
					this.swiperList[list.length - 1].mLeft = mLeft;
					this.swiperList[list.length - 1].zIndex = zIndex;
				} else {
					let mLeft = list[list.length - 1].mLeft;
					let zIndex = list[list.length - 1].zIndex;
					for (let i = this.swiperList.length - 1; i > 0; i--) {
						this.swiperList[i].mLeft = this.swiperList[i - 1].mLeft
						this.swiperList[i].zIndex = this.swiperList[i - 1].zIndex
					}
					this.swiperList[0].mLeft = mLeft;
					this.swiperList[0].zIndex = zIndex;
				}
				this.direction = ""
				this.swiperList = this.swiperList
			},
		}
	}
</script>

<style>
	page {
		background-color: #FFFFFF;
	}

	.tabbar {
		position: absolute;
		width: 100%;
		bottom: 0rpx;
	}

	.margin-bottom-xl {
		margin-bottom: 0rpx;
	}

	.screen-swiper {
		position: relative;
		top: 100rpx;
	}

	.tower-swiper .tower-item {
		transform: scale(calc(0.5 + var(--index) / 10));
		margin-left: calc(var(--left) * 100upx - 150upx);
		z-index: var(--index);
	}

	.card-swiper {
		position: relative;
		top: 100rpx;
	}

	.ul {
		position: relative;
		top: 100rpx;
		/* width: 700px; */
		margin: 0 auto;
	}

	.items {
		display: block;
		height: 200rpx;
		margin: 20rpx;
		margin-left: 60rpx;
	}

	.items:first {
		margin-top: 100rpx;
	}

	.items .img {
		float: left;
		width: 180rpx;
		height: 200rpx;
		overflow: hidden;
	}

	.items .img img {
		width: 100%;
		height: 100%;
		margin-top: 20rpx;
	}

	.text {
		box-sizing: border-box;
		float: left;
		width: 450rpx;
		height: 100%;
		padding-left: 20rpx;
		margin-top: 10rpx;
		color: #555555;
	}



	.text_list {
		width: 100%;
		height: 66rpx;
		line-height: 66rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.c2 {
		margin-top: 50rpx;
	}

	.title {
		width: 100%;
		height: 80rpx;
		line-height: 80rpx;
		padding-left: 10rpx;
	}
</style>
