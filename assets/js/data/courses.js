/* 软件工程全栈知识题库 · 课程平台与学习路径映射 */
window.SE_COURSES = {
  platforms: [
    { name: "中国大学 MOOC（icourse163）", url: "https://www.icourse163.org/", note: "国内高校官方课程，中文、体系完整、可拿证书，适合打基础", lang: "中文" },
    { name: "B 站", url: "https://search.bilibili.com/all?keyword=", note: "国内最强免费自学资源池，配套实验与答疑社区活跃（搜索时在链接后拼课程名）", lang: "中文" },
    { name: "Coursera", url: "https://www.coursera.org/", note: "国际名校课程，作业与项目质量高，可申请助学金免费学", lang: "英文" },
    { name: "edX", url: "https://www.edx.org/", note: "MIT/Harvard/Berkeley 等官方课程，可免费旁听", lang: "英文" },
    { name: "MIT OpenCourseWare", url: "https://ocw.mit.edu/", note: "MIT 全课程资料（讲义/作业/考试）免费开放", lang: "英文" },
    { name: "CMU 课程主页", url: "https://www.cs.cmu.edu/", note: "CMU 各门课公开主页含 slides、作业与项目，难度高、含金量高", lang: "英文" },
    { name: "极客时间", url: "https://time.geekbang.org/", note: "国内一线工程师专栏，贴近大厂工程实践（高并发、中间件、架构）", lang: "中文" },
    { name: "CS 自学指南（csdiy.wiki）", url: "https://csdiy.wiki/", note: "中文社区整理的全球优质 CS 课程路线图，选课必备索引", lang: "中文" },
    { name: "teachyourselfcs.com", url: "https://teachyourselfcs.com/", note: "「自学计算机科学」经典指南，9 门核心课的权威推荐", lang: "英文" },
    { name: "OSSU 计算机自学路线", url: "https://github.com/ossu/computer-science", note: "开源社区维护的完整 CS 学位等价课程表（含进度跟踪）", lang: "英文" },
    { name: "MIT Missing Semester", url: "https://missing.csail.mit.edu/", note: "Shell、Git、调试、性能工具等「学校不教但天天用」的工程技能", lang: "英文" },
    { name: "refactoring.guru", url: "https://refactoring.guru/", note: "设计模式与重构的可视化教程，中文版可用，学习成本极低收益极高", lang: "中/英" },
    { name: "LeetCode", url: "https://leetcode.cn/", note: "算法刷题主战场，建议按类型专题刷而非按题号", lang: "中/英" },
    { name: "Google SRE 书（在线免费）", url: "https://sre.google/sre-book/table-of-contents/", note: "SRE 圣经，稳定性工程与运维体系的权威来源", lang: "英文" }
  ],
  books: [
    { title: "《计算机程序的构造和解释》（SICP）", author: "Abelson / Sussman", note: "编程思想启蒙，抽象与递归思维的源头", level: "入门-进阶" },
    { title: "《深入理解计算机系统》（CSAPP）", author: "Bryant / O'Hallaron", note: "贯通程序与硬件的必读书，配套 CMU 15-213 实验（Lab 含金量极高）", level: "核心" },
    { title: "《操作系统导论》（OSTEP）", author: "Arpaci-Dusseau", note: "免费在线，讲解清晰，配 xv6 实验最佳", level: "核心" },
    { title: "《计算机网络：自顶向下方法》", author: "Kurose / Ross", note: "自顶向下讲解，配套 Wireshark 实验，理解协议最友好", level: "核心" },
    { title: "《数据库系统概念》", author: "Silberschatz", note: "经典教材；配合 CMU 15-445 效果最佳", level: "核心" },
    { title: "《算法导论》（CLRS）", author: "Cormen 等", note: "算法理论权威参考，适合查阅与深入证明，不适合当第一本刷题书", level: "进阶" },
    { title: "《算法（第4版）》", author: "Sedgewick", note: "Java 实现，图解清晰，配 Coursera 课程练习最佳", level: "入门-核心" },
    { title: "《设计模式》", author: "GoF", note: "模式语言奠基之作，建议配合 refactoring.guru 阅读", level: "进阶" },
    { title: "《重构：改善既有代码的设计》", author: "Martin Fowler", note: "重构手法目录，遗留系统改造必读", level: "进阶" },
    { title: "《代码整洁之道》/《架构整洁之道》", author: "Robert C. Martin", note: "工程规范与 SOLID 的通俗讲解", level: "入门-进阶" },
    { title: "《数据密集型应用系统设计》（DDIA）", author: "Martin Kleppmann", note: "分布式系统与数据架构的现代圣经，大厂面试必备", level: "高阶" },
    { title: "《大型网站技术架构》", author: "李智慧", note: "中文语境下的架构演进案例，适合建立整体图景", level: "进阶" },
    { title: "《凤凰项目》/《加速》", author: "Kim / Forsgren", note: "DevOps 文化与实践，DORA 指标的理论来源", level: "进阶" },
    { title: "《软件工程：实践者的研究方法》", author: "Pressman", note: "软件工程教科书级参考，过程与方法的全景", level: "核心" },
    { title: "《人月神话》", author: "Brooks", note: "项目管理经典，「没有银弹」的思想源头", level: "通识" },
    { title: "《Clean Agile》/《Scrum 敏捷软件开发》", author: "Robert C. Martin / Schwaber", note: "敏捷实践的正确理解，避免形式化敏捷", level: "进阶" }
  ],
  byDomain: {
    d01: {
      name: "程序设计基础与数据结构",
      courses: [
        { name: "数据结构（邓俊辉，清华大学）", platform: "中国大学 MOOC / B站", url: "https://www.icourse163.org/course/THU-1002612004", note: "中文数据结构第一课，讲解细腻，配套实验与题库" },
        { name: "Algorithms, Part I & II（Sedgewick, Princeton）", platform: "Coursera", url: "https://www.coursera.org/learn/algorithms-part1", note: "算法工程实现最佳入门，Java 实现 + 可视化" },
        { name: "CS 61B Data Structures（UC Berkeley）", platform: "B站 / 课程主页", url: "https://sp21.datastructur.es/", note: "项目驱动（含 Gitlet、BYOW 大作业），工程感极强" },
        { name: "MIT 6.006 Introduction to Algorithms", platform: "MIT OCW", url: "https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/", note: "讲清复杂度与算法设计思想，配合 CLRS 阅读" },
        { name: "LeetCode 专题训练（数组/链表/树/DP/图）", platform: "LeetCode", url: "https://leetcode.cn/", note: "按类型刷 200-300 题，写题解与总结模板" }
      ]
    },
    d02: {
      name: "计算机组成原理与操作系统",
      courses: [
        { name: "15-213 Introduction to Computer Systems（CSAPP）", platform: "CMU / B站", url: "https://csapp.cs.cmu.edu/", note: "配套 9 个 Lab（Data/Bomb/Attack/Cache/Malloc/Shell/Proxy），做完脱胎换骨" },
        { name: "计算机组成原理（刘宏伟，哈工大）", platform: "中国大学 MOOC", url: "https://www.icourse163.org/course/HIT-309001", note: "中文组成原理经典，讲清数据通路与流水线" },
        { name: "6.S081 Operating System Engineering（xv6）", platform: "MIT OCW / B站", url: "https://pdos.csail.mit.edu/6.S081/2021/", note: "手写内核实验（系统调用/页表/线程/文件系统），操作系统最佳实践课" },
        { name: "操作系统（李治军，哈工大）", platform: "中国大学 MOOC / B站", url: "https://www.icourse163.org/course/HIT-1002531008", note: "以 Linux 0.11 源码为主线，理解内核实现" },
        { name: "Operating Systems: Three Easy Pieces（OSTEP）", platform: "免费在线书", url: "https://pages.cs.wisc.edu/~remzi/OSTEP/", note: "最好的操作系统入门读物，免费且讲得极清楚" }
      ]
    },
    d03: {
      name: "计算机网络与信息安全",
      courses: [
        { name: "计算机网络（李全龙，哈工大）", platform: "中国大学 MOOC", url: "https://www.icourse163.org/course/HIT-154005", note: "中文网课口碑最好，配套抓包实验" },
        { name: "CS 144 Introduction to Computer Networking（Stanford）", platform: "课程主页 / B站", url: "https://cs144.github.io/", note: "用 C++ 从零实现 TCP（Lab0-8），真正吃透协议栈" },
        { name: "计算机网络（郑烇，中国科学技术大学）", platform: "B站 / 中国大学 MOOC", url: "https://www.bilibili.com/video/BV1JV411t7ow", note: "讲解深入，适合作为第二遍强化" },
        { name: "Web Security Academy（PortSwigger 免费）", platform: "PortSwigger", url: "https://portswigger.net/web-security", note: "免费实战靶场，覆盖 OWASP Top 10，安全入门首选" },
        { name: "Cryptography I（Dan Boneh, Stanford）", platform: "Coursera", url: "https://www.coursera.org/learn/crypto", note: "密码学原理，理解 HTTPS 与签名机制的底层" }
      ]
    },
    d04: {
      name: "数据库系统原理",
      courses: [
        { name: "15-445 Database Systems（Andy Pavlo, CMU）", platform: "CMU / B站", url: "https://15445.courses.cs.cmu.edu/", note: "从零实现存储引擎/索引/执行器/并发控制（BusTub），数据库最佳课程" },
        { name: "数据库系统概论（王珊，中国人民大学）", platform: "中国大学 MOOC", url: "https://www.icourse163.org/course/RUC-488001", note: "中文经典教材配套课，理论与 SQL 扎实" },
        { name: "MySQL 实战 45 讲（林晓斌）", platform: "极客时间", url: "https://time.geekbang.org/column/intro/139", note: "生产问题视角讲索引、事务、锁、主从，实战性极强" },
        { name: "Redis 核心技术与实战（蒋德钧）", platform: "极客时间", url: "https://time.geekbang.org/column/intro/329", note: "缓存与高性能场景必学，含大量工程陷阱" },
        { name: "CS 186 Introduction to Database Systems（Berkeley）", platform: "课程主页", url: "https://cs186berkeley.net/", note: "项目驱动（SimpleDB），与 15-445 互补" }
      ]
    },
    d05: {
      name: "软件工程导论",
      courses: [
        { name: "6.031 Software Construction（MIT）", platform: "MIT OCW", url: "https://web.mit.edu/6.031/www/sp21/", note: "讲规格、抽象、测试、并发、设计模式，工程素养课" },
        { name: "17-313 Foundations of Software Engineering（CMU）", platform: "CMU 课程主页", url: "https://cmu-313.github.io/", note: "需求-设计-测试-DevOps 全流程 + 真实客户项目" },
        { name: "软件工程（北京大学）", platform: "中国大学 MOOC", url: "https://www.icourse163.org/course/PKU-1003004002", note: "中文软件工程体系课，覆盖过程模型与 UML" },
        { name: "UML 与设计模式（B站合集）", platform: "B站", url: "https://search.bilibili.com/all?keyword=UML%20设计模式", note: "配合真实代码案例理解模式使用场景" },
        { name: "《软件工程：实践者的研究方法》精读", platform: "书籍 + 笔记", url: "", note: "作为体系索引，重点读过程、需求、设计、测试、质量章节" }
      ]
    },
    d06: {
      name: "算法设计与分析",
      courses: [
        { name: "Algorithms, Part I & II（Princeton）", platform: "Coursera", url: "https://www.coursera.org/learn/algorithms-part2", note: "含图、字符串、DP 等高级主题与编程作业" },
        { name: "6.046J Design and Analysis of Algorithms（MIT）", platform: "MIT OCW", url: "https://ocw.mit.edu/courses/6-046j-design-and-analysis-of-algorithms-spring-2015/", note: "算法设计与证明的严谨训练（含 NP 完全性）" },
        { name: "CS 161 Design and Analysis of Algorithms（Stanford）", platform: "课程主页", url: "https://web.stanford.edu/class/cs161/", note: "讲义质量极高，含贪心/DP/随机化算法" },
        { name: "离散数学（B站合集）", platform: "B站 / 中国大学 MOOC", url: "https://search.bilibili.com/all?keyword=离散数学", note: "逻辑、集合、图论、组合计数基础，为算法与形式化打底" }
      ]
    },
    d07: {
      name: "编译原理与程序设计语言",
      courses: [
        { name: "CS 143 Compilers（Stanford）", platform: "课程主页 / B站", url: "https://web.stanford.edu/class/cs143/", note: "用 Java 实现 Cool 语言编译器（词法-语法-语义-代码生成）" },
        { name: "编译原理（国防科技大学 / 哈工大）", platform: "中国大学 MOOC / B站", url: "https://www.icourse163.org/course/NUDT-1003101005", note: "中文编译原理首选，覆盖 LR 分析与优化" },
        { name: "编译原理（李樾 / 谭添，南京大学）", platform: "B站", url: "https://search.bilibili.com/all?keyword=南京大学%20编译原理", note: "B站口碑极佳的编译与程序分析课程" },
        { name: "Crafting Interpreters（免费在线书）", platform: "在线书", url: "https://craftinginterpreters.com/", note: "手写两遍解释器（Tree-walk + 字节码 VM），上手最快的编译实践" }
      ]
    },
    d08: {
      name: "软件体系结构与设计模式",
      courses: [
        { name: "17-651 / 17-654 Software Architecture（CMU）", platform: "CMU 课程主页", url: "https://www.cs.cmu.edu/~ckaestne/", note: "架构质量属性、ATAM、架构决策记录，学术与工业结合" },
        { name: "设计模式与重构（refactoring.guru 中文版）", platform: "refactoring.guru", url: "https://refactoring.guru/zh/design-patterns", note: "图解模式与重构手法，学起来最快" },
        { name: "Microservices.io（Chris Richardson）", platform: "在线", url: "https://microservices.io/", note: "微服务模式目录（Saga、CQRS、API 网关等）权威参考" },
        { name: "软件体系结构（B站合集）", platform: "B站", url: "https://search.bilibili.com/all?keyword=软件体系结构", note: "中文体系结构课程，覆盖风格与评估方法" }
      ]
    },
    d09: {
      name: "软件测试与质量保证",
      courses: [
        { name: "Software Testing and Automation（University of Minnesota）", platform: "Coursera", url: "https://www.coursera.org/specializations/software-testing-automation", note: "测试设计技术 + 自动化，体系完整" },
        { name: "Software Testing（ISTQB 认证体系）", platform: "ISTQB 官方", url: "https://www.istqb.org/", note: "国际测试认证，知识框架标准、术语统一" },
        { name: "CS 169 Software Engineering（Berkeley，含测试与 CI）", platform: "课程主页", url: "https://cs169.github.io/", note: "以 TDD/BDD 与持续交付为核心的项目课" },
        { name: "混沌工程实践（Principles of Chaos）", platform: "官方站点", url: "https://principlesofchaos.org/", note: "韧性验证的方法论与实验原则" }
      ]
    },
    d10: {
      name: "人机交互与前端工程",
      courses: [
        { name: "Interaction Design（UC San Diego）", platform: "Coursera", url: "https://www.coursera.org/specializations/interaction-design", note: "HCI 与交互设计体系课，含设计流程与评估方法" },
        { name: "CS 142 Web Applications（Stanford）", platform: "课程主页", url: "https://web.stanford.edu/class/cs142/", note: "从零实现一个社交网站（含前后端与部署）" },
        { name: "web.dev Learn Performance / Core Web Vitals", platform: "web.dev（Google）", url: "https://web.dev/learn/performance/", note: "前端性能权威指南，指标与优化手法齐全" },
        { name: "WCAG 2.2 无障碍指南（W3C）", platform: "W3C", url: "https://www.w3.org/WAI/WCAG22/quickref/", note: "可访问性标准，产品级前端必读" }
      ]
    },
    d11: {
      name: "分布式系统与云计算",
      courses: [
        { name: "6.824 Distributed Systems（MIT）", platform: "MIT OCW / B站", url: "https://pdos.csail.mit.edu/6.824/", note: "用 Go 实现 MapReduce、Raft、KV 存储，分布式第一课" },
        { name: "Cloud Computing Concepts（UIUC, Indranil Gupta）", platform: "Coursera", url: "https://www.coursera.org/learn/cloud-computing", note: "共识、Gossip、分布式存储讲得清晰" },
        { name: "15-440 / 15-640 Distributed Systems（CMU）", platform: "CMU 课程主页", url: "https://www.cs.cmu.edu/~dga/15-440/", note: "理论深度高，配合论文阅读" },
        { name: "Kubernetes 官方教程（K8s the Hard Way / 官方文档）", platform: "Kubernetes 官方", url: "https://kubernetes.io/docs/tutorials/", note: "容器编排必备，建议手搭一次集群" },
        { name: "《数据密集型应用系统设计》（DDIA）精读", platform: "书籍", url: "https://dataintensive.net/", note: "分布式数据系统全景，面试与架构设计的核心参考" }
      ]
    },
    d12: {
      name: "形式化方法与程序分析",
      courses: [
        { name: "Static Program Analysis（李樾 / 谭添，南京大学）", platform: "B站 / 课程主页", url: "https://cs.nju.edu.cn/lity/teaching.htm", note: "中文程序分析最好的一门课，含指针分析、数据流、IFDS" },
        { name: "15-819 / 17-355 Program Analysis（CMU）", platform: "CMU 课程主页", url: "https://www.cs.cmu.edu/~aldrich/courses/", note: "抽象解释、类型系统与验证的进阶课" },
        { name: "Software Foundations（UPenn, Benjamin Pierce）", platform: "在线书", url: "https://softwarefoundations.cis.upenn.edu/", note: "用 Coq 做程序与证明，形式化验证入门经典" },
        { name: "TLA+ 官方学习资源（Leslie Lamport）", platform: "官方站点", url: "https://lamport.azurewebsites.net/tla/tla.html", note: "用 TLA+ 为分布式协议写规格并做模型检验" },
        { name: "CS 357 / 15-414 Formal Methods（CMU）", platform: "CMU 课程主页", url: "https://www.cs.cmu.edu/~emc/", note: "模型检验与 SMT 求解的工程应用" }
      ]
    },
    d13: {
      name: "经验软件工程、度量与过程改进",
      courses: [
        { name: "Empirical Software Engineering（Coursera / 学术课程）", platform: "Coursera", url: "https://www.coursera.org/", note: "实证方法、实验设计、数据分析在软件工程中的应用" },
        { name: "《Making Software》（Oram & Wilson 编）", platform: "书籍", url: "", note: "「什么方法真的有效」的实证证据汇总，破除工程迷思" },
        { name: "DORA 研究与实践（Accelerate / State of DevOps 报告）", platform: "DORA 官方", url: "https://dora.dev/", note: "DORA 四指标与能力模型，工程效能的权威来源" },
        { name: "《加速：企业数字化转型的 24 项核心能力》", platform: "书籍", url: "", note: "以数据论证 DevOps 与组织效能的关系" },
        { name: "MSR（Mining Software Repositories）会议论文选读", platform: "学术会议", url: "https://www.msrconf.org/", note: "挖掘代码仓库做实证研究的方法与数据集" }
      ]
    },
    d14: {
      name: "再工程、产品线与 AI 辅助软件工程",
      courses: [
        { name: "《重构》+ 绞杀者模式实践（Fowler 博客）", platform: "martinfowler.com", url: "https://martinfowler.com/bliki/StranglerFigApplication.html", note: "遗留系统渐进式改造的权威方法" },
        { name: "Software Product Lines（CMU SEI 资源）", platform: "SEI 官方", url: "https://www.sei.cmu.edu/", note: "产品线与可变性建模的工程方法" },
        { name: "Generative AI for Software Development（DeepLearning.AI）", platform: "DeepLearning.AI / Coursera", url: "https://www.deeplearning.ai/", note: "AI 辅助编码、评审与测试的工程实践" },
        { name: "GitHub Copilot 官方最佳实践与安全指南", platform: "GitHub Docs", url: "https://docs.github.com/", note: "AI 编程助手的团队落地规范与安全边界" }
      ]
    },
    d15: {
      name: "高并发系统设计与中间件",
      courses: [
        { name: "高并发系统设计 40 问（唐扬）", platform: "极客时间", url: "https://time.geekbang.org/column/intro/159", note: "从架构层面系统讲高并发，含缓存、消息、分库分表、限流" },
        { name: "Kafka 核心技术与实战（胡夕）", platform: "极客时间", url: "https://time.geekbang.org/column/intro/191", note: "消息队列原理与生产实践" },
        { name: "RocketMQ 实战与原理解析（李伟）", platform: "极客时间", url: "https://time.geekbang.org/column/intro/271", note: "事务消息与顺序消息的实现细节" },
        { name: "System Design Interview（Grokking / Alex Xu）", platform: "Grokking / 书籍", url: "https://www.educative.io/courses/grokking-modern-system-design-interview-for-engineers-managers", note: "系统设计面试方法论与经典案例（限流、短链、秒杀、聊天）" },
        { name: "《数据密集型应用系统设计》（DDIA）", platform: "书籍", url: "https://dataintensive.net/", note: "高并发与分布式设计的理论根基" }
      ]
    },
    d16: {
      name: "DevOps、SRE 与可观测性",
      courses: [
        { name: "Google SRE 三部曲（免费在线）", platform: "sre.google", url: "https://sre.google/books/", note: "SLO、错误预算、故障处理与运维体系的权威来源" },
        { name: "DevOps 实战（石雪峰 / 极客时间）", platform: "极客时间", url: "https://time.geekbang.org/column/intro/160", note: "CI/CD 流水线与工程效能实践" },
        { name: "《持续交付：发布可靠软件的系统方法》", platform: "书籍", url: "", note: "部署流水线设计的经典，概念至今不过时" },
        { name: "Prometheus + Grafana 官方文档与教程", platform: "官方", url: "https://prometheus.io/docs/introduction/overview/", note: "指标采集、PromQL 与告警规则实践" },
        { name: "OpenTelemetry 官方文档", platform: "官方", url: "https://opentelemetry.io/docs/", note: "统一可观测性标准（日志/指标/链路）" }
      ]
    },
    d17: {
      name: "工程协作、代码质量与职业素养",
      courses: [
        { name: "MIT Missing Semester（Shell/Git/调试/性能）", platform: "MIT", url: "https://missing.csail.mit.edu/", note: "最实用的工程基本功课，强烈建议第一周就学" },
        { name: "《代码整洁之道》+《架构整洁之道》", platform: "书籍", url: "", note: "命名、函数、注释、SOLID 的工程规范" },
        { name: "Google 工程实践文档（Code Review / 提交规范）", platform: "Google 开源", url: "https://google.github.io/eng-practices/", note: "大厂代码评审与提交规范的公开标准" },
        { name: "《人月神话》", platform: "书籍", url: "", note: "理解团队规模、沟通成本与项目管理的经典" },
        { name: "技术方案写作与评审（团队内部模板）", platform: "实践", url: "", note: "按「背景-目标-非目标-方案对比-详细设计-风险-里程碑」写 3 份真实方案并请人评审" }
      ]
    }
  },
  paths: [
    {
      id: "path-zero-to-faang",
      name: "非科班 12 个月冲刺大厂",
      for: "零基础 / 非计算机专业，目标是通过大厂面试并胜任工作",
      totalWeeks: 52,
      stages: [
        { name: "阶段一 · 编程地基（第 1-6 周）", goal: "选定主力语言，能独立写出 300 行以上的可运行程序", domains: [], extra: ["MIT Missing Semester（Shell/Git/调试）", "语言官方教程（Java/Go/Python 三选一）", "LeetCode 简单题 60 道"] },
        { name: "阶段二 · 数据结构与算法（第 7-16 周）", goal: "掌握复杂度思维，能独立完成中等难度算法题", domains: ["d01", "d06"], extra: ["LeetCode 专题 200 题（数组/链表/树/DP/图/二分/滑动窗口）", "写题解并归纳模板"] },
        { name: "阶段三 · 系统基础（第 17-28 周）", goal: "理解程序如何运行在机器、网络、数据库之上", domains: ["d02", "d03", "d04"], extra: ["CSAPP Lab 至少完成 3 个", "手写一个简易 HTTP 服务器 + LRU 缓存", "完成一次真实的慢查询优化"] },
        { name: "阶段四 · 工程与项目（第 29-40 周）", goal: "产出 2 个有复杂度、可讲清设计取舍的项目", domains: ["d05", "d07", "d09", "d10"], extra: ["参考项目案例库 p02/p04 落地一个完整项目", "补齐测试、CI、Docker 部署与 README"] },
        { name: "阶段五 · 分布式与架构（第 41-46 周）", goal: "能画出并讲清一个高并发系统的完整设计", domains: ["d08", "d11", "d15", "d16"], extra: ["每周 2 道系统设计题并写成方案文档", "读 DDIA 重点章节"] },
        { name: "阶段六 · 面试冲刺（第 47-52 周）", goal: "通过模拟面试，形成稳定的表达框架", domains: ["d17"], extra: ["高频题二刷 + 手写代码练习", "项目讲解按 STAR 结构打磨 3 遍", "模拟面试 10 场并复盘"] }
      ]
    },
    {
      id: "path-cs-core",
      name: "计算机核心课系统补强",
      for: "有编程经验但缺系统训练，想补齐科班核心课程",
      totalWeeks: 40,
      stages: [
        { name: "第一轮 · 语言与工具（第 1-4 周）", goal: "补齐工程工具链与代码规范", domains: ["d17"], extra: ["MIT Missing Semester", "Git 分支与 PR 流程实操"] },
        { name: "第二轮 · 硬件与系统（第 5-14 周）", goal: "完成 CSAPP + 操作系统实验", domains: ["d02"], extra: ["CSAPP 9 个 Lab", "MIT 6.S081 或 OSTEP 项目"] },
        { name: "第三轮 · 网络与数据（第 15-22 周）", goal: "完成 TCP 实现与数据库内核实验", domains: ["d03", "d04"], extra: ["Stanford CS144 Lab0-8", "CMU 15-445 BusTub 项目"] },
        { name: "第四轮 · 算法与理论（第 23-30 周）", goal: "具备算法证明与设计能力", domains: ["d01", "d06", "d07"], extra: ["Princeton Algorithms 编程作业", "手写一个解释器（Crafting Interpreters）"] },
        { name: "第五轮 · 工程与架构（第 31-40 周）", goal: "完成一个分布式系统项目", domains: ["d05", "d08", "d11"], extra: ["MIT 6.824 Raft Lab", "设计并实现一个微服务 Demo"] }
      ]
    },
    {
      id: "path-advanced",
      name: "硕士/架构师进阶方向",
      for: "已具备工程能力，想深入质量、验证与研究方向",
      totalWeeks: 36,
      stages: [
        { name: "第一阶段 · 质量与过程（第 1-8 周）", goal: "建立数据驱动的质量与效能体系", domains: ["d09", "d13"], extra: ["读 DORA 报告与《加速》", "为团队建立 DORA 指标看板"] },
        { name: "第二阶段 · 架构与分布式（第 9-18 周）", goal: "能主导中大型系统架构设计与评审", domains: ["d08", "d11", "d15"], extra: ["精读 DDIA", "完成一次架构评审并写 ADR"] },
        { name: "第三阶段 · 形式化与程序分析（第 19-28 周）", goal: "掌握静态分析与验证工具，能用于真实项目", domains: ["d12"], extra: ["南大程序分析课程 + 实现一个数据流分析器", "用 TLA+ 为业务协议写规格"] },
        { name: "第四阶段 · 智能工程与再工程（第 29-36 周）", goal: "把 AI 与遗留系统改造纳入工程体系", domains: ["d14"], extra: ["落地一次绞杀者模式改造", "建立团队 AI 编码规范与评测集"] }
      ]
    }
  ]
};
