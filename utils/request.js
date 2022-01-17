//封装uniApp 网络请求
//在请求的时候有遮蔽效果
// 功能明确
export default (url, method = "GET", data = {}) => {
  //请求时遮蔽出现遮蔽效果
  uni.showLoading({
    title: "拼命加载中...",
  });
  return new Promise((resolve, reject) => {
    uni.request({
      url: "https://netease-music-api.fe-mm.com" + url,
      method: method,
      data,
      success: (res) => {
        resolve(res.data);
      },
      fail: (err) => {
        reject(err);
      },
      // 请求完成
      complete: () => {
        uni.hideLoading(); //请求完成之后遮蔽隐藏
      },
    });
  });
};
