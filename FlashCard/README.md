# 时政闪卡 — 考公/考编刷题工具 MVP

面向考公/考编用户的时政刷卡学习工具，验证卡片式学习体验和付费意愿。

## 技术栈

- **前端**: Next.js 15 (App Router) + React 19 + TypeScript
- **样式**: Tailwind CSS
- **UI 组件**: shadcn/ui (Button, Card, Dialog, Progress)
- **数据库**: Prisma + SQLite（本地开发，保留 Prisma 结构便于后续切 PostgreSQL）
- **图标**: lucide-react

## 快速开始

### 前置要求

- Node.js 18+
- npm 或 yarn

### 安装与启动

```bash
# 1. 安装依赖
npm install

# 2. 初始化数据库并运行迁移
npx prisma migrate dev --name init

# 3. 导入种子数据（20张时政卡片 + 1个测试用户）
npx prisma db seed

# 4. 启动开发服务器
npm run dev
```

浏览器打开 [http://localhost:3000](http://localhost:3000) 即可使用。

## 项目结构

```
├── prisma/
│   ├── schema.prisma        # 数据模型定义
│   ├── seed.ts              # 种子数据（20张时政卡片）
│   └── dev.db               # SQLite 数据库文件（运行迁移后生成）
├── src/
│   ├── app/
│   │   ├── layout.tsx       # 根布局（含底部导航栏）
│   │   ├── page.tsx         # 首页
│   │   ├── globals.css      # 全局样式 + 翻转动画
│   │   ├── study/
│   │   │   └── page.tsx     # 刷卡学习页
│   │   ├── mistakes/
│   │   │   └── page.tsx     # 错题本
│   │   ├── vip/
│   │   │   └── page.tsx     # 会员页
│   │   ├── stats/
│   │   │   └── page.tsx     # 学习统计
│   │   └── api/
│   │       ├── review/
│   │       │   ├── today/route.ts    # 获取今日待复习卡片
│   │       │   └── submit/route.ts   # 提交复习结果（含限额检查）
│   │       ├── cards/[id]/route.ts   # 获取单张卡片详情
│   │       ├── mistakes/route.ts     # 获取错题列表
│   │       ├── stats/route.ts        # 获取学习统计
│   │       ├── user/vip/route.ts     # 获取VIP状态
│   │       └── payment/create/route.ts # Mock支付
│   ├── components/
│   │   ├── FlashCard.tsx     # 卡片翻转组件（CSS 3D transform）
│   │   ├── ProgressBar.tsx   # 进度条组件
│   │   ├── NavBar.tsx        # 底部导航栏
│   │   └── ui/               # shadcn/ui 组件
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── dialog.tsx
│   │       └── progress.tsx
│   └── lib/
│       ├── prisma.ts         # Prisma 客户端单例
│       ├── sm2.ts            # 简化版 SM-2 间隔重复算法
│       ├── mock-user.ts      # Mock 用户常量
│       └── utils.ts          # cn() 工具函数
├── package.json
├── tailwind.config.ts
├── tsconfig.json
├── next.config.js
└── README.md
```

## 功能说明

### 首页 `/`
- 展示今日待刷数量、连续打卡天数、正确率
- 今日完成进度条（免费用户每日上限30张）
- "开始学习"按钮进入刷卡页
- "复习错题"快捷入口

### 刷卡页 `/study`
- 卡片正面显示问题，点击翻转查看答案和解析
- CSS 3D 翻转动画
- 两个操作按钮：「记住了」「没记住」
- 提交后自动进入下一张
- 非VIP用户每日限制30张，达上限后引导开通会员
- 支持错题模式：`/study?mode=mistakes`

### 错题本 `/mistakes`
- 展示所有"没记住"的卡片列表
- 点击查看详情（弹窗）
- 一键进入错题复习模式

### 会员页 `/vip`
- 免费版 vs 会员版功能对比
- 价格：¥9.9/月
- Mock支付：点击即模拟支付成功，更新VIP状态

### 学习统计 `/stats`
- 总学习数、正确率、连续打卡天数
- 最近7天学习柱状图
- 每日详情列表

## 复习逻辑（简化版 SM-2）

- **记住了** (rating=4)：间隔拉长：1天 → 3天 → 7天
- **没记住** (rating=1)：10分钟后重新出现

## 种子数据

包含20张2026年广东时政真题卡片，涵盖政治、经济、文化、社会、党建等类别。

Mock 用户：
- mockId: `mock-user-001`
- 昵称: `测试用户`
- 非VIP

## 注意事项

- 本项目为MVP版本，不接真实微信登录、真实支付、真实AI接口
- 所有支付为 Mock，点击即激活会员
- SQLite 用于本地开发，Prisma 结构保留，便于后续迁移至 PostgreSQL
- 移动端优先设计，适配手机屏幕
