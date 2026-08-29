<script>
export default {
  onLaunch() {
    console.log('ACG周边商城启动')
  }
}
</script>

<style>
page {
  background-color: #F5F5F5;
  font-family: -apple-system, BlinkMacSystemFont, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  font-size: 28rpx;
  color: #1A1A1A;
  box-sizing: border-box;
}

view, text, image, navigator {
  box-sizing: border-box;
}

button::after {
  border: none;
}

button {
  padding: 0;
  margin: 0;
  background: none;
  line-height: inherit;
  font-size: inherit;
}

image {
  display: block;
}

.text-ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.text-ellipsis-2 {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.safe-area-bottom {
  padding-bottom: env(safe-area-inset-bottom);
}
</style>
