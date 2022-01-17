<template>
	<view class="content">
		<view class="cu-bar bg-white search fixed" :style="[{top:CustomBar + 'px'}]">
			<view class="search-form round">
				<text class="cuIcon-search"></text>
				<input type="text" placeholder="搜索歌曲" confirm-type="search" v-model="searchval" :value="searchval"
					@confirm="getSearch"></input>
			</view>
		</view>
		<view class="search_hot">
			<view class="title">热搜榜</view>
			<view class="ul">
				<view class="li" v-for="(item, index) in searchHotList" @click="getSearchs(item.searchWord)"
					:key="index">
					<view class="li_l" :class="index<3 ? 'index_top':''">
						{{index+1}}
					</view>
					<view class="li_r">
						<view class="title">
							<view class="name">{{item.searchWord}}</view>
							<view class="num">{{item.score}}</view>
						</view>
						<view class="text">
							{{item.content}}
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
		computed: mapState(['searchword']),

		name: 'search',
		// searchval:'',
		data() {
			return {
				searchHotList: [],
				CustomBar: this.CustomBar,
				searchval: '',
			}
		},
		onLoad() {
			this.getsearchhot();//获取热搜排行
		},
		methods: {
			...mapMutations(['getsearchstate']), //映射vuex里面的方法
			getsearchhot(){
				this.request("/search/hot/detail", "GET", {
					
				}).then((res) => {
					console.log(res.data);
					console.log(this.searchword);
					this.searchHotList = res.data
				});
			},
			getSearch: function() {
				console.log(this.searchval);
				this.$store.state.searchword=this.searchval;
				uni.navigateTo({
					// url: 'test?id=1&name=uniapp'  c传递参数
					url: "/pages/index/searchTo"
				})
			},
			getSearchs: function(e) {
				console.log(e)
				this.$store.state.searchword=e;
				uni.navigateTo({
					// url: 'test?id=1&name=uniapp'  c传递参数
					url: "/pages/index/searchTo"
				})
			},
			getto: function(e) {
				uni.navigateTo({
					// url: 'test?id=1&name=uniapp'  c传递参数
					url: "/pages/index/searchTo"
				})
			}
		}

	}
</script>

<style>
	.content {
		background-color: #FFFFFF;
	}
	.search_hot {
		box-sizing: border-box;
		width: 100%;
		padding: 0 5%;
		position: relative;
		top: 100rpx;
		background-color: #FFFFFF;
	}

	.search_hot .title {
		height: 120rpx;
		line-height: 120rpx;
		font-size: 30rpx;
	}

	.ul .li {
		display: inline-block;
		width: 100%;
		height: 150rpx;
		/* margin-bottom: 10rpx; */
	}

	.ul .li .li_l {
		float: left;
		width: 80rpx;
		height: 80rpx;
		line-height: 60rpx;
		text-align: left;
		font-size: 30rpx;
		font-weight: bold;
		margin-top: 20rpx;
	}

	.li_r {
		float: left;
		width: 80%;
	}

	.li_r .title {
		width: 100%;
		height: 60rpx;
		line-height: 50rpx;

	}

	.li_r .title .name {
		font-size: 35rpx;
		font-weight: bold;
	}

	.li_r .title .num {
		font-size: 24rpx;
		color: #808080;
		width: 80rpx;
		height: 60rpx;
		float: right;
		margin-left: 50rpx;
		position: relative;
		top: -20rpx;
		right: -45rpx;
	}

	.li_r .text {
		height: 60rpx;
		/* line-height:60rpx; */
		font-size: 24rpx;
		color: #808080;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	uni-page-body {
		background: #FFFFFF;
	}
	/* 前三个数字高亮 */
	.index_top {
		color: #C33;
	}
</style>
