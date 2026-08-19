# Nocturne AI Social Sim

一个双模式 AI 社交模拟器原型：

- 模拟器：附近、XP 标签、视频、聊天、个人
- 现实世界：AI 记事、人际、个人属性、手机、地图
- 右上角系统配置：API Endpoint、世界观设定，自动保存到 `localStorage`
- 刷新按钮：重新生成本地模拟数据

## 启动

```bash
npm install
npm run dev
```

当前版本使用本地模拟数据，不会把任何内容发送到外部 API。填写 API Endpoint 只是为后续接入预留配置入口。
