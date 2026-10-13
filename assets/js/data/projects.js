/* 软件工程全栈知识题库 · 专业项目案例库 */
window.SE_PROJECTS = [
{
  id: "p01",
  name: "高并发电商交易平台",
  tag: "微服务 / 高并发",
  level: "进阶",
  weeks: "10-14 周",
  summary: "从单体起步、按需演进为微服务的完整电商核心链路：商品、库存、订单、支付、履约。重点训练「容量估算 → 瓶颈分析 → 一致性方案 → 降级预案」的完整思维。",
  business: "支撑日常流量与秒杀大促两类场景。日常以读为主（商品浏览、搜索），大促以写为主（下单、支付）且瞬时并发可达日常的 50 倍。核心矛盾是：库存不超卖、订单不重复、支付不丢单、系统不雪崩。",
  stack: ["Java 17 / Spring Boot 3", "Spring Cloud Alibaba（Nacos/Sentinel）", "MySQL 8 + ShardingSphere", "Redis 7（集群）", "RocketMQ / Kafka", "Elasticsearch（搜索）", "Kubernetes + Docker", "Prometheus + Grafana + SkyWalking"],
  scale: "日活 100 万，日订单 50 万，峰值下单 QPS 5000+，商品 SKU 千万级，订单表年增 2 亿行",
  roles: ["后端 3-4 人", "前端 1-2 人", "测试 1 人", "运维/SRE 1 人"],
  requirements: [
    { type: "功能", text: "用户注册登录、商品浏览与搜索、购物车、下单、支付（对接第三方）、订单查询与退款" },
    { type: "功能", text: "库存管理与扣减、优惠券与促销规则、订单状态机（待支付/已支付/已发货/已完成/已取消/退款中）" },
    { type: "功能", text: "秒杀活动：活动配置、资格校验、库存预扣、排队与结果通知" },
    { type: "非功能", text: "下单接口 P99 ≤ 300ms，商品详情 P99 ≤ 100ms；核心链路可用性 99.95%" },
    { type: "非功能", text: "库存不允许超卖，订单不允许重复创建，支付回调必须幂等" },
    { type: "非功能", text: "大促期间可水平扩容至日常 5 倍容量，非核心功能（推荐、评价）可降级" }
  ],
  architecture: {
    layers: [
      "接入层：CDN 静态化 + Nginx/网关（限流、鉴权、灰度）",
      "应用层：用户服务、商品服务、搜索服务、购物车服务、订单服务、库存服务、支付服务、营销服务",
      "异步层：RocketMQ 承担下单削峰、库存扣减、支付结果通知、履约流转",
      "数据层：MySQL 分库分表（订单按 user_id 分片）+ Redis 缓存 + ES 搜索 + 对象存储（图片）",
      "支撑层：配置中心、注册中心、链路追踪、日志采集、监控告警、分布式任务调度"
    ],
    decisions: [
      "起步用模块化单体，等出现独立扩缩容与团队边界需求后再按限界上下文拆分，避免过早分布式",
      "订单分片键选 user_id（用户维度查询最多），订单号查询通过「订单号携带用户 ID 基因」或映射表解决",
      "库存扣减采用「Redis 预扣 + DB 最终扣减 + 对账补偿」，兼顾性能与正确性",
      "跨服务一致性用事务消息/本地消息表实现最终一致，不用强一致 2PC"
    ]
  },
  dataModel: [
    { table: "t_order", fields: "order_id, user_id, total_amount, status, create_time, pay_time", note: "按 user_id 分 16 库 64 表；order_id 用雪花算法，含分片基因" },
    { table: "t_order_item", fields: "id, order_id, sku_id, price, quantity, amount", note: "与订单同库同分片，保证本地事务" },
    { table: "t_sku_stock", fields: "sku_id, total, available, locked, version", note: "乐观锁 version 防并发覆盖；大促库存预热到 Redis" },
    { table: "t_pay_record", fields: "id, order_id, channel, trade_no, amount, status", note: "支付流水，唯一索引 (channel, trade_no) 保证回调幂等" },
    { table: "t_local_message", fields: "id, biz_id, topic, payload, status, retry_count", note: "本地消息表，支撑最终一致" }
  ],
  apis: [
    { method: "GET", path: "/api/v1/skus/{id}", desc: "商品详情（多级缓存：本地 → Redis → DB）" },
    { method: "POST", path: "/api/v1/carts/items", desc: "加入购物车" },
    { method: "POST", path: "/api/v1/orders", desc: "创建订单（幂等键 requestId，返回排队中或成功）" },
    { method: "POST", path: "/api/v1/orders/{id}/pay", desc: "发起支付，返回支付渠道参数" },
    { method: "POST", path: "/api/v1/pay/callback/{channel}", desc: "支付回调（验签 + 幂等 + 事务更新订单状态）" },
    { method: "GET", path: "/api/v1/orders/{id}", desc: "订单详情（用户维度，命中分片）" },
    { method: "POST", path: "/api/v1/seckill/{activityId}/apply", desc: "秒杀资格申请（Lua 原子扣减）" }
  ],
  tests: [
    "单元测试：优惠券叠加规则、金额计算（BigDecimal + 分单位）、订单状态机迁移合法性",
    "集成测试：Testcontainers 起 MySQL/Redis/MQ，验证下单→扣库存→消息投递链路",
    "契约测试：订单服务与库存服务接口约定",
    "性能测试：JMeter 压测下单接口，验证 5000 QPS 下 P99 ≤ 300ms",
    "全链路压测：流量染色 + 影子库，验证大促峰值容量",
    "混沌工程：注入 Redis 故障、MQ 延迟、库存服务超时，验证降级与熔断",
    "一致性测试：并发下单 1000 次验证不超卖；重复回调 100 次验证幂等"
  ],
  milestones: [
    { phase: "M1 单体 MVP", deliverable: "用户/商品/订单/支付打通，单库单应用，基础测试", weeks: 3 },
    { phase: "M2 性能与缓存", deliverable: "多级缓存、索引优化、压测达标", weeks: 2 },
    { phase: "M3 异步与一致性", deliverable: "MQ 削峰、本地消息表、幂等与对账", weeks: 3 },
    { phase: "M4 秒杀与高可用", deliverable: "秒杀链路、限流熔断降级、多机房预案", weeks: 3 },
    { phase: "M5 可观测与演练", deliverable: "监控告警、全链路压测、混沌演练、故障预案", weeks: 2 }
  ],
  pitfalls: [
    "用数据库行锁扛秒杀 → 连接池耗尽、DB 打满，必须前置到 Redis 预扣",
    "支付回调未做幂等 → 重复发货与重复入账",
    "订单号查询走了全分片广播 → 慢查询，需基因法或映射表",
    "缓存与数据库双写不一致 → 采用先更库后删缓存 + binlog 补偿",
    "分库分表后跨片分页与统计困难 → 用 ES/数仓承接分析类查询"
  ],
  interview: [
    { q: "如何保证库存不超卖？", a: "三层防护：①Redis Lua 原子预扣（拦掉绝大多数并发）；②DB 扣减用 `UPDATE ... SET available = available - n WHERE sku_id=? AND available >= n` 保证最终正确；③对账任务校正 Redis 与 DB 差异。秒杀场景再加「一用户一单」的唯一索引与资格抽签。" },
    { q: "下单链路如何保证最终一致？", a: "本地事务写订单 + 本地消息表 → 异步投递扣库存/扣余额消息 → 下游幂等消费并回执 → 失败重试进死信 → 每日对账补偿。核心是「幂等键 + 状态机 + 重试 + 对账」四件套。" },
    { q: "大促前你会做哪些准备？", a: "容量评估与压测（含全链路压测）、依赖梳理与强弱依赖分离、限流阈值与降级预案配置、缓存预热、库存预扣数据校验、值班与回滚预案、监控大盘与告警分级、灰度与开关演练。" }
  ],
  relatedDomains: ["d01", "d04", "d11", "d15", "d16"]
},
{
  id: "p02",
  name: "在线考试与智能学习平台",
  tag: "全栈 / 实时 / 判分",
  level: "中级",
  weeks: "8-10 周",
  summary: "含组卷、在线作答、自动判分、主观题自评、成绩分析与学习画像的完整教育系统。适合作为第一个「能讲清楚全流程」的作品项目。",
  business: "面向培训机构与自学用户。核心场景：教师组卷发布 → 学生在线作答（含计时、断网续答）→ 客观题自动判分 + 主观题人工/自评 → 生成成绩报告与薄弱知识点分析 → 推荐练习。",
  stack: ["TypeScript + React / Vue 3", "Node.js（NestJS）或 Java Spring Boot", "PostgreSQL / MySQL", "Redis（会话、排行榜、限流）", "WebSocket（实时监考与进度）", "MinIO/OSS（附件）", "Docker Compose 部署"],
  scale: "支持 5000 人同时在线考试，单场 500 人并发提交，题库 10 万题",
  roles: ["全栈 2 人", "前端 1 人", "测试 1 人"],
  requirements: [
    { type: "功能", text: "题库管理（多题型、知识点标签、难度、导入导出 Excel/Word）" },
    { type: "功能", text: "组卷策略（按知识点/难度/题型随机抽题、固定卷、随机卷）" },
    { type: "功能", text: "在线作答：计时、自动保存、断网续答、交卷防重复提交" },
    { type: "功能", text: "判分引擎：客观题自动判分（含多选部分给分策略）、主观题关键词评分 + 人工/自评" },
    { type: "功能", text: "成绩报告：总分、小题得分、知识点掌握度雷达图、错题本、能力画像" },
    { type: "非功能", text: "交卷峰值 500 QPS 不丢卷；答案实时保存（最多丢 5 秒）" },
    { type: "非功能", text: "试卷内容与答案分离存储，考试中答案不可被前端获取" }
  ],
  architecture: {
    layers: [
      "前端：答题页（离线缓存 + 本地队列 + 断网重连补传）、教师端组卷与批阅",
      "接入层：Nginx + 网关（鉴权、限流、防重复提交）",
      "应用层：题库服务、组卷服务、考试服务、判分服务、统计服务",
      "异步层：判分任务队列（主观题评分、批量统计）、通知（站内信/邮件）",
      "数据层：PostgreSQL（题库、试卷、答卷）+ Redis（作答草稿、排行榜、分布式锁）+ 对象存储"
    ],
    decisions: [
      "答卷以「增量答案」为单位保存（每题一条记录或 JSON 字段 + 版本号），避免整卷覆盖导致并发丢失",
      "判分引擎做成策略模式：按题型注册评分器，支持部分给分与规则可配置",
      "考试中不下发正确答案，判分完全在服务端进行",
      "统计报表异步预计算（定时任务 + 物化视图），避免实时聚合压垮主库"
    ]
  },
  dataModel: [
    { table: "question", fields: "id, type, stem, options(json), answer(json), analysis, difficulty, knowledge_points[]", note: "answer 字段加密或独立表存储，仅判分服务可读" },
    { table: "exam_paper", fields: "id, title, strategy, total_score, duration, start_at, end_at, status", note: "组卷结果固化，保证同一场次试卷一致" },
    { table: "paper_question", fields: "paper_id, question_id, score, sort", note: "试卷与题目关联，含每题分值" },
    { table: "exam_attempt", fields: "id, paper_id, user_id, status, started_at, submitted_at, total_score", note: "唯一索引 (paper_id, user_id) 防重复考试" },
    { table: "attempt_answer", fields: "attempt_id, question_id, answer(json), score, version, saved_at", note: "版本号乐观锁，支持增量覆盖与冲突检测" },
    { table: "score_report", fields: "attempt_id, knowledge_stats(json), weak_points(json), rank", note: "异步生成的统计结果" }
  ],
  apis: [
    { method: "POST", path: "/api/exams/{id}/start", desc: "开始考试（校验资格、生成 attempt、返回题目不含答案）" },
    { method: "PUT", path: "/api/attempts/{id}/answers/{qid}", desc: "保存单题答案（带 version 乐观锁）" },
    { method: "POST", path: "/api/attempts/{id}/submit", desc: "交卷（幂等：同一 attempt 只能成功一次）" },
    { method: "GET", path: "/api/attempts/{id}/report", desc: "获取成绩报告（异步就绪后返回）" },
    { method: "POST", path: "/api/questions/import", desc: "批量导入题目（Excel 解析 + 校验 + 预览）" },
    { method: "GET", path: "/api/admin/stats/exams/{id}", desc: "考试统计（分数分布、题目正确率、知识点掌握度）" }
  ],
  tests: [
    "判分引擎单元测试：多选部分给分、填空多答案、主观题关键词命中与同义词",
    "并发测试：同一用户重复交卷 20 次，只生成一条成绩记录",
    "断网续答测试：断网期间本地队列缓存，恢复后补传且顺序正确",
    "峰值压测：500 人同时交卷，验证无丢卷、判分队列不积压",
    "安全测试：考试中抓包确认无法获取答案；越权访问他人答卷被拒",
    "报表一致性：随机抽 20 份答卷人工核对总分与小题分之和"
  ],
  milestones: [
    { phase: "M1 题库与组卷", deliverable: "题库 CRUD、Excel 导入、按策略组卷", weeks: 2 },
    { phase: "M2 作答与保存", deliverable: "答题页、计时、自动保存、断网续答", weeks: 2 },
    { phase: "M3 判分引擎", deliverable: "客观题自动判分、主观题评分与批阅流", weeks: 2 },
    { phase: "M4 报告与分析", deliverable: "成绩报告、知识点雷达、错题本", weeks: 2 },
    { phase: "M5 压测与上线", deliverable: "并发优化、部署、监控与备份", weeks: 2 }
  ],
  pitfalls: [
    "整卷覆盖保存 → 多标签页/重连时互相覆盖，必须增量 + 版本号",
    "答案随题目一起下发 → 直接可被 F12 查看，必须服务端判分",
    "交卷无幂等 → 重复点击生成多份成绩",
    "实时聚合统计拖垮主库 → 改为异步预计算",
    "计时依赖前端 → 服务端记录开始时间并以服务端为准判定超时"
  ],
  interview: [
    { q: "如何实现「断网续答」？", a: "前端本地（IndexedDB/localStorage）维护答案队列，每次作答入队并尝试上报；上报成功则出队并记录服务端版本号；重连后按顺序补传，服务端用 version 乐观锁合并，冲突以「最后写入 + 时间戳」策略解决并记录审计。" },
    { q: "主观题自动判分怎么做？", a: "规则法：关键词/同义词命中 + 权重 + 句子相似度（TF-IDF/编辑距离）给出建议分；LLM 法：给定评分细则（rubric）让模型打分并给出理由，用于辅助教师。工程上必须保留「人工复核」入口，自动分只作参考，避免误判影响成绩。" }
  ],
  relatedDomains: ["d01", "d04", "d05", "d09", "d10"]
},
{
  id: "p03",
  name: "企业级 CI/CD 与可观测平台",
  tag: "DevOps / 平台工程",
  level: "进阶",
  weeks: "8-12 周",
  summary: "为多团队提供统一交付流水线与监控能力的内部平台。训练「自动化、幂等、可观测、多租户隔离」的平台工程思维。",
  business: "公司有 40 个微服务、6 个研发团队，目前发布靠手工脚本、环境不一致、故障定位靠日志翻找。平台目标是：一键构建-测试-部署、环境即代码、指标日志链路统一接入、故障 5 分钟内定位。",
  stack: ["Go / Python（平台后端）", "React（控制台）", "Kubernetes + Helm", "GitLab CI / ArgoCD（GitOps）", "Terraform（IaC）", "Prometheus + Loki + Tempo + Grafana", "PostgreSQL + Redis", "Vault（密钥管理）"],
  scale: "40+ 服务、日均 200 次构建、50 次部署，监控指标 500 万时间序列",
  roles: ["平台后端 2 人", "前端 1 人", "SRE 1 人", "测试 1 人"],
  requirements: [
    { type: "功能", text: "流水线编排：构建、单测、静态扫描、镜像打包、部署、冒烟测试、通知" },
    { type: "功能", text: "多环境管理（dev/staging/prod）与配置管理，支持一键回滚" },
    { type: "功能", text: "发布策略：滚动、蓝绿、金丝雀（按比例/按用户标签）" },
    { type: "功能", text: "统一接入监控：指标、日志、链路，自动为服务生成大盘与告警规则模板" },
    { type: "功能", text: "权限与审计：按团队/项目隔离，操作留痕" },
    { type: "非功能", text: "流水线反馈时间：提交到单测结果 ≤ 5 分钟；平台自身可用性 99.9%" },
    { type: "非功能", text: "部署操作幂等、可重入，失败自动回滚并在 1 分钟内完成" }
  ],
  architecture: {
    layers: [
      "控制台：流水线可视化、发布审批、监控大盘入口、服务目录",
      "平台后端：流水线编排引擎（DAG 执行器）、部署控制器、监控接入服务、权限服务",
      "执行层：K8s Job/Pod 运行构建任务，隔离与资源配额；ArgoCD 做 GitOps 同步",
      "配置层：Git 作为唯一事实源（应用清单 + 环境配置 + Helm values），Vault 管理密钥",
      "数据层：PostgreSQL 存流水线与审计，对象存储存构建产物，Prometheus/Loki/Tempo 存可观测数据"
    ],
    decisions: [
      "GitOps：集群状态以 Git 仓库为准，任何变更走 PR，天然可审计可回滚",
      "流水线定义为代码（YAML），平台只做执行与展示，避免平台成为黑盒",
      "构建任务用临时 Pod，跑完即销毁，保证环境干净与隔离",
      "监控接入自动化：服务注册后自动生成标准大盘与告警规则，降低团队接入成本"
    ]
  },
  dataModel: [
    { table: "pipeline", fields: "id, project_id, name, config_yaml, triggers, created_by", note: "流水线定义，config_yaml 存 DAG 描述" },
    { table: "pipeline_run", fields: "id, pipeline_id, commit_sha, status, started_at, finished_at, trigger_by", note: "每次执行的记录" },
    { table: "stage_run", fields: "id, run_id, stage_name, status, log_url, duration_ms", note: "阶段级明细，支持可视化" },
    { table: "deployment", fields: "id, service, env, image_tag, strategy, status, rollback_to, approved_by", note: "部署记录，支撑审计与回滚" },
    { table: "audit_log", fields: "id, actor, action, target, before, after, ip, created_at", note: "全量操作审计" }
  ],
  apis: [
    { method: "POST", path: "/api/pipelines/{id}/runs", desc: "触发流水线（幂等键 commit_sha + pipeline_id）" },
    { method: "GET", path: "/api/runs/{id}", desc: "查询执行状态与阶段明细（SSE 推送实时日志）" },
    { method: "POST", path: "/api/deployments", desc: "发起部署（含策略与审批）" },
    { method: "POST", path: "/api/deployments/{id}/rollback", desc: "回滚到指定版本" },
    { method: "POST", path: "/api/services/{id}/observability/onboard", desc: "自动生成监控大盘与告警规则" },
    { method: "GET", path: "/api/audits", desc: "审计日志查询" }
  ],
  tests: [
    "流水线引擎单元测试：DAG 拓扑执行、失败传播、并发限制、重试语义",
    "幂等测试：同一 commit 重复触发不产生重复部署",
    "回滚演练：注入错误镜像，验证自动检测与 1 分钟内回滚成功",
    "权限测试：跨团队越权访问流水线/密钥被拒",
    "压测：50 条流水线并行执行，验证调度器不饥饿、资源配额生效",
    "故障演练：杀掉执行器 Pod，验证任务重调度与状态一致"
  ],
  milestones: [
    { phase: "M1 流水线执行引擎", deliverable: "DAG 执行器、日志流、基础 UI", weeks: 3 },
    { phase: "M2 部署与 GitOps", deliverable: "Helm 渲染、ArgoCD 接入、回滚", weeks: 2 },
    { phase: "M3 发布策略", deliverable: "滚动/蓝绿/金丝雀与自动回滚", weeks: 2 },
    { phase: "M4 可观测接入", deliverable: "指标日志链路统一接入 + 大盘模板", weeks: 2 },
    { phase: "M5 多租户与治理", deliverable: "权限隔离、审计、配额、成本看板", weeks: 2 }
  ],
  pitfalls: [
    "把密钥明文写进流水线变量 → 必须走 Vault 或 K8s Secret 并做掩码",
    "流水线定义存在平台数据库而非 Git → 无法评审与回滚，违背 GitOps",
    "构建环境不干净导致「本机能跑线上不能」 → 用临时 Pod + 固定基础镜像",
    "告警规则靠人工配 → 平台应提供模板与自动生成，否则接入成本高、覆盖率低",
    "回滚依赖人工判断 → 结合指标自动回滚（错误率/时延阈值）"
  ],
  interview: [
    { q: "如何设计一个安全的部署流程？", a: "变更走 PR（代码评审 + 自动化门禁）→ 流水线构建并生成不可变镜像（含 commit 摘要）→ 制品签名与扫描 → 部署到 staging 跑冒烟与集成测试 → 生产按金丝雀放量（1%→10%→50%→100%）→ 每阶段校验 SLO 指标，异常自动回滚 → 全程审计留痕。密钥通过 Vault 注入，最小权限原则。" },
    { q: "平台如何做到多团队隔离又不重复建设？", a: "租户模型（团队-项目-环境三层）+ RBAC + 资源配额（K8s namespace quota）+ 审计；共性能力（流水线模板、监控接入、部署策略）做成可复用模板与脚手架，团队只写业务配置，平台负责执行与治理。" }
  ],
  relatedDomains: ["d11", "d13", "d16", "d17"]
},
{
  id: "p04",
  name: "企业知识库智能问答系统（RAG）",
  tag: "AI 工程 / 检索增强",
  level: "进阶",
  weeks: "6-10 周",
  summary: "把公司文档变成可对话的知识助手。训练「AI 应用的工程化」：检索质量、上下文管理、评测与幻觉控制——这部分远比调模型重要。",
  business: "公司有数万份产品文档、制度、FAQ，员工查找困难、答案口径不一致。目标是提供带出处引用的问答助手，回答准确率 ≥ 85%，且必须能追溯到原文片段。",
  stack: ["Python（FastAPI）", "向量库（Milvus/pgvector）", "Elasticsearch（混合检索）", "LLM API + Embedding 模型", "Redis（缓存与限流）", "React 前端", "LangChain / LlamaIndex（可选）"],
  scale: "文档 5 万份、切片 200 万条，日问答 1 万次，P95 首字节 ≤ 2s",
  roles: ["后端/AI 工程 2 人", "前端 1 人", "测试 1 人"],
  requirements: [
    { type: "功能", text: "文档接入：多格式解析（PDF/Word/HTML/表格）、清洗、分块、向量化、增量更新" },
    { type: "功能", text: "检索：向量检索 + 关键词检索混合，重排序（Rerank），按权限过滤" },
    { type: "功能", text: "生成：基于检索上下文回答，必须给出来源引用（文档名 + 片段 + 链接）" },
    { type: "功能", text: "对话管理：多轮上下文、追问改写、会话历史与反馈（点赞/纠错）" },
    { type: "功能", text: "评测与运营：评测集、自动化评测指标、Badcase 归集与迭代" },
    { type: "非功能", text: "回答不得编造（无依据时应明确说「文档中未找到」），引用可点击跳转原文" },
    { type: "非功能", text: "按用户权限隔离检索范围，禁止越权访问敏感文档" }
  ],
  architecture: {
    layers: [
      "接入层：网关（鉴权、限流、审计）、前端对话界面",
      "检索层：混合检索（BM25 + 向量）+ RRF 融合 + Rerank 精排 + 权限过滤",
      "生成层：Prompt 编排（系统指令 + 上下文 + 引用要求）、LLM 调用、流式输出",
      "数据层：向量库 + ES + 原文存储 + 会话与反馈库",
      "离线层：文档解析流水线（异步任务）、评测流水线、指标看板"
    ],
    decisions: [
      "混合检索优于纯向量：制度类查询含大量专有名词与编号，关键词检索召回更稳",
      "分块策略按文档结构（标题层级）而非固定长度，保留语义完整与来源定位",
      "Prompt 强制「基于给定上下文回答 + 标注来源」，无依据时允许拒答以控制幻觉",
      "检索前置权限过滤，避免「先检索后过滤」导致敏感内容进入模型上下文"
    ]
  },
  dataModel: [
    { table: "document", fields: "id, title, source, owner, acl(json), version, updated_at", note: "文档元数据与权限" },
    { table: "chunk", fields: "id, doc_id, content, heading_path, page_no, embedding_id", note: "切片与结构路径，用于引用定位" },
    { table: "qa_session", fields: "id, user_id, title, created_at", note: "会话" },
    { table: "qa_message", fields: "id, session_id, role, content, citations(json), latency_ms, tokens", note: "消息与引用、成本数据" },
    { table: "qa_feedback", fields: "id, message_id, rating, comment, corrected_answer", note: "反馈与纠错，用于 Badcase 归集" },
    { table: "eval_case", fields: "id, question, expected_docs[], expected_answer, category", note: "评测集" }
  ],
  apis: [
    { method: "POST", path: "/api/documents", desc: "上传文档（异步解析与向量化，返回任务 ID）" },
    { method: "POST", path: "/api/chat", desc: "提问（SSE 流式返回答案与引用）" },
    { method: "POST", path: "/api/messages/{id}/feedback", desc: "提交反馈" },
    { method: "GET", path: "/api/search", desc: "纯检索接口（返回片段与来源，便于调试检索质量）" },
    { method: "POST", path: "/api/eval/run", desc: "运行评测集并输出指标" }
  ],
  tests: [
    "检索质量评测：Recall@k、MRR，针对 200 条标注问题",
    "端到端评测：答案正确率、引用准确率、拒答正确率（无答案问题）",
    "幻觉测试：构造文档中不存在的问题，验证系统拒答而非编造",
    "权限测试：低权限用户提问敏感问题，验证检索结果不含越权文档",
    "性能测试：并发 100 请求下 P95 首字节 ≤ 2s；向量库与 ES 负载",
    "解析质量测试：PDF 表格/多栏/扫描件（OCR）的解析正确率抽样"
  ],
  milestones: [
    { phase: "M1 文档流水线", deliverable: "解析-分块-向量化-入库，支持增量更新", weeks: 2 },
    { phase: "M2 检索与生成", deliverable: "混合检索 + Rerank + 引用生成 + 流式输出", weeks: 2 },
    { phase: "M3 权限与会话", deliverable: "ACL 过滤、多轮对话、追问改写", weeks: 1.5 },
    { phase: "M4 评测与迭代", deliverable: "评测集与自动化指标、Badcase 看板", weeks: 2 },
    { phase: "M5 运营与优化", deliverable: "缓存、成本控制、反馈闭环、效果调优", weeks: 1.5 }
  ],
  pitfalls: [
    "只做向量检索 → 专有名词/编号召回差，必须混合检索 + Rerank",
    "固定长度分块切断语义 → 答案片段不完整，应按结构分块并保留标题路径",
    "没有评测集 → 无法判断改动是否变好，只能靠「感觉」调参",
    "先检索后鉴权 → 敏感内容泄漏进上下文，必须检索前过滤",
    "把 LLM 输出直接当事实 → 必须要求引用并提供原文跳转，允许拒答"
  ],
  interview: [
    { q: "RAG 效果不好，你会从哪些环节排查？", a: "按链路分层排查：①解析（文档是否完整解析，表格/扫描件是否丢内容）；②分块（是否切断语义、块过大过小、是否带标题上下文）；③检索（召回率如何？是否该加关键词/混合检索/同义词/领域词典；Rerank 是否有效）；④生成（Prompt 是否明确约束、上下文是否过长导致「中间遗忘」、模型能力是否足够）；⑤评测（是否有标注集与客观指标，改动是否可归因）。经验上问题多出在检索与分块，而非模型本身。" },
    { q: "如何控制幻觉？", a: "四层：①检索质量（给到正确依据是前提）；②Prompt 约束（仅依据上下文回答、必须引用、无依据则拒答）；③输出校验（引用片段与答案一致性检查、关键实体核对）；④产品兜底（展示原文让用户自行核对、提供纠错反馈、对高风险问题（如制度、金额）走人工复核或明确免责声明）。" }
  ],
  relatedDomains: ["d04", "d09", "d12", "d14"]
},
{
  id: "p05",
  name: "实时协作与即时通讯系统",
  tag: "长连接 / 实时通信",
  level: "进阶",
  weeks: "8-10 周",
  summary: "实现多端在线的消息收发、群组、已读回执与在线状态。训练长连接管理、消息可靠投递与顺序保证。",
  business: "面向团队协作场景，支持单聊、群聊、消息漫游、多端同步、在线状态与已读回执。要求消息不丢、不重、不乱序，弱网可恢复。",
  stack: ["Go / Netty（长连接网关）", "WebSocket / 自定义协议", "Kafka（消息总线）", "Redis（路由表、在线状态、序列号）", "MySQL / TiDB（消息存储）", "对象存储（图片文件）", "K8s（网关水平扩展）"],
  scale: "在线 50 万长连接，日消息 2 亿条，单群 1000 人",
  roles: ["后端 3 人", "前端/客户端 2 人", "测试 1 人"],
  requirements: [
    { type: "功能", text: "单聊、群聊、消息类型（文本/图片/文件/表情）、消息撤回与编辑" },
    { type: "功能", text: "多端同步与消息漫游（离线消息、历史拉取）" },
    { type: "功能", text: "在线状态、正在输入、已读回执、未读数" },
    { type: "非功能", text: "消息可靠投递：不丢、不重、不乱序（会话内有序）" },
    { type: "非功能", text: "端到端时延 P99 ≤ 200ms（同城），弱网自动重连与补发" }
  ],
  architecture: {
    layers: [
      "接入层：长连接网关（WebSocket/TCP），维护连接与心跳，水平扩展",
      "逻辑层：消息服务（收、发、存储、推送）、群组服务、用户服务、在线状态服务",
      "路由层：Redis 维护「用户 → 网关实例」路由表，支持跨网关投递",
      "异步层：Kafka 作为消息总线，解耦投递、存储、推送、统计",
      "存储层：消息表按会话分片；离线消息用收件箱（inbox）模型；Redis 存序列号与状态"
    ],
    decisions: [
      "会话内用单调递增 seq（每个会话一个序列号）保证顺序与去重，客户端按 seq 排序与补洞",
      "写扩散 vs 读扩散：单聊/小群用写扩散（写收件箱，读快）；超大群用读扩散（拉取合并）",
      "消息先落库再推送（持久化优先），推送失败由离线消息补偿",
      "网关无状态（连接状态在 Redis/内存 + 路由表），便于弹性扩缩容"
    ]
  },
  dataModel: [
    { table: "message", fields: "id, conv_id, seq, sender_id, type, content, created_at", note: "按 conv_id 分片，唯一索引 (conv_id, seq) 保证顺序唯一" },
    { table: "conversation", fields: "id, type(single/group), members_hash, last_msg_id, last_seq", note: "会话元数据" },
    { table: "inbox", fields: "user_id, conv_id, last_read_seq, unread_count", note: "用户维度的已读位点与未读数" },
    { table: "group_member", fields: "group_id, user_id, role, join_time, mute", note: "群成员" },
    { table: "device_session", fields: "user_id, device_id, gateway_id, connected_at", note: "多端登录与路由" }
  ],
  apis: [
    { method: "WS", path: "/ws?token=xxx", desc: "建立长连接（鉴权 + 心跳）" },
    { method: "POST", path: "/api/messages", desc: "发送消息（客户端生成 client_msg_id 用于幂等）" },
    { method: "GET", path: "/api/conversations/{id}/messages?from_seq=&limit=", desc: "拉取历史消息（按 seq 分页）" },
    { method: "POST", path: "/api/conversations/{id}/read", desc: "上报已读位点" },
    { method: "POST", path: "/api/groups/{id}/members", desc: "群成员管理" }
  ],
  tests: [
    "可靠性测试：随机断网/杀进程，验证重连后消息不丢不重（对比 seq 序列无缺口）",
    "顺序测试：并发发送 1000 条消息，验证同一会话 seq 严格递增且客户端展示有序",
    "多端同步测试：三端同时在线，验证已读与撤回状态一致",
    "压测：模拟 50 万连接（连接数压测）+ 10 万 QPS 消息投递",
    "弱网测试：模拟高丢包/高延迟，验证补发与去重",
    "大群测试：1000 人群发消息，验证扇出延迟与存储压力"
  ],
  milestones: [
    { phase: "M1 单聊打通", deliverable: "长连接网关、鉴权、心跳、单聊收发", weeks: 2 },
    { phase: "M2 可靠性与顺序", deliverable: "seq 机制、ack 与重传、离线消息", weeks: 2 },
    { phase: "M3 群聊与多端", deliverable: "群组、写扩散/读扩散、多端同步与已读", weeks: 2.5 },
    { phase: "M4 扩展与优化", deliverable: "路由表、跨网关投递、K8s 扩容", weeks: 2 },
    { phase: "M5 压测与运维", deliverable: "连接数压测、监控告警、容量评估", weeks: 1.5 }
  ],
  pitfalls: [
    "用自增 ID 或时间戳排序 → 时钟漂移与并发导致乱序，必须用会话内 seq",
    "推送即认为送达 → 必须以客户端 ack 为准，未 ack 走离线补偿",
    "网关有状态不可扩展 → 路由表 + 无状态设计，支持水平扩容",
    "超大群用写扩散 → 扇出爆炸，必须切换读扩散",
    "重连后全量拉取 → 流量与延迟双高，应按 last_seq 增量补拉"
  ],
  interview: [
    { q: "如何保证消息不丢、不重、不乱序？", a: "不丢：客户端发 → 服务端落库 → 返回 ack（客户端未收到 ack 则重发）→ 投递到对端 → 对端回 ack，未 ack 存离线消息。不重：客户端用 client_msg_id 幂等去重，服务端按 (conv_id, client_msg_id) 唯一约束。不乱序：每个会话维护单调递增 seq，客户端按 seq 排序并检测缺口补拉。" },
    { q: "50 万长连接怎么支撑？", a: "网关水平扩展（单机数万连接，靠 epoll/IO 多路复用 + 轻量协议 + 心跳保活）；路由表用 Redis 记录 user→gateway 映射支持跨网关投递；连接层与业务层分离；K8s 按连接数与流量指标弹性伸缩；心跳间隔与超时调优减少无效重连。" }
  ],
  relatedDomains: ["d02", "d03", "d11", "d15"]
}
];
