import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create mock user
  await prisma.user.upsert({
    where: { mockId: "mock-user-001" },
    update: {},
    create: {
      mockId: "mock-user-001",
      nickname: "测试用户",
      isVip: false,
    },
  });

  // Seed 20 cards
  const cards = [
    {
      question: "2026文化强国建设高峰论坛在哪个城市开幕？",
      answer: "深圳",
      explanation: "李书磊发表主旨演讲，黄坤明致辞",
      source: "2026文化强国建设高峰论坛",
      category: "文化",
      province: "广东",
      publishDate: null,
    },
    {
      question: "2026年“5·19中国旅游日”主会场在广东哪个城市举行？",
      answer: "广州",
      explanation: "主题为“乐享品质旅游，共赴美好山河”",
      source: "2026年5·19中国旅游日主会场活动",
      category: "文化",
      province: "广东",
      publishDate: new Date("2026-05-19"),
    },
    {
      question: "广东省委工作务虚会于2026年5月几日召开?",
      answer: "5月27日",
      explanation: "黄坤明主持，推动“十五五”开好局起好步",
      source: "省委工作务虚会暨省委理论学习中心组学习会",
      category: "政治",
      province: "广东",
      publishDate: new Date("2026-05-27"),
    },
    {
      question: "2026年5月18日，广东省委常委会会议研究了什么主题的工作？",
      answer: "防灾减灾救灾",
      explanation: "传达学习总书记重要讲话精神，部署相关工作",
      source: "广东省委常委会会议",
      category: "政治",
      province: "广东",
      publishDate: new Date("2026-05-18"),
    },
    {
      question: "2026年5月12日黄坤明到广东哪个地市调研？",
      answer: "梅州市",
      explanation: "深入企业、镇村、国防教育基地考察",
      source: "黄坤明到梅州市调研",
      category: "政治",
      province: "广东",
      publishDate: new Date("2026-05-12"),
    },
    {
      question: "2026粤港澳大湾区论坛的主题是什么？",
      answer: "打造创新高地 建设一流湾区",
      explanation: "5月8日在广州举办，邹晓东等出席",
      source: "2026粤港澳大湾区论坛",
      category: "经济",
      province: "广东",
      publishDate: new Date("2026-05-08"),
    },
    {
      question: "广东辖区2026年上市公司高质量发展大会在哪召开？",
      answer: "广州",
      explanation: "400多家上市公司700多名高管参会",
      source: "广东辖区2026年上市公司高质量发展大会",
      category: "经济",
      province: "广东",
      publishDate: null,
    },
    {
      question: "2026年前4个月广东外贸进出口同比增长多少？",
      answer: "18.4%",
      explanation: "总值3.49万亿元，增速较全国快3.5个百分点",
      source: "广东省统计局前四月经济数据",
      category: "经济",
      province: "广东",
      publishDate: null,
    },
    {
      question: "2026年一季度广东GDP同比增长多少？",
      answer: "4.6%",
      explanation: "主要宏观指标增速回升，经济实现良好开局",
      source: "2026年一季度广东GDP数据",
      category: "经济",
      province: "广东",
      publishDate: null,
    },
    {
      question: "广东\"五一\"假期五天全省接待游客多少人次？",
      answer: "4706.9万人次",
      explanation: "旅游收入297.7亿元，同比增长0.9%",
      source: "广东省文化和旅游厅假期数据",
      category: "社会",
      province: "广东",
      publishDate: null,
    },
    {
      question: "广东\"智造广东\"专项技改行动单企补助上限提至多少？",
      answer: "2000万元",
      explanation: "设备投资额30%财政奖补，助力转型升级",
      source: "广东\"智造广东\"专项技改行动",
      category: "经济",
      province: "广东",
      publishDate: null,
    },
    {
      question: "2026年广东稳就业方案计划全年新增城镇就业多少人？",
      answer: "110万人以上",
      explanation: "吸纳重点群体企业最高获50万元稳岗补贴",
      source: "2026年稳就业提质增效专项方案",
      category: "社会",
      province: "广东",
      publishDate: null,
    },
    {
      question: "2026年5月20日广东省水利厅启动了什么应急响应？",
      answer: "水利防汛Ⅳ级应急响应",
      explanation: "阳江阳春24小时降雨达943毫米",
      source: "广东省水利厅防汛应急响应",
      category: "社会",
      province: "广东",
      publishDate: new Date("2026-05-20"),
    },
    {
      question: "广东于5月21日进入什么降雨集中期？",
      answer: "龙舟水",
      explanation: "降水集中期偏长，伴有1至2个台风影响",
      source: "广东省水利厅“龙舟水”防御工作会议",
      category: "社会",
      province: "广东",
      publishDate: new Date("2026-05-21"),
    },
    {
      question: "广东省防总何时召开强降雨和“龙舟水”防御视频会议？",
      answer: "5月12日",
      explanation: "部署粤西和珠三角南部特大暴雨防范",
      source: "省防总强降雨防御视频会议",
      category: "社会",
      province: "广东",
      publishDate: new Date("2026-05-12"),
    },
    {
      question: "广东省纪委监委5月15日同日通报几名干部被查？",
      answer: "4名",
      explanation: "涵盖省直机关、地方党政、国企等领域",
      source: "南粤清风网5月15日通报",
      category: "党建",
      province: "广东",
      publishDate: new Date("2026-05-15"),
    },
    {
      question: "广东省人大常委会原委员何宁卡何时被通报接受审查调查？",
      answer: "5月15日",
      explanation: "长期任职省级重要财经岗位",
      source: "南粤清风网审查调查通报",
      category: "党建",
      province: "广东",
      publishDate: new Date("2026-05-15"),
    },
    {
      question: "广东省住建厅工程质量安全监管处副处长林清华何时被查？",
      answer: "5月27日",
      explanation: "涉嫌严重违纪违法接受审查调查",
      source: "南粤清风网审查调查通报",
      category: "党建",
      province: "广东",
      publishDate: new Date("2026-05-27"),
    },
    {
      question: "2026广东省综合交通发展大会于5月几日在广州举行？",
      answer: "5月29日",
      explanation: "推进大湾区交通一体化，培育新质生产力",
      source: "2026广东省综合交通发展大会",
      category: "经济",
      province: "广东",
      publishDate: new Date("2026-05-29"),
    },
    {
      question: "2026年广州市科技工作会议于5月几日召开？",
      answer: "5月15日",
      explanation: "总结“十四五”成果，部署“十五五”科技工作",
      source: "2026年广州市科技工作会议",
      category: "经济",
      province: "广东",
      publishDate: new Date("2026-05-15"),
    },
  ];

  for (const card of cards) {
    await prisma.card.create({
      data: {
        ...card,
        status: "approved",
      },
    });
  }

  console.log("Seed completed: 1 user + 20 cards created.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
